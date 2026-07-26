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
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { injectEntryCssLinkIntoPublicDir } from './lib/entry-css-link.mjs';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const publicDir = join(process.cwd(), outputRoot, 'public');
const nuxtDir = join(publicDir, '_nuxt');

if (!existsSync(nuxtDir)) {
  console.error(`[css-link] Missing ${nuxtDir} — run nuxt generate first`);
  process.exit(1);
}

try {
  const { href, updated, lcpUpdated } = injectEntryCssLinkIntoPublicDir(publicDir);
  console.log(`[css-link] Preloaded LCP image in ${lcpUpdated} HTML file(s)`);
  console.log(`[css-link] Preloaded ${href} in ${updated} HTML file(s)`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
