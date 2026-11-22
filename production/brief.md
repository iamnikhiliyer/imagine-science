# Imagine Science — the toolkit explains itself

Audience: researchers and scientific communicators discovering the project.
Goal: explain what the toolkit provides, its workflow, and the researcher's role.
Format: landscape 3840×2160, 30 fps, approximately 92 seconds, synthesized
English narration with synchronized captions. Duration follows the delivered voice.

## Visual contract

The fixed frame centers one vector drawing on warm paper. Dark green ink describes the figure and a rust-colored dot identifies one particle. Each narrated verb moves one element: a line traces a claim, a shape draws, a cloud spreads, three frames join, and one timing mark moves. Other elements rest while the viewer reads. The film displays short phrases in a rounded bar with a mint highlight on the spoken word. The English subtitle track uses the longer phrases. Both follow the same recording. All shapes and type render directly on a 3840 × 2160 canvas.

The publication figure derives from 3,525,866 science and engineering articles in selected journals and conference proceedings indexed by Scopus for 2024, divided by 366 and rounded to the nearest hundred. [National Science Board, worldwide publication output](https://ncses.nsf.gov/pubs/nsbsep20261/discovery-r-d-activity-and-research-publications-2)

The paper graphic is an original research note about Einstein’s 1905 treatment of diffusion and Brownian motion. The trajectories are illustrative and use presentation time. [Einstein, Annalen der Physik, §§ IV–V](https://doi.org/10.1002/andp.19053220806)

## Claim map

| Claim | Evidence | Qualification |
| --- | --- | --- |
| Scientific animation workflow | Published README and skill | Agent-assisted; researcher supplies content |
| Editable Remotion scenes | Starter React/SVG source | Builds on Remotion |
| Timing remains editable | Frame-based manifest and composition | Code and scene plan remain editable |
| Exact-frame inspection | `review` command | Sampled frames; inspect continuous motion separately |
| Export checks | `verify` command and tests | Media properties and configured checks, not scientific approval |
| Traceable evidence | Asset source/license/hash manifest | Completeness and truth still need researcher review |

Primary source: https://github.com/iamnikhiliyer/imagine-science/tree/v0.1.0

ElevenLabs generated one continuous English take using Bella and eleven_multilingual_v2 at speed 1.0.
The original script, word timings, waveform envelope, and generated FLAC are
retained. Caption and animation timings derive from the character alignment returned with the recording.

## Extraction setup

This film starts from a separate clone of Imagine Science v0.1.0. It uses the
published toolkit's helpers from outside the film directory, without changing
the toolkit implementation. New film-specific composition and narration source
live here. This is a product explainer extraction exercise, not yet an independent
scientific subject-matter validation.
