import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadProject, selectReviewFrames } from './project.mjs';

export function projectRequire(root) {
  return createRequire(path.join(root, 'package.json'));
}

async function withComposition(root, operation) {
  const project = await loadProject(root);
  const require = projectRequire(root);
  const { bundle } = require('@remotion/bundler');
  const renderer = require('@remotion/renderer');
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public'), outDir: path.join(root, 'out/bundle') });
  const browser = await renderer.openBrowser('chrome', { browserExecutable: process.env.IMAGINE_CHROME ?? null });
  try {
    const composition = await renderer.selectComposition({ serveUrl, id: project.compositionId, puppeteerInstance: browser });
    for (const key of ['width', 'height', 'fps', 'durationInFrames']) assert.equal(composition[key], project[key], `Composition ${key} differs from film.project.json`);
    return await operation({ project, serveUrl, browser, composition, renderer });
  } finally { await browser.close({ silent: true }); }
}

export async function renderProject(root, file) {
  assert.equal(path.extname(file).toLowerCase(), '.mp4', 'Render output must end in .mp4');
  await mkdir(path.dirname(file), { recursive: true });
  return withComposition(root, async ({ serveUrl, browser, composition, renderer }) => {
    const concurrency = Number(process.env.IMAGINE_CONCURRENCY ?? 2);
    assert.ok(Number.isInteger(concurrency) && concurrency > 0, 'IMAGINE_CONCURRENCY must be a positive integer');
    let lastProgress = -1;
    await renderer.renderMedia({
      serveUrl, composition, puppeteerInstance: browser, outputLocation: file,
      codec: 'h264', crf: 18, imageFormat: 'png', pixelFormat: 'yuv420p', concurrency,
      onProgress: ({ progress }) => {
        const step = Math.floor(progress * 4);
        if (step > lastProgress) { console.log(`Rendering ${step * 25}%`); lastProgress = step; }
      },
    });
    console.log(`Rendered ${file}`);
  });
}

export async function reviewProject(root, requestedFrames = []) {
  // Validate requests before starting a browser or bundling.
  const project = await loadProject(root);
  const frames = requestedFrames.length ? [...new Set(requestedFrames)].sort((a, b) => a - b) : selectReviewFrames(project);
  assert.ok(frames.length <= project.review.maxFrames, 'Requested review exceeds frame budget');
  assert.ok(frames.every(f => Number.isSafeInteger(f) && f >= 0 && f < project.durationInFrames), 'Review frames must be integers inside the timeline');
  return withComposition(root, async ({ serveUrl, browser, composition, renderer }) => {
    const directory = path.join(root, 'out/review');
    await mkdir(directory, { recursive: true });
    for (const frame of frames) await renderer.renderStill({ serveUrl, composition, puppeteerInstance: browser, frame, imageFormat: 'png', output: path.join(directory, `frame-${String(frame).padStart(6, '0')}.png`) });
    const evidence = { compositionId: project.compositionId, frames, fps: project.fps, durationInFrames: project.durationInFrames, selection: requestedFrames.length ? 'explicit' : 'boundaries, cues, and extraFrames', status: 'unreviewed', coverage: 'Sampled stills only; motion, sound, and scientific correctness require separate review.' };
    await writeFile(path.join(directory, 'frames.json'), JSON.stringify(evidence, null, 2) + '\n');
    const report = [
      `# ${project.title} — review`, '', '**Status: unreviewed.** Rendering evidence does not grade it.', '',
      evidence.coverage, '', `Frames: ${frames.join(', ')}`, '',
      '| Frame | Finding | Severity | Proposed correction |', '| --- | --- | --- | --- |', '',
      'Record findings after inspecting the PNGs. Read the skill’s visual-review reference for the rubric.', '',
      'Watch continuous motion and listen to audio separately. Record scientific review separately from aesthetic scores.', '',
      ...frames.map(frame => `![Frame ${frame}](frame-${String(frame).padStart(6, '0')}.png)`), '',
    ].join('\n');
    await writeFile(path.join(directory, 'review.md'), report);
    console.log(`Rendered ${frames.length} review frames to ${directory}; visual inspection is pending.`);
  });
}
