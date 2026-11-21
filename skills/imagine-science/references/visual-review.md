# Visual review and delivery

## Evidence selection

`review` renders first/last frames and their in-range neighbors, every scene start
plus/minus two frames, all cues, and all `review.extraFrames`. It refuses to
discard evidence when `review.maxFrames` is exceeded. Increase the budget
explicitly or simplify the plan. `review 90 120` selects only those exact frames
for a targeted correction pass.

`out/review/frames.json` records the current selection. Old PNGs may remain after
a new selection; use that JSON/report to identify the current evidence. The
Markdown report is regenerated as **unreviewed** on every run. Copy any completed
review to production notes before rerunning.

Add motion extrema, labels at their longest state, material changes, camera
moves, image comparisons, and narration cues to the review plan. Watch continuous
playback separately: stills cannot show pacing, flicker between samples, or audio
synchronization. The contact sheet is a coarse overview, not full coverage.

## Rubric

Score each category 0 (broken), 1 (usable with issues), or 2 (deliberate and clear):

| Category | Inspect |
| --- | --- |
| Composition | Balance, focus, margins, camera, visual continuity |
| Legibility | Labels, typography, contrast, reading time, caption overlap |
| Reference fidelity | Intentional style, source geometry, asset appearance |
| Motion and timing | Causal order, purposeful movement, cuts, audio alignment |
| Technical appearance | Missing assets, clipping, flashes, distorted media |

Below 8/10 calls for repair; the score is a subjective aid. A severe defect or
unresolved scientific error blocks handoff regardless of the total. Record
frame, finding, severity, correction, and recheck outcome. Do at most two
unattended repair rounds, then report unresolved findings to the researcher.

## Export verification

`verify` checks one H.264 video stream, dimensions, average frame rate, exact
decoded frame count, duration, and the declared audio policy. Narrated films need
one AAC stream whose duration matches the picture within frame/packet tolerance.
It also fully decodes the export with FFmpeg's error checking.

Optional speech windows compare normalized PCM RMS to a specified threshold.
They detect insufficient audio energy; music or noise can pass, and they cannot
prove that words are present or correct. Choose windows known to contain speech
and tune thresholds on the actual recording. Intentional pauses should be excluded.

Optional stationary regions compare every consecutive cropped frame inside a
declared interval. Mean absolute luma difference is measured on the decoded
8-bit signal (0–255). Thresholds depend on compression and content. Do not apply
stationary checks to intentional movement, captions, or fades.

Verification writes `out/verification.json` including the export's SHA-256. It
does not detect all black frames, text overflow, incorrect labels, or scientific
errors. Those require rendered inspection and domain review.
