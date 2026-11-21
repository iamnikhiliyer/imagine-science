# Initial validation record

Date: 2026-11-21. This record covers the public starter and toolkit mechanics.
The next independent scientific film extraction test has not been performed.

## Automated checks

- Manifest, provenance-path, asset-hash, and review-budget validation.
- ESLint and TypeScript checks on the starter.
- 22 passing Node tests covering invalid timelines, missing/changed assets,
  symlink escapes, evidence selection, metadata mismatches, signal energy,
  consecutive-frame comparisons, actual FFmpeg-generated silent/narrated media,
  CLI rejection paths, and skill portability outside the repository.
- Remotion production bundle.
- Full starter export: H.264, 1280×720, 30 fps, 360 decoded frames, 12 seconds,
  no audio stream as declared. Full FFmpeg decode passed.
- Contact-sheet generation and exact-frame review rendering.
- Skill frontmatter/structure validation using the Codex skill-creator validator.
- Native npm dependency audit: zero reported vulnerabilities with the checked
  lockfile. Remotion packages are aligned at 4.0.545. ESLint is 10.15.0 and the
  compatible typescript-eslint override is 8.73.0.

Local environment: macOS arm64, Node 26.7.0, npm 11.19.0, FFmpeg/ffprobe 9.0.1,
Remotion-managed Chrome Headless Shell. The GitHub Actions template targets a
fresh Linux install on Node 22 and includes project checks plus a full starter
render/verification. It is not active: the initial publishing credential lacked
the `workflow` scope, and no configured SSH credential was available. No Linux
CI result is claimed. The same checks are run from a fresh local checkout.

## Visual inspection

The Studio composition loaded in a real browser, and playback was exercised.
Representative exact frames and a 30-sample export contact sheet were inspected
for text clipping, missing assets, layout continuity, and particle visibility.
The opening's low-opacity title was corrected to be readable from frame zero.
The committed preview is the frame-180 composition.

This is sampled visual inspection, not a claim that every frame was watched.
The example is silent and has no experimental data. No independent domain review
or assessment of production-time savings has been performed.

## Scope of the release

The skill and starter are usable together, and installed helpers resolve their
target project's dependencies. Existing projects still need to connect their
own composition, narration, and captions to the manifest. Provider-based image,
video, and speech generation remain external to this toolkit.
