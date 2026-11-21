# Imagine Science — a moving explanation

A 31.63-second narrated introduction to Imagine Science, created from a separate
clone of the [public toolkit](https://github.com/iamnikhiliyer/imagine-science).

The film follows one animated schematic as sources connect to it, editable layers
separate and assemble, and temporal frames unfold for inspection and refinement.
The researcher's scientific judgment stays in the loop. Five shot entry points
are independently available in Studio. Narration is synthesized locally using
Kokoro's af_heart voice, with word-aligned highlighting and editable phrase captions.

## Preview

```sh
npm ci
npm run dev -- --port=4322
```

Open the printed URL and choose **Imagine-Science**. The shot compositions are
under **Shots**. The earlier presentation draft is retained under **Earlier-Draft**.
The film is 1920×1080 at 30 fps, 949 frames.

The approved researcher-focused script is paired with an ordered signal sequence,
quarter-speed demonstration, narration-aligned cue, and persistent scene edit.
The rendered video is `out/imagine-science-explainer.mp4`.

## Source and review

- `production/brief.md`: visual direction, claim map, and source qualifications.
- `production/script.json`: exact delivered narration.
- `production/synthesize.py`: optional local synthesis/alignment preparation.
- `film.project.json`: scene timing, captions, review cues, and asset provenance.
- `src/explainer/process/`: continuous camera/actor choreography and scientific schematic.
- `src/explainer/`: earlier draft, caption overlay, voice word timings, and waveform.
- `public/explainer/`: prepared narration and the toolkit's original starter preview.
- `production/revision-2.md`: current visual direction and review findings.
- `production/script-development.md`: approved researcher-focused script and A/V treatment.
- `production/revision-3.md`: current timing, motion changes, and validation.
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

The source project remains local on the `film/imagine-science-explainer` branch.
This is a product-explainer extraction exercise; it does not establish scientific
subject-matter accuracy or production-time savings for other researchers.

Original film source and script are MIT licensed. Dependency/model licenses
remain separate; source details accompany the manifest and production brief.
