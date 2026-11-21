# Enable GitHub Actions

`check.yml` is a complete Actions workflow for a fresh Node 22/Linux install. It
checks types, lint, contracts, real media integration tests, dependency advisories,
bundling, review rendering, the full example export, and export verification.

The initial GitHub HTTPS credential could publish the repository but lacked
`workflow` permission. GitHub therefore rejected an active workflow upload. This
configuration is distributed as a template until a maintainer enables it using
an appropriately authorized credential or the GitHub web interface.

With permission to manage Actions workflows:

```sh
mkdir -p .github/workflows
cp ci/check.yml .github/workflows/check.yml
git add .github/workflows/check.yml
git commit -m "ci: enable scientific animation checks"
git push
```

For GitHub CLI OAuth authentication, maintainers can request the additional scope
with `gh auth refresh -h github.com -s workflow` and complete GitHub's authorization
flow themselves. Existing SSH credentials with repository write access are another
option. Do not store credentials in the repository.

Until Actions is enabled, run the same commands locally:

```sh
npm ci
npm run doctor
npm run check
npm audit --audit-level=moderate
npm run build
npm run review -- 0 180 359
npm run render
npm run verify
npm run contact-sheet
```
