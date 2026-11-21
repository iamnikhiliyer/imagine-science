import assert from 'node:assert/strict';
import { test } from 'node:test';
import { processState } from '../src/explainer/process/motion.ts';

test('camera and hero remain continuous through every narration boundary', () => {
  for (let frame = 1; frame < 920; frame++) {
    const previous = processState(frame - 1), current = processState(frame);
    for (const [key, limit] of [['x', 12], ['y', 12], ['scale', .06], ['rx', 3], ['ry', 3], ['rz', 3]]) {
      assert.ok(Number.isFinite(current.camera[key]));
      assert.ok(Math.abs(current.camera[key] - previous.camera[key]) < limit, `${key} jumps at frame ${frame}`);
    }
  }
});

test('the same specimen survives input, assembly, inspection, and the closing', () => {
  for (const frame of [0, 109, 324, 511, 683, 919]) {
    const state = processState(frame);
    assert.equal(state.heroOpacity, 1);
    assert.ok(state.heroScale > .5);
  }
});

test('layer assembly completes before a frame is inspected and refined', () => {
  assert.ok(processState(385).layers > .8);
  assert.equal(processState(520).layers, 0);
  assert.equal(processState(550).correction, 0);
  assert.equal(processState(625).correction, 1);
});

test('the inspected frame freezes while the label is corrected, then motion resumes', () => {
  assert.equal(processState(550).sampleFrame, processState(620).sampleFrame);
  assert.ok(processState(680).sampleFrame > processState(650).sampleFrame);
});

test('the closing keeps the animation alive while revealing its identity', () => {
  assert.equal(processState(850).brand, 1);
  assert.ok(processState(900).sampleFrame > processState(850).sampleFrame);
});
