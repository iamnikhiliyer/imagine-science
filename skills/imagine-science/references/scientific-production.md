# Scientific production

## A brief that can be checked

Establish what the audience should understand and which source supports each
claim. For each scene, note the evidence, visual action, wording, and omissions.
When sources disagree or do not support a claim, name that uncertainty rather
than resolving it with plausible-looking artwork.

Keep a short claims table in the film's production notes:

| Claim or visual | Source and location | Evidence type | Qualification | Researcher review |
| --- | --- | --- | --- | --- |

Evidence types include measurement, reported result, computational simulation,
schematic explanation, and proposed experiment. A visually accurate illustration
does not establish that the process occurred in the research.

## Geometry, time, and data

- Preserve units, axis directions, relative ordering, and named parts.
- Make nonphysical scale and condensed time clear where they affect interpretation.
- Preserve the coordinate system, acquisition timing, display normalization, and
  preprocessing history of experimental images or traces.
- Label generated or synthetic activity. Do not decorate a measured trace with
  invented spikes or imply that schematic pulses are recorded activity.
- Do not invent physical dimensions, experimental performance, statistical
  significance, biological response, or causal relationships.
- Explain visually important exclusions: removed backgrounds, omitted layers,
  simplified circuitry, changed time scales, or selected fields of view.

The starter's particle paths are deliberately illustrative. They are not a
calibrated diffusion simulation, and the animation's seconds are presentation
time, not physical time. The mechanism has no fitted diffusion coefficient.

## Assets and generation

List files used from `public/` in the manifest. Include source, rights statement,
and classification. Use SHA-256 when the exact source version matters. For a
generated asset, record the original prompt, provider/model, date, and relevant
settings when known; mark unavailable details as unavailable.

Keep unpublished research and restricted assets out of public examples. Ask the
researcher when rights or disclosure scope cannot be established from the task.
Prefer a new schematic over republishing private CAD or third-party figures.

External generation is optional. The default example needs no API keys. Narration
may be recorded, supplied, or synthesized using separately available TTS tools.
When using a local voice, document installation, voice identifier, and output
settings. When using a paid service, follow the user's authorized spending scope.
The repository does not include generation provider clients or model weights.

## Narration and accessible explanations

Finalize enough of the script to establish scene timing, prepare the audio, and
then align scenes and captions to it. Do not silently speed up or truncate
delivered narration. Track phrase or word timings from actual alignment output.
Caption text must represent the delivered speech.

Use labels and shape as well as color. Keep labels readable at the target viewing
size, give dense diagrams time to be inspected, and provide captions/transcripts
for narrated films. Scientific notes can supplement a film but cannot repair a
misleading central animation.

## Human review

Record researcher review separately from visual review. An agent may check claim
consistency against supplied sources, but that is not peer review. A clean export
or a favorable visual score does not settle the underlying science.
