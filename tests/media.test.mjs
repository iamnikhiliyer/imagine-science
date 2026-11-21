import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertMedia, signalRms, stationaryDifferences } from '../skills/imagine-science/scripts/media.mjs';

const project = { width: 1280, height: 720, fps: 30, durationInFrames: 120, audio: { mode: 'silent' } };
const metadata = () => ({ streams: [{ codec_type: 'video', codec_name: 'h264', width: 1280, height: 720, avg_frame_rate: '30/1', nb_read_frames: '120', duration: '4' }] });

test('accepts matching decoded H.264 metadata', () => assert.doesNotThrow(() => assertMedia(metadata(), project)));
test('rejects truncated, wrong-size, wrong-codec, wrong-fps, and wrong-duration output', () => {
  for (const [key, value] of [['nb_read_frames', '119'], ['width', 1920], ['codec_name', 'vp9'], ['avg_frame_rate', '24/1'], ['duration', '3.9']]) {
    const m = metadata(); m.streams[0][key] = value;
    assert.throws(() => assertMedia(m, project));
  }
});
test('requires exactly one video stream', () => {
  const m = metadata(); m.streams.push({ ...m.streams[0] });
  assert.throws(() => assertMedia(m, project), /one video/);
});
test('audio stream policy distinguishes silent and narrated films', () => {
  const m = metadata();
  assert.throws(() => assertMedia(m, { ...project, audio: { mode: 'narrated' } }), /audio/);
  m.streams.push({ codec_type: 'audio', codec_name: 'aac', duration: '4.01', sample_rate: '48000' });
  assert.doesNotThrow(() => assertMedia(m, { ...project, audio: { mode: 'narrated' } }));
  assert.throws(() => assertMedia(m, project), /silent/);
  m.streams[1].duration = '3';
  assert.throws(() => assertMedia(m, { ...project, audio: { mode: 'narrated' } }), /duration/);
});
test('RMS detects silence and a known nonzero PCM signal', () => {
  assert.equal(signalRms(Buffer.alloc(160)), 0);
  const pcm = Buffer.alloc(160);
  for (let i = 0; i < pcm.length; i += 2) pcm.writeInt16LE(i % 4 === 0 ? 16384 : -16384, i);
  assert.equal(signalRms(pcm), .5);
  assert.throws(() => signalRms(Buffer.alloc(0)), /samples/);
});
test('stationary analysis rejects missing samples and detects peak change', () => {
  assert.deepEqual(stationaryDifferences('lavfi.signalstats.YAVG=0.01\nlavfi.signalstats.YAVG=0.22\n', 2), { count: 2, peak: .22 });
  assert.throws(() => stationaryDifferences('', 2), /comparisons/);
  assert.throws(() => stationaryDifferences('lavfi.signalstats.YAVG=nan', 1), /comparisons/);
});
