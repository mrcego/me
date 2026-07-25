/**
 * After generate, prefer font-display:optional over swap in prerendered HTML.
 * Metric-adjusted local fallbacks already ship via @nuxt/fonts — optional avoids
 * a late webfont swap shifting the hero name (PSI CLS on "CESAR").
 *
 * Usage: node scripts/font-display-optional.mjs
 * Honors NUXT_OUTPUT_DIR (default `.output`).
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const publicDir = join(process.cwd(), outputRoot, 'public');

if (!existsSync(publicDir)) {
  console.error(`[fonts] Missing ${publicDir} — run nuxt generate first`);
  process.exit(1);
}

/**
 * @param {string} dir
 * @returns {Generator<string>}
 */
function* walkHtml(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) yield* walkHtml(full);
    else if (name.endsWith('.html')) yield full;
  }
}

let files = 0;
let replacements = 0;
for (const file of walkHtml(publicDir)) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('font-display:swap')) continue;
  const next = html.replaceAll('font-display:swap', 'font-display:optional');
  const count = html.split('font-display:swap').length - 1;
  writeFileSync(file, next, 'utf8');
  files += 1;
  replacements += count;
}

console.log(
  `[fonts] font-display:optional in ${files} HTML file(s) (${replacements} @font-face rules)`,
);
