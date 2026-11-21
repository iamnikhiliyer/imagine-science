import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateProject, selectReviewFrames, checkAssets } from '../skills/imagine-science/scripts/project.mjs';

const fixture = () => ({
  schemaVersion: 1, compositionId: 'Example', title: 'Example',
  width: 1280, height: 720, fps: 30, durationInFrames: 120,
  scenes: [
    { id: 'intro', startFrame: 0, endFrame: 60, title: 'Introduction', caption: 'An illustration.' },
    { id: 'end', startFrame: 60, endFrame: 120, title: 'Conclusion', caption: 'A conclusion.' },
  ],
  cues: [{ frame: 30, label: 'Key event' }], assets: [],
  audio: { mode: 'silent', path: null, captions: [], speechWindows: [] },
  review: { extraFrames: [42], maxFrames: 80 }, stationaryRegions: [],
});

test('accepts a complete silent timeline', () => assert.doesNotThrow(() => validateProject(fixture())));
test('rejects gaps, overlaps, and incomplete scene coverage', () => {
  for (const start of [59, 61]) {
    const p = fixture(); p.scenes[1].startFrame = start;
    assert.throws(() => validateProject(p), /contiguous/);
  }
  const p = fixture(); p.scenes[1].endFrame = 119;
  assert.throws(() => validateProject(p), /cover/);
});
test('rejects duplicate scene identifiers', () => {
  const p = fixture(); p.scenes[1].id = 'intro';
  assert.throws(() => validateProject(p), /unique/);
});
test('rejects noninteger frames and out-of-range cues', () => {
  for (const frame of [-1, 120, 3.5, NaN]) {
    const p = fixture(); p.cues[0].frame = frame;
    assert.throws(() => validateProject(p), /frame/i);
  }
});
test('requires even H.264 dimensions and a positive frame rate', () => {
  for (const [key, value] of [['width', 1279], ['height', 0], ['fps', 0]]) {
    const p = fixture(); p[key] = value;
    assert.throws(() => validateProject(p));
  }
});
test('rejects unsafe public asset paths on every platform', () => {
  for (const file of ['../private.png', '/private.png', 'C:\\private.png', 'https://example.org/a.png', 'a/../../b.png', 'a\\..\\b.png']) {
    const p = fixture(); p.assets = [{ path: file, kind: 'illustrative', source: 'Original', license: 'MIT' }];
    assert.throws(() => validateProject(p), /relative public/);
  }
});
test('requires a source, rights statement, and valid optional hash for assets', () => {
  const p = fixture(); p.assets = [{ path: 'a.png', kind: 'generated', source: '', license: 'MIT' }];
  assert.throws(() => validateProject(p), /source/);
  p.assets[0].source = 'Text prompt'; p.assets[0].sha256 = 'bad';
  assert.throws(() => validateProject(p), /sha256/);
});
test('narrated mode requires a file and bounded nonoverlapping captions', () => {
  const p = fixture(); p.audio.mode = 'narrated';
  assert.throws(() => validateProject(p), /audio.path/);
  p.audio.path = 'voice.wav';
  p.audio.captions = [{ startFrame: 0, endFrame: 60, text: 'A' }, { startFrame: 59, endFrame: 80, text: 'B' }];
  assert.throws(() => validateProject(p), /caption/i);
});
test('silent mode cannot accidentally include a narration path', () => {
  const p = fixture(); p.audio.path = 'voice.wav';
  assert.throws(() => validateProject(p), /silent/);
});
test('stationary checks must fit the canvas and span consecutive frames', () => {
  const p = fixture();
  p.stationaryRegions = [{ x: 1200, y: 0, width: 200, height: 100, startFrame: 0, endFrame: 30, maxMeanDifference: .15 }];
  assert.throws(() => validateProject(p), /region/i);
});
test('review includes first/last, boundary neighbors, cues, and explicit frames', () => {
  const frames = selectReviewFrames(fixture());
  for (const f of [0, 1, 2, 30, 42, 58, 59, 60, 61, 62, 117, 118, 119]) assert.ok(frames.includes(f), `${f} missing`);
  assert.deepEqual(frames, [...new Set(frames)].sort((a, b) => a - b));
});
test('review refuses to silently discard required evidence to fit its budget', () => {
  const p = fixture(); p.review.maxFrames = 2;
  assert.throws(() => selectReviewFrames(p), /budget/);
});
test('asset checks detect missing files, hash changes, and symlink escapes', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'imagine-assets-'));
  try {
    await mkdir(path.join(root, 'public'));
    const p = fixture(); p.assets = [{ path: 'plate.txt', kind: 'illustrative', source: 'Original', license: 'MIT' }];
    await assert.rejects(checkAssets(root, p), /ENOENT/);
    await writeFile(path.join(root, 'public/plate.txt'), 'original');
    p.assets[0].sha256 = createHash('sha256').update('original').digest('hex');
    await checkAssets(root, p);
    await writeFile(path.join(root, 'public/plate.txt'), 'modified');
    await assert.rejects(checkAssets(root, p), /hash/i);
    await writeFile(path.join(root, 'private.txt'), 'private');
    await symlink(path.join(root, 'private.txt'), path.join(root, 'public/escape.txt'));
    p.assets[0].path = 'escape.txt'; delete p.assets[0].sha256;
    await assert.rejects(checkAssets(root, p), /outside public/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
