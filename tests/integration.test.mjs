import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { verifyMedia } from '../skills/imagine-science/scripts/media.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const settings = () => ({ width: 128, height: 72, fps: 10, durationInFrames: 10, audio: { mode: 'silent', speechWindows: [] }, stationaryRegions: [] });

test('verifies actual decoded silent and narrated media, signal energy, and stationary regions', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'imagine-media-'));
  try {
    const silent = path.join(directory, 'silent.mp4');
    execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=white:s=128x72:r=10:d=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', silent]);
    const p = settings();
    p.stationaryRegions = [{ x: 1, y: 1, width: 31, height: 31, startFrame: 2, endFrame: 8, maxMeanDifference: .01 }];
    const checked = verifyMedia(silent, p);
    assert.equal(checked.frames, 10);
    assert.equal(checked.stationary[0].peak, 0);
    assert.equal(checked.stationary[0].count, 5);
    const voiced = path.join(directory, 'voiced.mp4');
    execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=white:s=128x72:r=10:d=1', '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', voiced]);
    p.audio = { mode: 'narrated', speechWindows: [{ startFrame: 1, endFrame: 9, minRms: .01 }] };
    assert.ok(verifyMedia(voiced, p).speech[0].rms > .01);
    p.audio.speechWindows[0].minRms = .9;
    assert.throws(() => verifyMedia(voiced, p), /below threshold/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('an installed skill outside the repository resolves the target project dependencies', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'imagine-installed-'));
  try {
    await cp(path.join(root, 'skills/imagine-science'), path.join(directory, 'imagine-science'), { recursive: true });
    const output = execFileSync(process.execPath, [path.join(directory, 'imagine-science/scripts/cli.mjs'), 'doctor'], { cwd: root, encoding: 'utf8' });
    assert.match(output, /resolved from target project/);
    assert.match(output, /Valid:/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('invalid CLI commands and out-of-range review frames fail before rendering', () => {
  for (const args of [['unknown'], ['review', '-1'], ['review', '1.5'], ['render', 'source.ts']]) {
    const result = spawnSync(process.execPath, ['skills/imagine-science/scripts/cli.mjs', ...args], { cwd: root, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Imagine Science:/);
  }
});
