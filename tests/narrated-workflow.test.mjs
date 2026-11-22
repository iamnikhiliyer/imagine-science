import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {subtitles} from '../skills/imagine-science/scripts/subtitles.mjs';
import {webExport} from '../skills/imagine-science/scripts/web-export.mjs';

test('WebVTT preserves display text and frame-rounded timing', () => {
  const project = {fps: 30, audio: {mode: 'narrated', captions: [{text: 'A & B < C', startFrame: 1, endFrame: 30}]}};
  assert.equal(subtitles(project), 'WEBVTT\n\n00:00:00.033 --> 00:00:01.000\nA &amp; B &lt; C\n');
});

test('provider import maps spoken spellings to canonical words and rejects a mismatched transcript', async t => {
  const dir = await mkdtemp(path.join(tmpdir(), 'imagine-words-'));
  t.after(() => rm(dir, {recursive: true, force: true}));
  const cli = fileURLToPath(new URL('../skills/imagine-science/scripts/import-elevenlabs.mjs', import.meta.url));
  const characters = [...'eff eff works.'];
  const bytes = Buffer.from('ID3fixture');
  await writeFile(path.join(dir,'response.json'), JSON.stringify({audio_base64: bytes.toString('base64'), alignment: {
    characters, character_start_times_seconds: characters.map((_,i)=>i/10),
    character_end_times_seconds: characters.map((_,i)=>(i+1)/10),
  }}));
  await writeFile(path.join(dir,'script.json'), '{"text":"FF works."}');
  await writeFile(path.join(dir,'spoken.json'), '["eff eff","works."]');
  const invoke = (...args) => spawnSync(process.execPath, [cli, 'response.json', 'script.json', ...args], {cwd:dir});
  assert.notEqual(invoke('bad').status, 0);
  assert.equal(invoke('take','spoken.json').status, 0);
  assert.deepEqual(await readFile(path.join(dir,'take/narration.mp3')), bytes);
  const words = JSON.parse(await readFile(path.join(dir,'take/words.json')));
  assert.deepEqual(words.map(w=>[w.text,w.startMs,w.endMs]), [['FF',0,700],['works.',800,1400]]);
});

test('web packaging preserves a successful output when a later budget is impossible', async t => {
  const dir = await mkdtemp(path.join(tmpdir(), 'imagine-web-'));
  t.after(() => rm(dir, {recursive:true, force:true}));
  const source = path.join(dir, 'source.mp4'), output = path.join(dir, 'web.mp4');
  execFileSync('ffmpeg', ['-v','error','-f','lavfi','-i','color=s=128x72:r=10:d=1',
    '-f','lavfi','-i','sine=duration=1','-c:v','libx264','-c:a','aac','-shortest',source]);
  const project = {width:128,height:72,fps:10,durationInFrames:10,audio:{mode:'narrated',speechWindows:[]},stationaryRegions:[]};
  await webExport(source,output,100000,project);
  const delivered = await readFile(output);
  await assert.rejects(webExport(source,output,10,project), /no room/);
  assert.deepEqual(await readFile(output),delivered);
});
