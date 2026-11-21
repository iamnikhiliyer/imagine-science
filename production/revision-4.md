# Revision 4 — one continuous explanation

The exact user-approved paragraph is delivered as one continuous af_heart reading,
with natural punctuation pauses. All five visual sections use the same recording;
there is no per-scene synthesis, minimum-duration padding, or inserted scene silence.
The input fits in a single Kokoro model chunk: 636,000 samples at 24 kHz, 26.5 seconds,
795 frames at 30 fps. No rounding padding was required. Reproduction details and
sample counts are in `synthesize.py` and `narration-timing.json`.

## Action follows speech

The same dark dimensional schematic persists throughout. Source notes appear at
the spoken references; layers separate during building and assemble for the
sequence. Actual signal movement ramps to quarter speed on “Slow.” Its arrival
at a cell coincides with “action.” Inspection retains that specimen while the
sequence timing range extends and scrubs the selected state. The annotation moves
on “refine” and remains in the resumed animation. The final invitation reveals
the identity and repository address beside the same moving scene.

The detailed audio/visual treatment is in `script-development.md`. Word-aligned
captions use the delivered text exactly. A WebVTT sidecar accompanies the MP4.
This is an original illustrative schematic, not measured activity.

## Preservation and review

The local `archive/before-continuous-narration` branch preserves the previous
segmented-voice version. The older Presentation-Draft remains available in Studio.
The public toolkit and its media helpers remain unchanged.

Visual inspection covered ten initial action frames and all 49 default review
frames, including first/last, scene boundaries and neighbors, spoken action cues,
and later points within those actions. The initial overview and two final sheets
are under `out/review/`. This is sampled visual review. Tests separately check
camera continuity across every frame, cue alignment, actual quarter-speed motion,
timing scrubbing, persistent edits, exact captions, and word-derived scene ranges.

Visual score: 9/10 (composition 2, hierarchy/legibility 1, style fidelity 2,
motion/timing 2, technical integrity 2). The small schematic annotations remain
secondary to the readable captions and action labels. No blocking clipping or
missing assets were found in the sampled frames; no repair round was required.

The Studio played through the updated timeline in a real browser; live samples
confirmed changing camera/action states. After reload, the console reported zero
errors or warnings. Speech silence analysis found only native punctuation pauses
(up to 0.55 seconds internally), with no added scene holds.

All 34 tests, ESLint, TypeScript, manifest validation, and production bundling pass.
The MP4 passed export verification: H.264 1920×1080 at 30 fps, 795 decoded
frames, 26.5 seconds, and AAC narration. All five speech-window RMS readings
exceeded the configured threshold (0.0476–0.0503 measured), and full decoding
completed without errors. Details are in `out/verification.json`.
SHA-256: `1aaa5481efafc5de98f9c05e816160f83bb2511ff138f9a73caa58633f1d077b`.
