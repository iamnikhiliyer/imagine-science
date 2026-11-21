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
  assert.ok(processState(events.build + 55).layers > .8);
  assert.equal(processState(project.scenes[2].startFrame).layers, 0);
  assert.equal(processState(events.editStart).correction, 0);
  assert.equal(processState(events.editEnd).correction, 1);
});

test('the inspected frame freezes while the label is corrected, then motion resumes', () => {
  assert.equal(processState(events.freeze + 5).sampleFrame, processState(events.resume - 5).sampleFrame);
  assert.ok(processState(events.resume + 10).sampleFrame > processState(events.resume + 1).sampleFrame);
});

test('the closing keeps the animation alive while revealing its identity', () => {
  assert.equal(processState(900).brand, 1);
  assert.ok(processState(930).sampleFrame > processState(900).sampleFrame);
});

test('the visible slowdown follows the delivered word slow and reaches quarter speed', () => {
  assert.equal(events.slow, wordStart('slow'));
  assert.equal(processState(events.slow - 1).playbackRate, 1);
  assert.equal(processState(events.slow + 19).playbackRate, .25);
  const normalDelta = processState(events.sequence - 8).sampleFrame - processState(events.sequence - 12).sampleFrame;
  const slowDelta = processState(events.slow + 44).sampleFrame - processState(events.slow + 40).sampleFrame;
  assert.ok(Math.abs(slowDelta / normalDelta - .25) < 1e-6);
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
  assert.equal(project.audio.captions.map(c => c.text).join(' '), approved.lines.join(' '));
});
