# Contributing

Useful contributions include fixes to reproducible render/review failures,
clearer scientific-production conventions, and small public examples with
documented provenance. Explain the problem and expected behavior in an issue or PR.

## Local checks

Install Node 22.13+, FFmpeg, and ffprobe, then run:

```sh
npm ci
npm run check
npm run build
npm run review
npm run render
npm run verify
```

For helper changes, add a behavioral test. For animation changes, inspect exact
frames and continuous playback. A passing media check does not establish visual
or scientific correctness. Record review coverage and remaining uncertainties.

Keep changes focused, preserve frame determinism, and update the manifest
reference when changing its contract. Update the changelog when behavior changes.
Keep all Remotion packages at the same exact version. Review dependency changes
and run `npm audit`; do not force upgrades or suppress tests to pass checks.

Contributions must have rights suitable for public redistribution. Include
sources and generation provenance for added media, and mark schematics and
simulations clearly. Do not submit private data, unpublished research, API keys,
or personal machine paths. Contributions to original project content are offered
under the MIT license.
