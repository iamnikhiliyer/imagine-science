# Imagine Science explainer — preview review

**Superseded first-draft review.** The user rejected this version as slide-like.
Its earlier 9/10 score did not adequately assess motion quality. See
[revision-2.md](revision-2.md) for the replacement direction and current evidence.

Date: 2026-11-21. Deliverable: narrated Studio preview, 1920×1080, 30 fps,
920 frames / 30.67 seconds. No final MP4 export is claimed in this review.

## Evidence and correction

First pass: inspected the six-frame overview at frames 45, 200, 420, 600, 805,
and 919. The source-sheet diagram covered the end of the reference question.
Moved the diagram right so the full question remains readable.

Second pass: rendered the manifest's 36 boundary/cue/midpoint frames through
the unchanged toolkit helpers in the separate toolkit directory. Inspected the
36-frame overview for missing scenes, clipping, caption-safe space, continuity,
and first/last states. Inspected corrected frame 216 at full size. Current
evidence selection is recorded in `out/review/frames.json`.

The Studio composition loaded in a real browser and playback was exercised.
Browser console: zero errors and zero warnings. Captions appeared in the preview.
This is sampled visual review, not a claim that every frame was watched.

## Checks

- Manifest/assets/hash validation passes.
- All 22 inherited behavioral/integration tests pass.
- ESLint, TypeScript, and the production bundle pass.
- All 12 phrase captions reproduce the exact narration script. The word
  selections used for highlighting reproduce each corresponding phrase.
- Delivered FLAC is mono 24kHz and exactly 30.666667 seconds.
- All five declared speech windows exceed the 0.003 RMS threshold; measured RMS
  values are 0.0473–0.0509. This checks signal energy, not speech meaning.
- Scientific/product claims were checked against the toolkit README, source,
  and helper capabilities; no automatic scientific approval is represented.

Human listening/art-direction review remains appropriate before final delivery.

## Visual rubric (subjective)

| Category | Score | Note |
| --- | --- | --- |
| Composition | 2/2 | Consistent paper/ink identity and clear scene focus |
| Legibility | 2/2 | Source-note overlap repaired; captions have reserved space |
| Reference fidelity | 2/2 | Real toolkit starter image and source-based product claims |
| Motion and timing | 1/2 | Deliberate entrances and timeline motion; restrained treatment |
| Technical appearance | 2/2 | Reviewed samples show complete assets; preview has no console errors |

Total: 9/10. This score does not replace researcher or audience judgment.

## Extraction findings

- A separate public clone installed and ran without toolkit-code changes.
- External skill helpers correctly resolved this film project's dependencies.
- The single-film manifest made a separate film project a natural starting point.
- The starter's phrase captions were extended with a film-specific word-highlight
  overlay using actual synthesis timings. Helpers and the manifest contract stayed
  unchanged.
- Local TTS remains a separately prepared asset, as the toolkit documents. The
  script and prepared FLAC make this film usable without installing that TTS stack.
- This exercise demonstrates a product explainer. A scientific research subject
  still needs its own source/claim map and domain review.
