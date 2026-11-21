# Imagine Science — from paper to film

This narrated explainer follows an original diffusion illustration through source review, TypeScript, React and SVG, frame animation in Remotion, synchronized Kokoro narration and captions, FFmpeg export, and a timing correction. The native 3840 × 2160 film runs for 2,429 frames at 30 fps, approximately 81 seconds.

## Preview

```sh
npm ci
npm run dev -- --port=4322
```

Choose **Imagine-Science** for the current film. Earlier compositions are available in Studio.

## Source and review

- `production/brief.md`: visual direction, claim map, and source qualifications.
- `production/script.json`: exact delivered narration.
- `production/synthesize.py`: optional local synthesis/alignment preparation.
- `film.project.json`: scene timing, captions, review cues, and asset provenance.
- `src/explainer/LineFilm.tsx`: current fixed-camera vector animations aligned to the narration.
- `src/explainer/MethodFilm.tsx` and `src/explainer/optics/`: the earlier optical-instrument cut.
- `production/make-optics.py`: reproduces the two original material and lighting textures with NumPy and FFmpeg.
- `src/explainer/process/`: source and timing for the earlier continuous film.
- `src/explainer/`: earlier draft, caption overlay, voice word timings, and waveform.
- `public/explainer/`: prepared narration and the toolkit's original starter preview.
- `production/revision-2.md`: original continuous visual direction.
- `production/script-development.md`: approved researcher-focused script and A/V treatment.
- `production/revision-3.md`: superseded segmented-narration delivery.
- `production/revision-4.md`: earlier continuous narration, timing, and validation.
- `production/review.md`: superseded first-draft review and extraction findings.

```sh
npm run check
npm run build
npm run review
```

Helpers are unchanged from the toolkit. They were also invoked from the toolkit's
separate directory against this film project. Output evidence is written to
`out/review/`. The optional export path is `npm run render` followed by
`npm run verify`. The current delivery includes a Studio preview and a checked MP4.

The source project is published on the
[`film/imagine-science-explainer` branch](https://github.com/iamnikhiliyer/imagine-science/tree/film/imagine-science-explainer).
This is a product-explainer extraction exercise; it does not establish scientific
subject-matter accuracy or production-time savings for other researchers.

Original film source and script are MIT licensed. Dependency/model licenses
remain separate; source details accompany the manifest and production brief.
