import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

export function assertMedia(metadata, project) {
  const videos = metadata.streams.filter(s => s.codec_type === 'video');
  const audios = metadata.streams.filter(s => s.codec_type === 'audio');
  assert.equal(videos.length, 1, 'Expected exactly one video stream');
  const video = videos[0];
  assert.equal(video.codec_name, 'h264', 'Expected H.264');
  assert.equal(video.width, project.width, 'Wrong video width');
  assert.equal(video.height, project.height, 'Wrong video height');
  const [numerator, denominator] = video.avg_frame_rate.split('/').map(Number);
  assert.ok(Math.abs(numerator / denominator - project.fps) < .001, 'Wrong frame rate');
  assert.equal(Number(video.nb_read_frames), project.durationInFrames, 'Wrong decoded frame count');
  const duration = project.durationInFrames / project.fps;
  assert.ok(Math.abs(Number(video.duration) - duration) < 1 / project.fps, 'Wrong video duration');
  if (project.audio.mode === 'silent') assert.equal(audios.length, 0, 'Expected silent output without an audio stream');
  else {
    assert.equal(audios.length, 1, 'Expected exactly one audio stream');
    const audio = audios[0];
    assert.equal(audio.codec_name, 'aac', 'Expected AAC audio');
    assert.ok(Math.abs(Number(audio.duration) - duration) < 1 / project.fps + 1024 / Number(audio.sample_rate), 'Audio duration differs from picture');
  }
  return { width: video.width, height: video.height, fps: numerator / denominator, frames: Number(video.nb_read_frames), duration, audio: project.audio.mode };
}

export function signalRms(pcm) {
  assert.ok(pcm.length >= 2 && pcm.length % 2 === 0, 'Expected complete PCM samples');
  let energy = 0;
  for (let i = 0; i < pcm.length; i += 2) energy += (pcm.readInt16LE(i) / 32768) ** 2;
  return Math.sqrt(energy / (pcm.length / 2));
}

export function stationaryDifferences(log, minimum) {
  const values = [...log.matchAll(/lavfi\.signalstats\.YAVG=([^\s]+)/g)].map(m => Number(m[1]));
  assert.ok(values.length >= minimum && values.every(Number.isFinite), 'Missing or invalid stationary frame comparisons');
  return { count: values.length, peak: values.reduce((peak, value) => Math.max(peak, value), 0) };
}

export function verifyMedia(file, project) {
  const metadata = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-of', 'json', file], { encoding: 'utf8' }));
  const result = assertMedia(metadata, project);
  // Decode both streams, failing on errors even when container metadata looks valid.
  execFileSync('ffmpeg', ['-v', 'error', '-xerror', '-i', file, '-f', 'null', '-'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const speech = project.audio.speechWindows.map(window => {
    const seconds = (window.endFrame - window.startFrame) / project.fps;
    const pcm = execFileSync('ffmpeg', [
      '-v', 'error', '-ss', String(window.startFrame / project.fps), '-i', file, '-t', String(seconds),
      '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', '-',
    ], { maxBuffer: Math.max(1024 * 1024, Math.ceil(seconds * 16000) + 8192) });
    assert.ok(pcm.length >= Math.floor(seconds * 16000 * .95), 'Speech window is truncated');
    const rms = signalRms(pcm);
    assert.ok(rms >= window.minRms, `Audio signal below threshold near frame ${window.startFrame}`);
    return { ...window, rms };
  });
  const stationary = project.stationaryRegions.map(region => {
    const filter = `trim=start_frame=${region.startFrame}:end_frame=${region.endFrame},crop=${region.width}:${region.height}:${region.x}:${region.y},format=yuv444p,tblend=all_mode=difference,signalstats,metadata=print:file=-`;
    const log = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', filter, '-an', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const difference = stationaryDifferences(log, region.endFrame - region.startFrame - 1);
    assert.ok(difference.peak <= region.maxMeanDifference, `Stationary region flicker: ${difference.peak} exceeds ${region.maxMeanDifference}`);
    return { ...region, ...difference };
  });
  return { ...result, speech, stationary, decodedWithoutErrors: true };
}
