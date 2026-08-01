# Portfolio — Michael Peacock

Live: **[portfolio.windwardline.com](https://portfolio.windwardline.com)**

A static portfolio. No framework, no build step, no dependencies — three files
and a config.

Six waypoints as of July 2026, each in production on its own domain
(Levelflow Cloud, Mimic, Pathfinder, Proper Form, TimeShift, That's Extra).
Every link on the chart resolves.

```
index.html               structure and content
style.css                the visual system
script.js                the lamp (light / dark / system), course-line draw, waypoint reveal
assets/                  portrait
vercel.json              security headers and caching
scripts/check-links.mjs  anchor and asset integrity check, run in CI
.github/workflows/ci.yml markup validation and parse checks
```

## The design

The page is built as a navigational chart, because the work is about plotting
routes: the brand is Windward Line, and Pathfinder's core artifact is literally
called a Route.

Choices follow real chart convention rather than decoration:

- **Magenta** (`#C4106B`) is what NOAA charts reserve for lights and cautions,
  so here it is reserved too — it marks soundings, the major light, and nothing
  else.
- **Buff, shoal-cyan, and navy linework** are chart-sheet colours.
- **Public Sans** is the US federal typeface, and NOAA is who publishes the
  charts.
- Water features on a chart are lettered in italic; the "soundings" line under
  each project leans for the same reason.
- **Dark** shifts the palette warm rather than cool, following the
  red-light convention ships use to preserve night vision after dark.

The projects are **waypoints on a plotted course**, ordered by first commit.
The sequence carries real information — it is the actual order the work
happened in.

The **legend** is where honesty lives. Not everything here is the same kind of
thing, and a chart that hides that is worse than no chart, so production work
and coursework are marked distinctly — and each waypoint
draws the same mark as its row in the legend, so the two cannot drift apart
without it being obvious.

## Continuous integration

Every push and pull request validates the markup (`html-validate`), checks that
every `#anchor` resolves to a real `id` and every referenced stylesheet and
script exists, and parses `script.js` and `vercel.json`.

External URLs are deliberately **not** fetched. A third-party outage turning CI
red is how a gate becomes noise that people learn to ignore.

## Quality floor

- Semantic HTML, one `h1`, labelled landmarks, skip link
- Keyboard focus visible on every interactive element
- `prefers-reduced-motion` honoured — no animation, course line drawn complete
- `prefers-color-scheme` honoured, with an explicit override that persists
- All text clears WCAG AA contrast in both themes (verified, not assumed)
- No horizontal scroll at any width
- Content does not depend on JavaScript: the reveal only arms itself after the
  observer that clears it is confirmed available, and there is a timeout
  failsafe behind that

## Local development

No toolchain required.

```bash
python3 -m http.server 8899
# then open http://127.0.0.1:8899
```

## Deployment

GitHub holds it, Vercel deploys it, Cloudflare answers for it. Pushes to `main`
deploy to production automatically.
