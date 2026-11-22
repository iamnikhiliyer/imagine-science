import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir, mkdtemp, rename, rm, stat} from 'node:fs/promises';
import path from 'node:path';
import {verifyMedia} from './media.mjs';

export async function webExport(input, output, limit, project) {
  assert.ok(Number.isSafeInteger(limit) && limit > 0, 'Supply a positive byte limit');
  assert.notEqual(path.resolve(input), path.resolve(output), 'Choose a separate output for the web copy');
  assert.equal(path.extname(output).toLowerCase(), '.mp4', 'Web output must end in .mp4');
  await mkdir(path.dirname(output), {recursive: true});
  const tmp = await mkdtemp(path.join(path.dirname(output), '.web-'));
  const candidate = path.join(tmp, 'web.mp4');
  const encode = args => execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-i', input, ...args]);
  const map = ['-map', '0:v:0', '-map', '0:a:0?'];
  const mux = ['-movflags', '+faststart', candidate];
  try {
    encode([...map, '-c', 'copy', ...mux]);
    let bytes = (await stat(candidate)).size;
    if (bytes > limit) {
      const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0',
        '-show_entries', 'stream=bit_rate', '-of', 'json', input], {encoding: 'utf8'}));
      const audioRate = Number(probe.streams[0]?.bit_rate ?? 0);
      const seconds = project.durationInFrames / project.fps;
      let rate = Math.floor((limit * 8 / seconds * .97 - audioRate) / 1000);
      for (let attempt = 0; bytes > limit && attempt < 3; attempt++) {
        assert.ok(rate > 0, 'Byte limit leaves no room for video alongside the original audio');
        const video = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-b:v', rate + 'k',
          '-passlogfile', path.join(tmp, 'pass')];
        encode(['-map', '0:v:0', ...video, '-pass', '1', '-an', '-f', 'null', '-']);
        encode([...map, ...video, '-pass', '2', '-c:a', 'copy', ...mux]);
        bytes = (await stat(candidate)).size;
        rate = Math.floor(rate * limit / bytes * .96);
      }
    }
    assert.ok(bytes <= limit, 'Cannot fit the film within the supplied byte limit');
    verifyMedia(candidate, project);
    await rename(candidate, output);
    return bytes;
  } finally {
    await rm(tmp, {recursive: true, force: true});
  }
}
