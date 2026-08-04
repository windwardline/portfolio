# Portfolio — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. The portfolio renders Michael Peacock's work as a NOAA-style navigational chart. Live at portfolio.windwardline.com. Hand-written `index.html` + `style.css` + `script.js` — no package.json, no build step.

## Commands

Dev: `python3 -m http.server 8899`. CI-equivalent locally: `npx --yes html-validate@9 index.html` · `node scripts/check-links.mjs` · `node --check script.js` · JSON-parse `vercel.json`.

## Gates — CI in order

html-validate → internal link/asset check → `vercel.json` parses → `script.js` syntax. Push to main deploys production (Vercel; Cloudflare DNS). A parallel `security.yml` (PRs, pushes, weekly cron) gates Semgrep and secret scan; a post-deploy job asserts the production security headers. An advisory Claude review runs on every PR (`claude-review.yml`, activating once the `ANTHROPIC_API_KEY` repo secret exists).

## Laws

- `scripts/check-links.mjs` deliberately never fetches external URLs — a third-party outage must not redden CI. Do not "improve" it into a live link checker. It does verify every `href="#…"` has a matching `id=` and every `<link>`/`<script>` file exists; add the file or id with the reference.
- CSP in `vercel.json` is strict: `script-src 'self'`, no `unsafe-inline`, Google Fonts the only external origin. Inline scripts/styles and new CDNs are blocked at runtime — CI will not catch them.
- Chart conventions are the design system: magenta `#C4106B` only for soundings and the major light; dark mode shifts warm (the night-vision convention), never cool.
- Content works without JS. `prefers-reduced-motion` and `prefers-color-scheme` are honored with a persisted explicit override; the reveal arms only after IntersectionObserver confirms, with a timeout failsafe.
- Fleet claims here (test counts, product roster) mirror the launch registry — verify against source repos before editing them.
