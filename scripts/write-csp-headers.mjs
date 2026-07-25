/**
 * After `nuxt generate`, write Netlify `_headers` with a CSP that works with
 * Nuxt SSG + Vue 3 on Netlify.
 *
 * Why not script-src hashes / Trusted Types enforcement?
 * - Nuxt inlines `window.__NUXT__.config` (includes a per-build `buildId`).
 * - `netlify deploy` re-runs `[build].command` even with `--dir`, producing a
 *   second buildId; uploaded HTML and hashed CSP then diverge → Vue never boots.
 * - Vue 3 creates a Trusted Types policy named `vue`, not only `default`.
 *
 * We still lock down origins, framing, objects, and mixed content.
 *
 * Usage: node scripts/write-csp-headers.mjs
 * Honors NUXT_OUTPUT_DIR (default `.output`).
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildCspHeaderValue, buildNetlifyHeadersFile } from './lib/csp.mjs';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const publicDir = join(process.cwd(), outputRoot, 'public');

if (!existsSync(publicDir)) {
  console.error(`[csp] Missing ${publicDir} — run nuxt generate first`);
  process.exit(1);
}

const csp = buildCspHeaderValue();
const outFile = join(publicDir, '_headers');
writeFileSync(outFile, buildNetlifyHeadersFile(csp), 'utf8');
console.log(`[csp] Wrote ${outFile}`);
console.log(`[csp] script-src 'self' 'unsafe-inline' (hash/TT enforcement disabled for Nuxt SSG)`);
