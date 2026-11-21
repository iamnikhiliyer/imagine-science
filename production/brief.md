# Imagine Science — the toolkit explains itself

Audience: researchers and scientific communicators discovering the project.
Goal: explain what the toolkit provides, its workflow, and the researcher's role.
Format: landscape 1920×1080, 30 fps, approximately 30 seconds, local synthesized
English narration with synchronized captions. Duration follows the delivered voice.

## Visual contract

Warm paper (#f6f2e9), deep ink (#102023), teal (#39776c), and restrained terracotta
(#bf6846). Large editorial serif titles, Manrope labels, fine diagram lines, and
subtle dotted registration marks. Motion expresses transformation and inspection:
source sheets become a scene; frame evidence is examined; the editable source
and exported film remain connected. Keep the lower 150px clear for captions.

Use the toolkit's real starter preview and real source excerpts. Diagram motifs
are schematic. No fabricated product interface, experimental data, user counts,
performance claims, or implied automatic scientific approval. Keep scenes readable
at their first and last frames. Match cuts and visual emphasis to delivered speech.

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

Narration uses the local Kokoro-82M model, af_heart voice, English, speed 1.05.
The original script, word timings, waveform envelope, and generated FLAC are
retained. Model source and license: https://huggingface.co/hexgrad/Kokoro-82M

## Extraction setup

This film starts from a separate clone of Imagine Science v0.1.0. It uses the
published toolkit's helpers from outside the film directory, without changing
the toolkit implementation. New film-specific composition and narration source
live here. This is a product explainer extraction exercise, not yet an independent
scientific subject-matter validation.
