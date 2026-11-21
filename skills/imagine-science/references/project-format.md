# Film project format (schemaVersion 1)

Run helpers from a trusted local project containing `package.json`,
`film.project.json`, `src/index.ts`, and `public/`. The project must install
`remotion`, `@remotion/cli`, `@remotion/bundler`, and `@remotion/renderer` at the
same exact version, together with React. Helpers resolve dependencies from that
project even when the installed skill lives elsewhere. Bundling executes project
code; this is a local development tool, not a sandbox for untrusted repositories.

The manifest describes a single composition:

```json
{
  "schemaVersion": 1,
  "compositionId": "Example",
  "title": "Example scientific explainer",
  "width": 1280,
  "height": 720,
  "fps": 30,
  "durationInFrames": 90,
  "scenes": [
    { "id": "intro", "startFrame": 0, "endFrame": 90, "title": "Example", "caption": "Schematic illustration." }
  ],
  "cues": [{ "frame": 45, "label": "Important visual event" }],
  "assets": [],
  "audio": { "mode": "silent", "path": null, "captions": [], "speechWindows": [] },
  "review": { "extraFrames": [], "maxFrames": 80 },
  "stationaryRegions": []
}
```

- `compositionId` must match a registered Remotion composition and use letters,
  numbers, or hyphens. The starter reads its registration metadata from the manifest.
- Width and height are positive even integers for H.264/yuv420p. Frame rate can
  be fractional, greater than zero and at most 120. Durations are integer frames.
- All scene, caption, speech-window, and stationary-region ranges are half-open:
  `[startFrame, endFrame)`. Scene ids are unique; scene ranges are contiguous,
  start at zero, and finish at `durationInFrames`.
- Scene titles/captions drive this starter. Existing projects must wire scene
  content, audio, and captions into their own components; declaring them in a
  manifest alone does not modify an existing composition.
- Cues and extraFrames must be integers between zero and `durationInFrames - 1`.
  They control evidence selection, not animation timing by themselves.

## Assets

```json
{
  "path": "plates/cell.png",
  "kind": "illustrative",
  "source": "Original schematic drawn for this film",
  "license": "MIT"
}
```

Paths are relative to `public/`, without its prefix. URLs, absolute paths,
backslashes, drive letters, traversal, and symlink escapes are rejected. Optional
`sha256` is a lowercase 64-character hash. Kinds are `measured`, `simulated`,
`illustrative`, or `generated`. Source and license are required statements; the
validator cannot establish their truth. Describe generation provenance in source
or adjacent production notes. Register all public assets used by your film;
the validator checks registered files, not an exhaustive source-code inventory.

## Narration and captions

Add the narration file to assets, then set:

```json
{
  "mode": "narrated",
  "path": "audio/narration.wav",
  "captions": [
    { "startFrame": 0, "endFrame": 60, "text": "The delivered spoken phrase." }
  ],
  "speechWindows": [
    { "startFrame": 5, "endFrame": 55, "minRms": 0.003 }
  ]
}
```

Caption intervals must be ordered, nonoverlapping, and within the film. Leave
intentional gaps. The starter includes `AudioTrack.tsx`; other projects must
connect these values to their own Remotion audio/caption rendering. Supply audio
that covers the intended film duration. Verification checks the final mixed
track; inspect the original file if an unwanted hold or silence is suspected.

## Stationary regions

An optional entry in `stationaryRegions`:

```json
{
  "x": 40, "y": 40, "width": 200, "height": 100,
  "startFrame": 30, "endFrame": 80,
  "maxMeanDifference": 0.15
}
```

The region must fit the canvas and cover at least two frames. Coordinates are
pixels. Use a genuinely stationary area and calibrate the difference threshold
against an acceptable compressed export.

## Commands and outputs

Invoke `node "<skill-directory>/scripts/cli.mjs" COMMAND` from the film directory.
The starter also exposes `npm run COMMAND` for each command.

| Command | Output |
| --- | --- |
| `doctor` | Tool versions and manifest validation; no browser download |
| `validate` | Timeline, registered assets/hashes, default review budget |
| `review [FRAME ...]` | `out/review/` PNGs, selection JSON, unreviewed Markdown |
| `render [OUTPUT.mp4]` | H.264 export; defaults to `out/film.mp4` |
| `verify [INPUT.mp4]` | `out/verification.json`; exits nonzero on failed checks |
| `contact-sheet [INPUT.mp4]` | `out/contact-sheet.jpg`, up to 30 overview samples |

All output defaults are local and ignored by Git. Helpers overwrite the named
outputs on rerun. `IMAGINE_CHROME` selects an installed Chrome executable;
otherwise Remotion downloads/manages Chrome Headless Shell. `IMAGINE_CONCURRENCY`
is a positive integer worker count (default 2). The helpers use Node APIs;
`remotion.config.ts` settings do not automatically apply to them.
