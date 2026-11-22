# Timing a narrated scientific film

Write the continuous spoken paragraph first. For each meaningful action, choose a distinctive phrase in the approved wording. The shipped explainer uses “the particles spread” to cue a change in the figure. In the project, word times are milliseconds and events are frame indices. Convert an onset using `Math.ceil(startMs * fps / 1000)` so the visual begins on the first frame at or after that word.

## Prepare a take

Use the voice the user selected. The toolkit accepts prepared audio. Its published explainer uses a continuous ElevenLabs Bella soundtrack. The closing invitation was recorded separately with the preceding sentence supplied as context. Earlier films used local Kokoro and its word timings. If you use recorded speech, align the transcript to the finished take. A new take of the same script can have different pauses and cue times.

For ElevenLabs, the separate signed-in CLI exposes `text-to-speech convert_with_timestamps`. Use MP3 output and save the JSON response locally. Keep the original character alignment, encoded audio, and the exact text submitted. Display spellings can differ from spoken spellings. The example’s `production/spoken-tokens.json` maps every displayed token in order, including “FFmpeg” to “eff eff em peg”. The script file contains a `text` field with the canonical paragraph.

To import an existing response, run the helper from the film project. Substitute the path to your installed skill and a new output directory.

```sh
node /path/to/imagine-science/scripts/import-elevenlabs.mjs \
  out/response.json production/script.json out/new-take production/spoken-tokens.json
```

The spoken-token array is optional when the submitted text equals the script joined with single spaces. The helper writes the original MP3 and canonical `words.json` with millisecond timings. Audition technical names in context, then register the selected audio file and its hash. If trimming the take, apply the same offset to the word times. Regenerate amplitude data if the scene displays a waveform.

## Keep presentation independently editable

For short-form captions, group a few words into a natural phrase and mark its last word with `pageBreakAfter`. Highlight the active word from its own start and end time. The example uses `@remotion/captions` for display pages and a separate set of longer, frame-aligned phrase captions in the manifest for WebVTT. A style edit can reuse the same audio and alignments.

After a voice change, update the frame count, scene boundaries, caption groups, speech windows, and review cues. Inspect frames immediately around key onsets and listen through joins. Run the skill CLI’s `subtitles` command to export the longer phrases and `verify` to check the finished MP4. When a host sets a size limit, `web MAX_BYTES [INPUT.mp4] [OUTPUT.mp4]` packages and verifies a separate web copy at the project resolution. Render the source composition at the intended resolution before compressing it.

[Editable published example](https://github.com/iamnikhiliyer/imagine-science/tree/main/examples/imagine-science)
