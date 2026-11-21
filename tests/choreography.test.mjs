import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { events, processState, signalState } from '../src/explainer/process/motion.ts';

const project = JSON.parse(readFileSync(new URL('../film.project.json', import.meta.url)));
const words = JSON.parse(readFileSync(new URL('../src/explainer/words.json', import.meta.url)));
const wordStart = text => Math.ceil(words.find(w => w.text === text).startMs * .03);

test('camera and hero remain continuous through every narration boundary', () => {
  for (let frame = 1; frame < project.durationInFrames; frame++) {
    const previous = processState(frame - 1), current = processState(frame);
    for (const [key, limit] of [['x', 12], ['y', 12], ['scale', .06], ['rx', 3], ['ry', 3], ['rz', 3]]) {
      assert.ok(Number.isFinite(current.camera[key]));
      assert.ok(Math.abs(current.camera[key] - previous.camera[key]) < limit, `${key} jumps at frame ${frame}`);
    }
  }
});

test('the same specimen survives input, assembly, inspection, and the closing', () => {
  for (const frame of [...project.scenes.map(s => s.startFrame), project.durationInFrames - 1]) {
    const state = processState(frame);
    assert.equal(state.heroOpacity, 1);
    assert.ok(state.heroScale > .5);
  }
});

test('layer assembly completes before a frame is inspected and refined', () => {
  assert.ok(processState(events.build + 18).layers > .8);
  assert.equal(processState(events.sequence + 24).layers, 0);
  assert.equal(processState(events.editStart).correction, 0);
  assert.equal(processState(events.editEnd).correction, 1);
});

test('inspection holds, the timing adjustment scrubs, and label refinement holds the selected frame', () => {
  assert.equal(processState(events.freeze + 5).sampleFrame, processState(events.timingStart).sampleFrame);
  assert.ok(processState(events.timingEnd).sampleFrame > processState(events.timingStart).sampleFrame);
  assert.equal(processState(events.editStart).sampleFrame, processState(events.resume).sampleFrame);
  assert.ok(processState(events.resume + 10).sampleFrame > processState(events.resume + 1).sampleFrame);
});

test('the closing keeps the animation alive while revealing its identity', () => {
  assert.equal(processState(project.durationInFrames - 30).brand, 1);
  assert.ok(processState(project.durationInFrames - 1).sampleFrame > processState(project.durationInFrames - 30).sampleFrame);
});

test('the visible slowdown follows the delivered word slow and reaches quarter speed', () => {
  assert.equal(events.slow, wordStart('Slow'));
  assert.equal(processState(events.slow - 1).playbackRate, 1);
  assert.equal(processState(events.slow + 19).playbackRate, .25);
  const normalDelta = processState(events.sequence - 8).sampleFrame - processState(events.sequence - 12).sampleFrame;
  const slowDelta = processState(events.slow + 44).sampleFrame - processState(events.slow + 40).sampleFrame;
  assert.ok(Math.abs(slowDelta / normalDelta - .25) < 1e-6);
});

test('build, timing adjustment, and label refinement follow their spoken verbs', () => {
  assert.equal(events.build, wordStart('building'));
  assert.equal(events.timingStart, wordStart('adjust'));
  assert.equal(events.editStart, wordStart('refine'));
  assert.equal(events.closing, wordStart('Explore'));
  assert.equal(processState(events.timingStart).timingCorrection, 0);
  assert.equal(processState(events.timingEnd).timingCorrection, 1);
});

test('the ordered signal reaches a cell on the spoken word action', () => {
  assert.equal(events.narrationCue, wordStart('action.'));
  const signal = signalState(processState(events.narrationCue).sampleFrame);
  assert.ok(signal.active);
  assert.ok(Math.abs(signal.progress) < 1e-6);
  assert.equal(signal.from, 2);
});

test('opening signal traverses adjacent cells in order', () => {
  assert.deepEqual([0,36,72].map(frame => signalState(frame).from), [0,1,2]);
  assert.deepEqual([0,36,72].map(frame => signalState(frame).to), [1,2,3]);
});

test('a downstream cell responds only after the signal arrives', () => {
  assert.equal(signalState(35).arrivals.find(a=>a.node===1).strength, 0);
  assert.equal(signalState(36).arrivals.find(a=>a.node===1).strength, 1);
  assert.equal(signalState(71).arrivals.find(a=>a.node===2).strength, 0);
  assert.equal(signalState(72).arrivals.find(a=>a.node===2).strength, 1);
});

test('the captions contain exactly the approved wording', () => {
  const approved = JSON.parse(readFileSync(new URL('../production/script-candidate.json', import.meta.url)));
  assert.equal(project.audio.captions.map(c => c.text).join(' '), approved.text);
});

test('scene divisions follow words in the continuous take without audio padding', () => {
  const script = JSON.parse(readFileSync(new URL('../production/script.json', import.meta.url)));
  const narration = JSON.parse(readFileSync(new URL('../production/narration-timing.json', import.meta.url)));
  assert.equal(words.map(w => w.text).join(' '), script.text);
  assert.ok(narration.tailPaddingSamples < narration.sampleRate / project.fps);
  assert.equal(project.durationInFrames, Math.ceil(narration.synthesizedSamples / narration.sampleRate * project.fps));
  for (let i = 1; i < script.beats.length; i++) {
    const anchor = script.beats[i].anchor.split(' ');
    const index = words.findIndex((_, start) => anchor.every((text, offset) => words[start + offset]?.text === text));
    assert.equal(project.scenes[i].startFrame, Math.ceil(words[index].startMs * .03));
  }
});
