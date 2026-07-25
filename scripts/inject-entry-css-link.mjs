/**
 * After `nuxt generate`, inject an early preload for the bundled stylesheet so
 * CSS is discoverable from HTML (not only after entry JS runs).
 *
 * Uses rel=preload (not stylesheet) so we do not reintroduce render-blocking
 * CSS — first paint still comes from features.inlineStyles. Vite/JS applies
 * the same file from cache when the module graph runs.
 *
 * https://developer.chrome.com/docs/performance/insights/network-dependency-tree
 *
 * Honors NUXT_OUTPUT_DIR (default `.output`).
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const publicDir = join(process.cwd(), outputRoot, 'public');
const nuxtDir = join(publicDir, '_nuxt');

if (!existsSync(nuxtDir)) {
  console.error(`[css-link] Missing ${nuxtDir} — run nuxt generate first`);
  process.exit(1);
}

const cssFile =
  readdirSync(nuxtDir).find((name) => /^style\.[a-zA-Z0-9_-]+\.css$/.test(name)) ||
  readdirSync(nuxtDir).find((name) => /^entry\.[a-zA-Z0-9_-]+\.css$/.test(name));

if (!cssFile) {
  console.error('[css-link] No style.*.css / entry.*.css found in _nuxt');
  process.exit(1);
}

const href = `/_nuxt/${cssFile}`;
const marker = `href="${href}"`;

/** @param {string} dir */
function walkHtml(dir) {
  /** @type {string[]} */
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...walkHtml(full));
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

const linkTag = `<link rel="preload" as="style" href="${href}" crossorigin>`;
let updated = 0;

for (const file of walkHtml(publicDir)) {
  let html = readFileSync(file, 'utf8');
  if (html.includes(marker)) continue;

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head[^>]*>/i, (open) => `${open}${linkTag}`);
  } else {
    console.warn(`[css-link] No <head> in ${relative(publicDir, file)}`);
    continue;
  }

  writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`[css-link] Preloaded ${href} in ${updated} HTML file(s)`);
