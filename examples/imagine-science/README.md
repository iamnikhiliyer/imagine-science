# From paper to film

This is the editable project for the 1:32 Imagine Science film. It renders 2,760 frames at 3840 × 2160 and 30 fps. Run `npm ci` at the repository root, then `npm run dev:explainer` to open it. For an MP4 use `npm run explainer -- render`, then `npm run explainer -- verify`.

| File | What it controls |
| --- | --- |
| [Production brief](production/brief.md) | Sources for the publication statistic, the diffusion illustration, and the qualifications behind both |
| [Script](production/script.json) | The spoken paragraph and scene-opening phrases |
| [Word alignment](src/words.json) | Start/end times in milliseconds and the short caption phrase breaks |
| [Film](src/Film.tsx) | Drawings, motion, cue lookups, and the highlighted word display |
| [Manifest](film.project.json) | Scene ranges, longer caption groups, audio checks, review frames, and narration provenance |
| [Rendered waveform](src/waveform.json) | Amplitude bins from the included voice track used in the narration illustration |
| [Visual descriptions](production/descriptions.vtt) | Timed descriptions for the web player |

Try changing the mint word highlight in `WordHighlight` and preview the same phrase again. For a narrated timing edit, change the cue in the scene and inspect frames on either side. When replacing the voice take, derive new word times, scene boundaries, waveform, and duration from that audio before rendering. [Narration workflow](../../skills/imagine-science/references/narrated-films.md)

## Generate another take

To request a new recording with a signed-in ElevenLabs CLI, run the following from this example directory. Generation uses your ElevenLabs account. Previewing and rendering the included film uses the prepared audio.

```sh
mkdir -p out
elevenlabs text-to-speech convert_with_timestamps \
  --voice-id hpp4J3VqNfWAUOO0d1Us --model-id eleven_multilingual_v2 \
  --voice-settings.stability 0.48 --voice-settings.similarity-boost 0.78 \
  --voice-settings.speed 1 --output-format mp3_44100_128 \
  --text "$(node -p "require('./production/spoken-tokens.json').join(' ')")" \
  --format json > out/response.json
node ../../skills/imagine-science/scripts/import-elevenlabs.mjs \
  out/response.json production/script.json out/new-take production/spoken-tokens.json
```

The prepared narration is ElevenLabs Bella, generated with `eleven_multilingual_v2`. Its reuse is subject to the applicable ElevenLabs terms. Earlier optical, presentation, and Kokoro drafts are available in the [film development branch](https://github.com/iamnikhiliyer/imagine-science/tree/film/imagine-science-explainer).
