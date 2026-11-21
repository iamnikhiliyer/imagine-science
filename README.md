# Imagine Science — a moving explanation

A 30.67-second narrated introduction to Imagine Science, created from a separate
clone of the [public toolkit](https://github.com/iamnikhiliyer/imagine-science).

The film explains references → editable Remotion scenes → frame review → export
checks, with the researcher's scientific judgment kept in the loop. Five scenes
are independently available in Studio. Narration is synthesized locally using
Kokoro's af_heart voice, with word-aligned highlighting and editable phrase captions.

## Preview

```sh
npm ci
npm run dev -- --port=4322
```

Open the printed URL and choose **Imagine-Science**. The scene compositions are
under **Scenes**. The film is 1920×1080 at 30 fps, 920 frames.

## Source and review

- `production/brief.md`: visual direction, claim map, and source qualifications.
- `production/script.json`: exact delivered narration.
- `production/synthesize.py`: optional local synthesis/alignment preparation.
- `film.project.json`: scene timing, captions, review cues, and asset provenance.
- `src/explainer/`: editable scenes, caption overlay, voice word timings, and waveform.
- `public/explainer/`: prepared narration and the toolkit's original starter preview.
- `production/review.md`: actual sampled-frame review and extraction findings.

```sh
npm run check
npm run build
npm run review
```

Helpers are unchanged from the toolkit. They were also invoked from the toolkit's
separate directory against this film project. Output evidence is written to
`out/review/`. The optional export path is `npm run render` followed by
`npm run verify`; a Studio preview is the current deliverable.

The source project remains local on the `film/imagine-science-explainer` branch.
This is a product-explainer extraction exercise; it does not establish scientific
subject-matter accuracy or production-time savings for other researchers.

Original film source and script are MIT licensed. Dependency/model licenses
remain separate; source details accompany the manifest and production brief.
