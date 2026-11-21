# Imagine Science — script development

Status: approved and implemented for researchers who might use the toolkit.
The user approved this direction before the production narration, alignment, and
choreography were rebuilt. Current delivery timing is in `revision-3.md`.

## What failed in the current script

The current narration names workflow features without establishing a researcher's
reason to use them. "Traceable sources" and "scientific judgment" are assertions
without a demonstrated consequence. The lines mostly describe the software;
the viewer's problem and the benefit of an editable explanation are secondary.

The writing process also started production too early. Synthesizing a voice and
fitting animation to it made weak wording expensive to revisit. Better motion
cannot settle the message or make an unsupported promise convincing.

## Creative brief

- Audience: researchers who need to explain a mechanism or sequence visually.
- Viewing context: a project introduction, with a link to the public repository.
- Viewer question: Can this help me explain the process and still revise the details?
- Single takeaway: Build an editable scientific animation with your coding agent,
  starting from your own references.
- Proof: show one illustrative sequence, then change its pacing and narration
  alignment while keeping the same editable scene.
- Tone: a researcher speaking to a colleague; concrete, calm, and direct.
- Action: explore the toolkit on GitHub.
- Target: approximately 30 seconds; final timing follows a spoken read.

## Professional practice to adopt

Use a short explainer treatment followed by a two-column audio/visual script.
Write the spoken line and the visible action together. The action must do some
of the explanatory work rather than merely decorate a sentence.

The production sequence is:

1. Define the audience, desired takeaway, supported promise, and viewing context.
2. Choose a premise and one visible demonstration that proves the promise.
3. Write exact narration alongside actions, camera changes, and essential text.
4. Edit for the ear: short clauses, natural emphasis, concrete verbs, and space
   for the viewer to see the event. Time a read before assigning frame boundaries.
5. Check claims and the meaning of the depicted science against the sources.
6. Resolve the copy before generating the production voice, alignment, and final
   choreography. A scratch read may test timing without changing the current film.

StudioBinder documents the two-column AV format, with separate audio and visual
descriptions: https://www.studiobinder.com/tutorials/write/intro-to-av-script/

Wistia recommends an audience/goal brief, conversational wording, an actionable
ending, and reading the draft aloud before production:
https://wistia.com/blog/wistias-scripting-tips

These references support the process. They do not certify the quality of this
particular draft, and writing software does not replace the editorial decisions.

## Creative directions considered

| Direction | Assessment |
| --- | --- |
| Feature tour | Already tried; too much abstract workflow language |
| Founder/engineering story | Better suited to a portfolio audience |
| Researcher's explanation, demonstrated and revised | Recommended for the confirmed audience |

## Approved narration

You know how the mechanism works. Now help someone else see it.

Imagine Science helps you build scientific animations with your coding agent.

Start from your references. Show the sequence, slow the critical step, and match
the narration to the action.

Keep the scene editable as your explanation develops.

Explore Imagine Science on GitHub.

## Audio/visual script

The shot ranges below follow the delivered voice and deliberate visual holds.
Word-level alignment is retained in `src/explainer/words.json`.

Scratch read: 54 words, 23.225 seconds including short inter-line pauses, using
the existing local af_heart voice at speed 1.05. Individual line durations were
3.800, 5.250, 6.550, 3.550, and 2.625 seconds. This leaves approximately seven
seconds for visual holds in a 30-second cut. These are synthesis measurements,
not a human performance review or final production timing. The read and timing
report are local artifacts under `out/script-development/`.

| Approx. time | Narration | Visible action and purpose |
| --- | --- | --- |
| 0–6s | You know how the mechanism works. Now help someone else see it. | Begin inside a clearly labeled schematic. Follow one signal through a short, ordered path. The viewer sees an actual sequence to understand, rather than a network of simultaneous decorative pulses. |
| 6–12.17s | Imagine Science helps you build scientific animations with your coding agent. | Pull back from the animation to reveal the editable scene. Identify Imagine Science and separate its trace/cell layers to show the editable structure. |
| 12.17–23.17s | Start from your references. Show the sequence, slow the critical step, and match the narration to the action. | Source notes connect to the scene. Replay the sequence, slow the signal to quarter speed, and align a cell arrival to the spoken word "action." The actual narration waveform carries the cue marker. |
| 23.17–27.63s | Keep the scene editable as your explanation develops. | Hold the same scene while an annotation is moved clear of the cell. Retain the changed annotation when movement resumes. |
| 27.63–31.63s | Explore Imagine Science on GitHub. | Resolve to the identity and legible repository address while the animation continues. |

## Editorial and evidence checks

- The first sentence addresses an explanatory task faced by the confirmed audience.
- The product is named and described in ordinary terms.
- "Coding agent" makes an important usage requirement explicit.
- The timing demonstration and actual editable source support the main benefit.
- The source-grounding language asks the researcher to supply references; it does
  not imply automatic paper ingestion or scientific validation.
- The illustrative network is not measured activity or a calibrated simulation.
- No claims of time savings, revenue, instant generation, automatic accuracy,
  or novelty over other tools are made.
- The ending gives one clear next action.

The production wording is the approved text above. The final audio includes
visual holds beyond the scratch read. Sources and timing are retained alongside
the editable scene.
