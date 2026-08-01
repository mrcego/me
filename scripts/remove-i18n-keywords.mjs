/**
 * Remove dead `keywords` keys from canonical i18n locale files.
 * Keeps titles, descriptions, and all other strings intact.
 *
 * Usage: node scripts/remove-i18n-keywords.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const localeDir = join(process.cwd(), 'i18n', 'locales');
const files = ['en.json', 'es.json'];

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function stripKeywords(value) {
  if (Array.isArray(value)) {
    return value.map(stripKeywords);
  }
  if (value && typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === 'keywords') continue;
      next[key] = stripKeywords(child);
    }
    return next;
  }
  return value;
}

let removed = 0;

for (const file of files) {
  const path = join(localeDir, file);
  const raw = readFileSync(path, 'utf8');
  const data = JSON.parse(raw);
  const before = JSON.stringify(data).match(/"keywords"/g)?.length ?? 0;
  const cleaned = stripKeywords(data);
  const after = JSON.stringify(cleaned).match(/"keywords"/g)?.length ?? 0;
  removed += before - after;
  writeFileSync(path, `${JSON.stringify(cleaned, null, 2)}\n`, 'utf8');
  console.log(`[remove-i18n-keywords] ${file}: removed ${before - after} keywords key(s)`);
}

console.log(`[remove-i18n-keywords] Done — ${removed} total keywords key(s) removed`);
