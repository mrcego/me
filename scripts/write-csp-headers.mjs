/**
 * After `nuxt generate`, write Netlify `_headers` with CSP + cache policies
 * for Nuxt SSG + Vue 3 on Netlify.
 *
 * script-src uses per-build sha256 hashes of executable inline scripts (no
 * 'unsafe-inline'). Safe because deploy is artifact + `--no-build` (no second
 * generate that would desync hashes).
 *
 * Cache-Control rules (HTML no-cache, `/_nuxt` immutable, images SWR, favicons)
 * are generated here too — GH Actions uploads only `.output/public`, so
 * `netlify.toml` [[headers]] never reach production CDN.
 *
 * Trusted Types (`require-trusted-types-for`) stays OFF by default: Vue's
 * `vue` policy is not enough — other sinks (e.g. innerHTML) still throw under
 * enforcement. Opt in with NUXT_CSP_TRUSTED_TYPES=1 for experiments only.
 *
 * Usage: node scripts/write-csp-headers.mjs
 * Honors NUXT_OUTPUT_DIR (default `.output`).
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildCspHeaderValue,
  buildNetlifyHeadersFile,
  collectInlineScriptHashes,
} from './lib/csp.mjs';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const publicDir = join(process.cwd(), outputRoot, 'public');

if (!existsSync(publicDir)) {
  console.error(`[csp] Missing ${publicDir} — run nuxt generate first`);
  process.exit(1);
}

const scriptHashes = collectInlineScriptHashes(publicDir);
if (scriptHashes.length === 0) {
  console.error(`[csp] No executable inline scripts found under ${publicDir}`);
  process.exit(1);
}

const enableTrustedTypes = process.env.NUXT_CSP_TRUSTED_TYPES === '1';
const csp = buildCspHeaderValue({ scriptHashes, enableTrustedTypes });
const outFile = join(publicDir, '_headers');
writeFileSync(outFile, buildNetlifyHeadersFile(csp), 'utf8');

console.log(`[csp] Wrote ${outFile}`);
console.log(`[csp] script-src hashes: ${scriptHashes.length} (no 'unsafe-inline')`);
console.log(
  `[csp] Trusted Types: ${enableTrustedTypes ? "require-trusted-types-for 'script'; trusted-types vue default" : 'disabled (set NUXT_CSP_TRUSTED_TYPES=1 to experiment)'}`,
);
console.log(
  `[csp] Also ships HSTS (includeSubDomains; preload), COOP, CORP, frame guards, and cache policies`,
);
