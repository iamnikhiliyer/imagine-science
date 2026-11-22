#!/usr/bin/env node
// Import a saved MP3 response from the ElevenLabs convert_with_timestamps command.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir, rm} from 'node:fs/promises';
import path from 'node:path';

const [responseFile, scriptFile, directory, spokenFile] = process.argv.slice(2);
if (!directory || process.argv.length > 6) {
  console.error('Usage: node import-elevenlabs.mjs RESPONSE.json SCRIPT.json NEW_OUTPUT_DIR [SPOKEN_TOKENS.json]');
  process.exit(1);
}
const load = async file => JSON.parse(await readFile(file, 'utf8'));
const response = await load(responseFile);
const script = (await load(scriptFile)).text;
assert.ok(typeof script === 'string' && script.trim(), 'Expected a nonempty script');
const display = script.trim().split(/\s+/u);
const spoken = spokenFile ? await load(spokenFile) : display;
assert.equal(spoken.length, display.length, 'Supply one spoken spelling per displayed token');
const {characters, character_start_times_seconds: starts, character_end_times_seconds: ends} = response.alignment;
assert.equal(characters.length, starts.length);
assert.equal(characters.length, ends.length);
assert.equal(characters.join(''), spoken.join(' '), 'Spoken text must match the original provider alignment');
let i = 0;
const words = display.map((text, index) => {
  const surface = spoken[index];
  assert.ok(typeof surface === 'string' && surface.trim().length > 0, 'Empty spoken token');
  const first = i;
  let actual = '';
  while (actual.length < surface.length && i < characters.length) actual += characters[i++];
  assert.equal(actual, surface);
  assert.ok(Number.isFinite(starts[first]) && Number.isFinite(ends[i - 1]), 'Invalid provider times');
  const startMs = Math.round(starts[first] * 1000);
  const endMs = Math.round(ends[i - 1] * 1000);
  assert.ok(Number.isFinite(startMs) && Number.isFinite(endMs) && startMs >= 0 && endMs >= startMs);
  if (index < display.length - 1) assert.equal(characters[i++], ' ');
  return {text, startMs, endMs, timestampMs: null, confidence: null};
});
const audio = Buffer.from(response.audio_base64, 'base64');
assert.ok(audio.length && (audio.subarray(0, 3).toString() === 'ID3' || (audio[0] === 255 && (audio[1] & 224) === 224)),
  'Expected an MP3 response');
await mkdir(path.dirname(path.resolve(directory)), {recursive: true});
await mkdir(directory);
try {
  await writeFile(path.join(directory, 'narration.mp3'), audio);
  await writeFile(path.join(directory, 'words.json'), JSON.stringify(words, null, 2) + '\n');
} catch (error) {
  await rm(directory, {recursive: true, force: true});
  throw error;
}
console.log('Imported ' + words.length + ' words into ' + directory);
