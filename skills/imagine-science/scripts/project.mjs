import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const text = (value, name) => assert.ok(typeof value === 'string' && value.trim(), `${name} must be nonempty text`);
const integer = (value, name, min = 0) => assert.ok(Number.isSafeInteger(value) && value >= min, `${name} must be an integer >= ${min}`);
const list = (value, name) => assert.ok(Array.isArray(value), `${name} must be an array`);
const frame = (value, p) => { integer(value, 'frame'); assert.ok(value < p.durationInFrames, 'frame exceeds duration'); };
const range = (item, p, name) => {
  integer(item.startFrame, `${name} startFrame`);
  integer(item.endFrame, `${name} endFrame`, 1);
  assert.ok(item.startFrame < item.endFrame && item.endFrame <= p.durationInFrames, `${name} range is outside timeline`);
};

export function publicPath(file) {
  assert.ok(typeof file === 'string' && file.length && !file.includes('\\') && !file.includes(':') &&
    !file.includes('\0') && !path.posix.isAbsolute(file) && !file.split('/').some(s => s === '..' || !s),
  'Asset paths must be relative public paths without traversal, URLs, or drive letters');
  return file;
}

export function validateProject(p) {
  assert.equal(p.schemaVersion, 1, 'Unsupported schemaVersion');
  text(p.title, 'title'); text(p.compositionId, 'compositionId');
  assert.match(p.compositionId, /^[A-Za-z0-9-]+$/, 'Invalid compositionId');
  for (const key of ['width', 'height']) {
    integer(p[key], key, 2); assert.equal(p[key] % 2, 0, `${key} must be even for H.264`);
  }
  assert.ok(Number.isFinite(p.fps) && p.fps > 0 && p.fps <= 120, 'fps must be > 0 and <= 120');
  integer(p.durationInFrames, 'durationInFrames', 1);
  list(p.scenes, 'scenes'); assert.ok(p.scenes.length, 'scenes cannot be empty');
  let end = 0; const ids = new Set();
  for (const scene of p.scenes) {
    text(scene.id, 'scene id'); text(scene.title, 'scene title'); text(scene.caption, 'scene caption');
    assert.ok(!ids.has(scene.id), 'Scene ids must be unique'); ids.add(scene.id);
    range(scene, p, 'scene'); assert.equal(scene.startFrame, end, 'Scenes must be contiguous and start at zero');
    end = scene.endFrame;
  }
  assert.equal(end, p.durationInFrames, 'Scenes must cover the complete film');
  list(p.cues, 'cues');
  for (const cue of p.cues) { frame(cue.frame, p); text(cue.label, 'cue label'); }
  list(p.assets, 'assets'); const assetPaths = new Set();
  for (const asset of p.assets) {
    publicPath(asset.path); text(asset.source, 'asset source'); text(asset.license, 'asset license');
    assert.ok(!assetPaths.has(asset.path), 'Asset paths must be unique'); assetPaths.add(asset.path);
    assert.ok(['measured', 'simulated', 'illustrative', 'generated'].includes(asset.kind), 'Invalid asset kind');
    if (asset.sha256 !== undefined) assert.match(asset.sha256, /^[a-f0-9]{64}$/, 'Invalid asset sha256');
  }
  assert.ok(['silent', 'narrated'].includes(p.audio?.mode), 'audio.mode must be silent or narrated');
  if (p.audio.mode === 'narrated') publicPath(p.audio.path ?? assert.fail('audio.path is required for narration'));
  else assert.equal(p.audio.path, null, 'silent mode requires a null audio.path');
  list(p.audio.captions, 'audio captions'); list(p.audio.speechWindows, 'speechWindows');
  if (p.audio.mode === 'silent') assert.ok(!p.audio.captions.length && !p.audio.speechWindows.length, 'silent mode cannot have captions or speechWindows');
  let captionEnd = 0;
  for (const caption of p.audio.captions) {
    range(caption, p, 'caption'); text(caption.text, 'caption text');
    assert.ok(caption.startFrame >= captionEnd, 'Captions must be ordered and nonoverlapping'); captionEnd = caption.endFrame;
  }
  for (const window of p.audio.speechWindows) {
    range(window, p, 'speech window');
    assert.ok(Number.isFinite(window.minRms) && window.minRms > 0 && window.minRms <= 1, 'speech window minRms must be > 0 and <= 1');
  }
  list(p.review?.extraFrames, 'review.extraFrames');
  integer(p.review.maxFrames, 'review.maxFrames', 1);
  for (const f of p.review.extraFrames) frame(f, p);
  list(p.stationaryRegions, 'stationaryRegions');
  for (const region of p.stationaryRegions) {
    range(region, p, 'stationary region');
    assert.ok(region.endFrame - region.startFrame >= 2, 'Stationary region needs at least two frames');
    for (const key of ['x', 'y', 'width', 'height']) integer(region[key], `region ${key}`, key === 'x' || key === 'y' ? 0 : 2);
    assert.ok(region.x + region.width <= p.width && region.y + region.height <= p.height, 'Stationary region must fit the canvas');
    assert.ok(Number.isFinite(region.maxMeanDifference) && region.maxMeanDifference >= 0, 'Invalid region maxMeanDifference');
  }
  return p;
}

export function selectReviewFrames(p) {
  validateProject(p);
  const frames = new Set(p.review.extraFrames);
  const boundaries = [0, p.durationInFrames - 1, ...p.scenes.map(s => s.startFrame)];
  for (const boundary of boundaries) for (let offset = -2; offset <= 2; offset++) {
    const f = boundary + offset;
    if (f >= 0 && f < p.durationInFrames) frames.add(f);
  }
  for (const cue of p.cues) frames.add(cue.frame);
  assert.ok(frames.size <= p.review.maxFrames, `Review needs ${frames.size} frames; budget is ${p.review.maxFrames}. Increase it explicitly or simplify the timeline.`);
  return [...frames].sort((a, b) => a - b);
}

export async function checkAssets(root, p) {
  const assets = [...p.assets];
  if (p.audio.path && !assets.some(a => a.path === p.audio.path)) assert.fail('Narration must also appear in assets with source and license');
  if (!assets.length) return;
  const publicRoot = await realpath(path.join(root, 'public'));
  for (const asset of assets) {
    const resolved = await realpath(path.join(publicRoot, publicPath(asset.path)));
    const relative = path.relative(publicRoot, resolved);
    assert.ok(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), 'Asset resolves outside public');
    const content = await readFile(resolved);
    if (asset.sha256) assert.equal(createHash('sha256').update(content).digest('hex'), asset.sha256, `Asset hash mismatch: ${asset.path}`);
  }
}

export async function loadProject(root = process.cwd()) {
  const project = validateProject(JSON.parse(await readFile(path.join(root, 'film.project.json'), 'utf8')));
  await checkAssets(root, project);
  return project;
}
