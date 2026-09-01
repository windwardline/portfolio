# Portfolio — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. Work here follows the CONVERGE cycle and delivery discipline in `FLEET.md` (windwardline/windwardline) — find → refute → verify yourself → fix → re-rank → test → update → report; enumerate the gates rather than counting them, stage explicit paths, validate before mutating, preserve standing claims, derive populations rather than curating them, and never let a harness failure read as the subject refusing. `FLEET.md` governs where it and this summary differ. The portfolio renders Michael Peacock's work as a NOAA-style navigational chart. Live at portfolio.windwardline.com. Hand-written `index.html` + `style.css` + `script.js` — no package.json, no build step.

## Commands

Dev: `python3 -m http.server 8899`. CI-equivalent locally: `npx --yes html-validate@9 index.html` · `node scripts/check-links.mjs` · `node --check script.js` · JSON-parse `vercel.json`.

## Gates — CI in order

`ci.yml` runs the gates in order on every push to `main` and every PR into it: html-validate → internal link/asset check → `vercel.json` parses → `script.js` syntax. Those are CI-only tools fetched per-run with `npx`, not repo dependencies — the site ships none. Push to main deploys production (Vercel; Cloudflare DNS). A parallel `security.yml` (PRs, pushes, weekly cron; a daily cron runs only the production headers probe) gates Semgrep and secret scan; a post-deploy job asserts the production security headers. The required `Secret scan` job also runs the pinned `actions/verify-action-pins` step; a mutable third-party `uses:` reference or a full-SHA/immutable-tag comment mismatch fails that required check. An advisory Claude review runs on every eligible same-repo pull-request event via `claude-review.yml` when `github.event.pull_request.user.login` — the PR author, stable across reruns — is not `dependabot[bot]` and the base equals the repository's dynamic default branch; forks and events without the `CLAUDE_CODE_OAUTH_TOKEN` secret skip by design. The caller deliberately uses the fleet reusable at `@main`, so one merge updates every repo; reviews bill the owner's Claude subscription, not Console credits.

`dependabot-auto-merge.yml` merges nothing itself. On a Dependabot PR raised in this repo under the `windwardline` owner — never a fork — it arms GitHub's native auto-merge (`gh pr merge --squash --auto --delete-branch`), leaving the branch ruleset's required checks as the only thing that decides whether a merge happens. It first asserts a gate exists, holding unless `allow_auto_merge` is on and at least one required status check is configured, because `--auto` degrades to an immediate merge when nothing is pending. It also holds for the `no-automerge` label, a release that changed maintainers, pre-1.0 packages, empty or unverifiable Dependabot metadata, an unrecognised update type, and major bumps — labelled `deferred-major` once the merge-gate preflight passes — and it withdraws an auto-merge it armed earlier when a rebase makes the PR non-compliant. Empty or unverifiable metadata and an unrecognised update type are distinct holds. Dependabot groups this repo's GitHub Actions updates into one PR; `fetch-metadata` reports the highest semver change across the whole grouped PR, so one held member holds the group and the arm-or-hold decision applies to that grouped PR. The credential upgrades itself: it mints a GitHub App token when `FLEET_AUTOMERGE_APP_ID` and `FLEET_AUTOMERGE_PRIVATE_KEY` are present as **Dependabot** secrets (Actions secrets resolve empty in a Dependabot run) and degrades to `GITHUB_TOKEN` when they are absent — and a push attributed to `GITHUB_TOKEN` creates no workflow run at all, so on the fallback path an auto-merged commit never fires the post-merge `Headers live` probe. The job carries no `name:` so the check renders exactly `dependabot-auto-merge`; it must never become a required check.

## Laws

- `scripts/check-links.mjs` deliberately never fetches external URLs — a third-party outage must not redden CI. Do not "improve" it into a live link checker. It does verify every `href="#…"` has a matching `id=` and every `<link>`/`<script>` file exists; add the file or id with the reference.
- CSP in `vercel.json` is strict: `script-src 'self'`, no `unsafe-inline`, Google Fonts the only external origin. Inline scripts/styles and new CDNs are blocked at runtime — CI will not catch them.
- Chart conventions are the design system: magenta `#C4106B` only for soundings and the major light; dark mode shifts warm (the night-vision convention), never cool.
- Content works without JS. `prefers-reduced-motion` and `prefers-color-scheme` are honored with a persisted explicit override; the reveal arms only after IntersectionObserver confirms, with a timeout failsafe.
- Test counts mirror their source repositories; the product roster mirrors the launch registry; the CONVERGE summary mirrors `FLEET.md`. Verify each source immediately before copying its claim here.

## Declared gates

The machine-readable gate set. `scripts/fleet-conformance.sh` requires this block
and the workspace done-gate hook runs every `gate:` line before a session may
finish, so what runs is what is written here rather than what a hook guessed from
`package.json`. Each key states its own boundary: `gate:` runs at session end and
must be local and quick; `release:` runs before a pull request and may be slow;
`cadence:` is scheduled or needs the live machine and is run by neither.

```fleet-gates
gate: npx --yes html-validate@9 index.html
gate: node scripts/check-links.mjs
gate: node --check script.js
gate: node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"
```
