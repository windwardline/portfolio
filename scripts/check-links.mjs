/* Verify the page's internal wiring holds.
 *
 * Two failure modes this catches, both silent in a browser:
 *   - a nav link pointing at an #anchor that no longer exists
 *   - a <link>/<script> referencing a file that isn't in the repo
 *
 * External URLs are deliberately NOT fetched: a third-party outage would
 * turn this into a flaky gate that people learn to ignore.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

const problems = [];

/* ── anchors ─────────────────────────────────────────────── */
const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), (m) => m[1]));
const anchors = Array.from(html.matchAll(/href="#([^"]+)"/g), (m) => m[1]);

for (const a of anchors) {
  if (!ids.has(a)) problems.push(`anchor href="#${a}" has no matching id`);
}

/* ── local assets ────────────────────────────────────────── */
const assets = [
  ...Array.from(html.matchAll(/<link[^>]+href="([^"#:]+\.css)"/g), (m) => m[1]),
  ...Array.from(html.matchAll(/<script[^>]+src="([^"#:]+\.js)"/g), (m) => m[1]),
];

for (const a of assets) {
  if (!existsSync(resolve(root, a))) problems.push(`referenced asset is missing: ${a}`);
}

/* ── structure the page depends on ───────────────────────── */
if ((html.match(/<h1\b/g) || []).length !== 1) {
  problems.push('page must have exactly one <h1>');
}
if (!/<html[^>]+lang=/.test(html)) {
  problems.push('<html> is missing a lang attribute');
}

/* ── report ──────────────────────────────────────────────── */
if (problems.length) {
  console.error('Link/structure check failed:\n');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log(
  `Link/structure check passed — ${anchors.length} anchors, ${assets.length} assets, ${ids.size} ids.`
);
