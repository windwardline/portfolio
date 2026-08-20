# Portfolio — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. Work here follows the CONVERGE cycle and delivery discipline in `FLEET.md` (windwardline/windwardline) — find → refute → verify yourself → fix → re-rank → test → update → report; enumerate the gates rather than counting them, stage explicit paths, validate before mutating, preserve standing claims, derive populations rather than curating them, and never let a harness failure read as the subject refusing. `FLEET.md` governs where it and this summary differ. The portfolio renders Michael Peacock's work as a NOAA-style navigational chart. Live at portfolio.windwardline.com. Hand-written `index.html` + `style.css` + `script.js` — no package.json, no build step.

## Commands

Dev: `python3 -m http.server 8899`. CI-equivalent locally: `npx --yes html-validate@9 index.html` · `node scripts/check-links.mjs` · `node --check script.js` · JSON-parse `vercel.json`.

## Gates — CI in order

html-validate → internal link/asset check → `vercel.json` parses → `script.js` syntax. Push to main deploys production (Vercel; Cloudflare DNS). A parallel `security.yml` (PRs, pushes, weekly cron; a daily cron runs only the production headers probe) gates Semgrep and secret scan; a post-deploy job asserts the production security headers. An advisory Claude review runs on every same-repo PR via `claude-review.yml`, which deliberately calls the fleet reusable at `@main` — one merge updates every repo. It activates only when the `CLAUDE_CODE_OAUTH_TOKEN` secret is present — reviews bill the owner's Claude subscription, not Console credits; fork PRs never receive secrets, so they skip it by security design.

## Laws

- `scripts/check-links.mjs` deliberately never fetches external URLs — a third-party outage must not redden CI. Do not "improve" it into a live link checker. It does verify every `href="#…"` has a matching `id=` and every `<link>`/`<script>` file exists; add the file or id with the reference.
- CSP in `vercel.json` is strict: `script-src 'self'`, no `unsafe-inline`, Google Fonts the only external origin. Inline scripts/styles and new CDNs are blocked at runtime — CI will not catch them.
- Chart conventions are the design system: magenta `#C4106B` only for soundings and the major light; dark mode shifts warm (the night-vision convention), never cool.
- Content works without JS. `prefers-reduced-motion` and `prefers-color-scheme` are honored with a persisted explicit override; the reveal arms only after IntersectionObserver confirms, with a timeout failsafe.
- Fleet claims here (test counts, product roster) mirror the launch registry — verify against source repos before editing them.
