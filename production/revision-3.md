# Revision 3 — approved script in production

The researcher-focused 54-word script was approved by the user and implemented.
The exact production wording is `production/script.json`; the approved editorial
record is `production/script-candidate.json`.

Delivery: 1920×1080, 30 fps, 949 frames, 31.633333 seconds, local Kokoro af_heart
narration at speed 1.05, and synchronized word-highlighted phrase captions.

## Script-to-action alignment

- The opening signal travels through adjacent cells in order. The downstream
  response starts when the signal arrives. This is an illustrative sequence,
  not measured activity or a calibrated biological simulation.
- Editable layers separate around the spoken "build" at frame 249.
- Source material connects during "Start from your references."
- Replay starts on "Show" at frame 434.
- The signal slows on "slow" at frame 468 and smoothly reaches quarter speed.
- Its next cell arrival matches the spoken "action" at frame 546. The narration
  waveform and cue marker visualize that synchronization.
- During "Keep the scene editable," the image holds and its annotation is
  repositioned. The corrected annotation remains when the scene resumes.
- The closing follows the new GitHub invitation.

## Preservation

The earlier narration, word timings, waveform, and scene plan are retained under
`src/explainer/archive/` and `public/explainer/archive/` for the Presentation-Draft
comparison. A local `archive/before-approved-script` branch preserves the prior
continuous-motion version. The public toolkit's helpers are unchanged.

## Checks and review scope

Tests cover the approved caption wording, camera continuity, persistent actor,
layer/inspection order, the ordered signal, downstream response timing, actual
quarter-speed movement, narration-cue alignment, and motion resuming after edits.
Existing media/asset/tool-portability tests remain in place.

The first visual pass rendered ten frames covering the opening, layers, sources,
slowdown, narration cue, edit, and closing. The second pass renders 52 boundary,
cue, and motion-extrema frames. Review is sampled; it does not assert every-frame
visual viewing or independent scientific approval.

The delivery is exported to `out/imagine-science-explainer.mp4`. Technical export
verification is recorded in `out/verification.json` and checks decoded frame
count, dimensions, timing, codec, AAC audio, signal energy in the five speech
windows, and full media decoding. See that generated report for the result.

Final result: all 32 tests, lint, TypeScript, and bundling passed. The full MP4
passed verification: H.264 1920×1080 at 30 fps, 949 decoded frames, 31.633333
seconds, and AAC narration. All five speech-window RMS values exceeded the
declared threshold (0.0467–0.0518 measured). Full decoding completed without
errors. SHA-256: `42a7a564262efc6dc83bd8aad208180a89b41f5309ceb4a558f6d363ad44f004`.

The updated Studio preview played in a real browser with zero console errors or
warnings. A selected overview of the second-pass frames was inspected for the
ordered opening, layers, source materials, quarter-speed indicator, cue marker,
caption placement, persistent correction, and closing. An English WebVTT sidecar
is included locally at `out/imagine-science-explainer.en.vtt`.
