# Imagine Science — initial scope

An agent-assisted scientific animation toolkit: a portable Codex skill, a runnable
Remotion starter, and repeatable frame-review and media-verification commands.

## Users and outcome

Researchers and scientific communicators supply a brief, references, assets, and
optionally prepared narration. They retain editable animation source, a frame-based
scene plan, provenance, review evidence, and a checked MP4 export.

## First release

- Self-contained `skills/imagine-science/` with instructions, references, and tools.
- A public, code-native, silent schematic example; no private research assets.
- `film.project.json` controls composition metadata, scene boundaries, review cues,
  optional narration/captions, asset provenance, and optional stationary-region checks.
- Preview, bundle, render, review stills, contact sheet, and export verification.
- Tools resolve Remotion from the target project's dependencies, including when
  invoked from an installed skill outside that project.
- Verify dimensions, frame rate, frame count, codec, audio policy, and complete
  decodability. Optional speech windows check signal energy, not speech meaning.
- Review reports identify sampled frames and start as unreviewed. No automatic
  claim of scientific correctness or every-frame visual inspection.
- MIT license for original code; dependency licenses remain separate.
- A CI template checks contracts, types, bundling, and a render/verification smoke
  test. Activation requires a GitHub credential with workflow permission; the
  initial publishing credential lacks it. Run the same checks locally meanwhile.

## Explicit boundaries

Image generation, video generation, and TTS use separately available tools or supplied
files. This release does not implement provider clients, a hosted service, or a new
editor. It does not claim fully automatic scientific review. The next real film is
the extraction test; this release's example is a technical starter.

## Acceptance

1. A fresh checkout installs with `npm ci` and works without API keys.
2. Preview and full example render work with the pinned Remotion dependencies.
3. Review frames include scene boundaries, cues, and first/last frames.
4. Invalid timelines, unsafe asset paths, missing assets, and incorrect media fail.
5. The skill remains usable when copied outside the repository.
6. The public repository contains no private research material or machine paths.
