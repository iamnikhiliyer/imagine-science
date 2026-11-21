"""Prepare local Kokoro narration and a frame-aligned film plan.

Run with a Python environment containing kokoro==0.9.4, soundfile, numpy, torch:
  python production/synthesize.py --model-dir /path/to/cached-kokoro
The cache contains config.json, kokoro.pth, and voice.pt (af_heart).
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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model-dir', type=Path, required=True)
    args = parser.parse_args()
    torch.set_num_threads(4)
    model = KModel(repo_id='hexgrad/Kokoro-82M', config=str(args.model_dir / 'config.json'), model=str(args.model_dir / 'kokoro.pth')).eval()
    pipeline = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M', model=model)
    script = json.loads((ROOT / 'production/script.json').read_text())
    pieces, scenes, captions, words, windows = [], [], [], [], []
    cursor = 0
    for scene in script:
        results = list(pipeline(scene['text'], voice=str(args.model_dir / 'voice.pt'), speed=1.05))
        assert len(results) == 1, 'This short scene should synthesize in one aligned result'
        result = results[0]
        audio = result.audio.numpy()
        lead = 12
        duration = lead + math.ceil(len(audio) / SR * FPS) + 15
        duration = max(duration, scene.get('minDurationFrames', duration))
        chunk = np.zeros(duration * SR // FPS, dtype=np.float32)
        offset = lead * SR // FPS
        chunk[offset:offset + len(audio)] = audio
        pieces.append(chunk)
        scenes.append({ 'id': scene['id'], 'startFrame': cursor, 'endFrame': cursor + duration, 'title': scene['title'], 'caption': scene['text'] })
        phrase_words, previous_space = [], True
        for token in result.tokens:
            assert token.start_ts is not None and token.end_ts is not None, 'Missing synthesis alignment'
            start_ms = (cursor + lead) / FPS * 1000 + token.start_ts * 1000
            end_ms = (cursor + lead) / FPS * 1000 + token.end_ts * 1000
            if previous_space:
                phrase_words.append({ 'text': token.text, 'startMs': round(start_ms), 'endMs': round(end_ms), 'timestampMs': None, 'confidence': None })
            else:
                phrase_words[-1]['text'] += token.text
                phrase_words[-1]['endMs'] = round(end_ms)
            previous_space = bool(token.whitespace)
        assert ' '.join(w['text'] for w in phrase_words) == scene['text'], 'Aligned words must preserve the exact script'
        group = []
        for word in phrase_words:
            if group and (len(' '.join(w['text'] for w in group + [word])) > 48 or len(group) >= 7):
                captions.append(caption(group)); group = []
            group.append(word)
            if word['text'].endswith(('.', '?', '!')):
                captions.append(caption(group)); group = []
        if group:
            captions.append(caption(group))
        words.extend(phrase_words)
        windows.append({ 'startFrame': math.ceil(phrase_words[0]['startMs'] / 1000 * FPS), 'endFrame': math.floor(phrase_words[-1]['endMs'] / 1000 * FPS), 'minRms': .003 })
        print(scene['id'], f'{duration / FPS:.2f}s', f'frames {cursor}–{cursor + duration}', flush=True)
        cursor += duration
    master = np.concatenate(pieces)
    envelope = [float(np.sqrt(np.mean(chunk ** 2))) for chunk in np.array_split(master, 80)]
    peak = max(envelope)
    (ROOT / 'src/explainer/waveform.json').write_text(json.dumps([round(value / peak, 4) for value in envelope]) + '\n')
    output = ROOT / 'public/explainer/narration.flac'
    output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(output, master, SR, subtype='PCM_16')
    (ROOT / 'src/explainer/words.json').write_text(json.dumps(words, indent=2) + '\n')
    manifest = {
        'schemaVersion': 1, 'compositionId': 'Imagine-Science', 'title': 'Imagine Science — a moving explanation',
        'width': 1920, 'height': 1080, 'fps': FPS, 'durationInFrames': cursor,
        'scenes': scenes, 'cues': [{ 'frame': s['startFrame'] + 45, 'label': s['id'] + ' principal visual' } for s in scenes],
        'assets': [{ 'path': 'explainer/narration.flac', 'kind': 'generated', 'source': 'Original script in production/script.json; local Kokoro-82M, kokoro 0.9.4, af_heart voice, speed 1.05, English; synthesis word timings in src/explainer/words.json', 'license': 'Original script MIT; synthesis using Apache-2.0 Kokoro-82M model', 'sha256': hashlib.sha256(output.read_bytes()).hexdigest() },
                   { 'path': 'explainer/starter-preview.png', 'kind': 'illustrative', 'source': 'Imagine Science v0.1.0 docs/preview.png: original schematic diffusion starter', 'license': 'MIT', 'sha256': hashlib.sha256((ROOT / 'public/explainer/starter-preview.png').read_bytes()).hexdigest() }],
        'audio': { 'mode': 'narrated', 'path': 'explainer/narration.flac', 'captions': captions, 'speechWindows': windows },
        'review': { 'extraFrames': [s['startFrame'] + (s['endFrame'] - s['startFrame']) // 2 for s in scenes], 'maxFrames': 80 },
        'stationaryRegions': []
    }
    (ROOT / 'film.project.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Total: {cursor / FPS:.2f}s / {cursor} frames', flush=True)


def caption(group):
    return { 'startFrame': max(0, math.ceil(group[0]['startMs'] / 1000 * FPS)),
             'endFrame': math.ceil(group[-1]['endMs'] / 1000 * FPS),
             'text': ' '.join(w['text'] for w in group) }


if __name__ == '__main__':
    main()
