"""Synthesize the approved paragraph as one input, without scene padding.

Use Python with kokoro==0.9.4, soundfile, numpy, torch:
  python production/synthesize.py --model-dir /path/to/cached-kokoro
The cache contains config.json, kokoro.pth, and voice.pt (af_heart).
Scene boundaries are visual markers derived from the delivered word alignment.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from kokoro import KModel, KPipeline

ROOT = Path(__file__).resolve().parents[1]
FPS, SR = 30, 24000


def save(path, value):
    (ROOT / path).write_text(json.dumps(value, indent=2) + '\n')


def caption(group):
    return {'startFrame': math.ceil(group[0]['startMs'] * FPS / 1000),
            'endFrame': math.ceil(group[-1]['endMs'] * FPS / 1000),
            'text': ' '.join(w['text'] for w in group)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model-dir', type=Path, required=True)
    args = parser.parse_args()
    script = json.loads((ROOT / 'production/script.json').read_text())
    approved = json.loads((ROOT / 'production/script-candidate.json').read_text())
    assert script['text'] == approved['text'], 'Use the approved script verbatim'
    torch.set_num_threads(4)
    model = KModel(repo_id='hexgrad/Kokoro-82M', config=str(args.model_dir / 'config.json'), model=str(args.model_dir / 'kokoro.pth')).eval()
    pipeline = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M', model=model)
    # One paragraph input. Kokoro may internally chunk at its phoneme limit;
    # concatenate its output directly, preserving native pauses and token offsets.
    pieces, words = [], []
    samples = 0
    spoken = script['text']
    for name, pronunciation in {'FFmpeg': 'ˌɛfˌɛfmˈpɛɡ', 'SVG': 'ˌɛsvˌidʒˈi', 'Remotion': 'ɹɪmˈOʃən', 'Kokoro': 'kˈOkəɹO', 'TypeScript': 'tˈYpskɹɪpt'}.items():
        spoken = spoken.replace(name, f'[{name}](/{pronunciation}/)')
    results = pipeline(spoken, voice=str(args.model_dir / 'voice.pt'), speed=1.05, split_pattern=None)
    for result in results:
        audio = result.audio.numpy()
        previous_space = True
        for token in result.tokens:
            assert token.start_ts is not None and token.end_ts is not None, 'Missing synthesis alignment'
            start_ms = round((samples / SR + token.start_ts) * 1000)
            end_ms = round((samples / SR + token.end_ts) * 1000)
            if previous_space:
                words.append({'text': token.text, 'startMs': start_ms, 'endMs': end_ms, 'timestampMs': None, 'confidence': None})
            else:
                words[-1]['text'] += token.text
                words[-1]['endMs'] = end_ms
            previous_space = bool(token.whitespace)
        pieces.append(audio)
        samples += len(audio)
    assert ' '.join(w['text'] for w in words) == script['text'], 'Alignment must preserve every approved word'
    duration = math.ceil(samples / SR * FPS)
    padding = duration * SR // FPS - samples
    master = np.pad(np.concatenate(pieces), (0, padding))
    output = ROOT / 'public/explainer/narration.flac'
    sf.write(output, master, SR, subtype='PCM_16')
    save('src/explainer/words.json', words)
    save('production/narration-timing.json', {'sampleRate': SR, 'synthesizedSamples': samples,
         'tailPaddingSamples': padding, 'modelChunks': len(pieces), 'scriptSha256': hashlib.sha256(script['text'].encode()).hexdigest()})
    envelope = [float(np.sqrt(np.mean(chunk ** 2))) for chunk in np.array_split(master, 80)]
    save('src/explainer/waveform.json', [round(value / max(envelope), 4) for value in envelope])

    def anchor_index(phrase):
        tokens = phrase.split(' ')
        matches = [i for i in range(len(words)) if [w['text'] for w in words[i:i+len(tokens)]] == tokens]
        assert len(matches) == 1, f'Visual anchor must be unique: {phrase}'
        return matches[0]

    starts = [anchor_index(beat['anchor']) for beat in script['beats']]
    frames = [0] + [math.ceil(words[i]['startMs'] * FPS / 1000) for i in starts[1:]] + [duration]
    scenes, windows = [], []
    for i, beat in enumerate(script['beats']):
        scene_words = words[starts[i]:starts[i+1] if i+1 < len(starts) else len(words)]
        scenes.append({'id': beat['id'], 'title': beat['title'], 'startFrame': frames[i], 'endFrame': frames[i+1], 'caption': ' '.join(w['text'] for w in scene_words)})
        windows.append({'startFrame': math.ceil(scene_words[0]['startMs'] * FPS / 1000),
                        'endFrame': math.floor(scene_words[-1]['endMs'] * FPS / 1000), 'minRms': .003})
    captions, group = [], []
    for word in words:
        if group and (len(' '.join(w['text'] for w in group + [word])) > 48 or len(group) >= 7):
            captions.append(caption(group)); group = []
        group.append(word)
        if word['text'].endswith(('.', '?', '!')):
            captions.append(caption(group)); group = []
    if group:
        captions.append(caption(group))
    cue_phrases = script['cues']
    cues = [{'frame': math.ceil(words[anchor_index(phrase)]['startMs'] * FPS / 1000), 'label': phrase} for phrase in cue_phrases]
    previous = json.loads((ROOT / 'film.project.json').read_text())
    assets = [a for a in previous['assets'] if a['path'] != 'explainer/narration.flac']
    assets.insert(0, {'path': 'explainer/narration.flac', 'kind': 'generated',
        'source': 'Approved continuous paragraph in production/script.json; one input to local Kokoro-82M, kokoro 0.9.4, af_heart voice, speed 1.05, English; native model pauses only; synthesis word timings in src/explainer/words.json',
        'license': 'Original script MIT; synthesis using Apache-2.0 Kokoro-82M model', 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()})
    manifest = {'schemaVersion': 1, 'compositionId': 'Imagine-Science', 'title': 'Imagine Science — a moving explanation',
        'width': previous['width'], 'height': previous['height'], 'fps': FPS, 'durationInFrames': duration, 'scenes': scenes, 'cues': cues,
        'assets': assets, 'audio': {'mode': 'narrated', 'path': 'explainer/narration.flac', 'captions': captions, 'speechWindows': windows},
        'review': {'extraFrames': sorted(set([20, 90, 145] + [min(duration-1,c['frame']+25) for c in cues])), 'maxFrames': 120},
        'stationaryRegions': []}
    save('film.project.json', manifest)
    print(f'Total: {duration / FPS:.2f}s / {duration} frames, {len(pieces)} model chunk(s), {padding} tail samples', flush=True)
    for cue in cues:
        print(cue['frame'], cue['label'], flush=True)


if __name__ == '__main__':
    main()
