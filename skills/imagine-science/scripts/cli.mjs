#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadProject, selectReviewFrames } from './project.mjs';
import { webExport } from './web-export.mjs';
import { subtitles } from './subtitles.mjs';
import { verifyMedia } from './media.mjs';
import { projectRequire, renderProject, reviewProject } from './rendering.mjs';

const usage = `Imagine Science — run from the root of a trusted film project

  doctor                    Check Node, FFmpeg, and local Remotion dependencies
  validate                  Validate film.project.json and registered assets
  review [FRAME ...]        Render review PNGs and an unreviewed report
  render [OUTPUT.mp4]       Export H.264 (default: out/film.mp4)
  verify [INPUT.mp4]        Decode and check export (default: out/film.mp4)
  web MAX_BYTES [IN] [OUT]  Package a size-limited MP4 (out/film.mp4 → out/web.mp4)
  subtitles [OUTPUT.vtt]    Write aligned phrase captions (default: out/en.vtt)
  contact-sheet [INPUT.mp4] Sample a 5×6 overview (default: out/film.mp4)

Optional: IMAGINE_CHROME chooses Chrome; IMAGINE_CONCURRENCY sets render workers.
`;

async function main() {
  const [command = 'help', ...args] = process.argv.slice(2);
  const root = process.cwd();
  if (['help', '--help', '-h'].includes(command)) { console.log(usage); return; }
  assert.ok(['doctor', 'validate', 'review', 'render', 'verify', 'web', 'subtitles', 'contact-sheet'].includes(command), `Unknown command: ${command}\n${usage}`);
  if (command === 'web') assert.ok(args.length >= 1 && args.length <= 3, 'Usage: web MAX_BYTES [INPUT.mp4] [OUTPUT.mp4]');
  else if (command !== 'review') assert.ok(args.length <= (['doctor', 'validate'].includes(command) ? 0 : 1), 'Too many arguments');
  if (command === 'doctor') {
    const [major, minor] = process.versions.node.split('.').map(Number);
    assert.ok(major > 22 || (major === 22 && minor >= 13), 'Node 22.13+ is required');
    console.log(`Node ${process.versions.node}`);
    for (const binary of ['ffmpeg', 'ffprobe']) {
      const version = execFileSync(binary, ['-version'], { encoding: 'utf8' }).split('\n')[0];
      console.log(version);
    }
    const require = projectRequire(root);
    const names = ['remotion', '@remotion/renderer', '@remotion/bundler', '@remotion/cli'];
    const versions = names.map(name => require(`${name}/package.json`).version);
    assert.equal(new Set(versions).size, 1, 'All Remotion packages must have the same version');
    console.log(`Remotion ${versions[0]} (resolved from target project)`);
  }
  const project = await loadProject(root);
  if (command === 'doctor' || command === 'validate') {
    console.log(`Valid: ${project.title}; ${project.durationInFrames} frames; ${selectReviewFrames(project).length} default review stills.`);
    return;
  }
  if (command === 'review') { await reviewProject(root, args.map(Number)); return; }
  if (command === 'web') {
    const output = path.resolve(root, args[2] ?? 'out/web.mp4');
    const bytes = await webExport(path.resolve(root, args[1] ?? 'out/film.mp4'), output, Number(args[0]), project);
    console.log('Verified ' + output + ' (' + bytes + ' bytes)');
    return;
  }
  if (command === 'subtitles') {
    const file = path.resolve(root, args[0] ?? 'out/en.vtt');
    assert.equal(path.extname(file).toLowerCase(), '.vtt', 'Subtitle output must end in .vtt');
    const contents = subtitles(project);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, contents);
    console.log('Wrote ' + file);
    return;
  }
  const file = path.resolve(root, args[0] ?? 'out/film.mp4');
  if (command === 'render') { await renderProject(root, file); return; }
  if (command === 'verify') {
    const result = verifyMedia(file, project);
    const hash = createHash('sha256').update(await readFile(file)).digest('hex');
    const report = { ...result, sha256: hash, scope: 'Technical media checks only; no semantic, scientific, or aesthetic approval.' };
    await mkdir(path.join(root, 'out'), { recursive: true });
    await writeFile(path.join(root, 'out/verification.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  const metadata = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_format', '-of', 'json', file], { encoding: 'utf8' }));
  const duration = Number(metadata.format.duration);
  assert.ok(Number.isFinite(duration) && duration > 0, 'Cannot sample an invalid duration');
  const output = path.join(root, 'out/contact-sheet.jpg');
  await mkdir(path.dirname(output), { recursive: true });
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', file, '-vf', `fps=30/${duration},scale=384:-2,tile=5x6:padding=6:margin=6:color=0x102023`,
    '-frames:v', '1', '-update', '1', output,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  console.log(`Created ${output}; overview sampling does not cover every frame.`);
}

main().catch(error => { console.error(`Imagine Science: ${error.message}`); process.exitCode = 1; });
