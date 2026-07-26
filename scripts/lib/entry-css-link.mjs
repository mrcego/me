/**
 * Helpers for injecting early critical preloads into generated HTML.
 * Used by scripts/inject-entry-css-link.mjs and unit tests.
 *
 * Order after <head>: LCP image (fetchpriority=high), then CSS preload.
 * Image must precede the ~200KB inline style block or resource load delay
 * stays hundreds of ms even when a late useHead preload exists.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { injectHeroLcpImagePreload } from './lcp-image-preload.mjs';

/** @param {string} name */
export function isBundledStylesheetName(name) {
  return /^style\.[a-zA-Z0-9_-]+\.css$/.test(name) || /^entry\.[a-zA-Z0-9_-]+\.css$/.test(name);
}

/**
 * @param {string} nuxtDir
 * @returns {string | null}
 */
export function findBundledStylesheet(nuxtDir) {
  if (!existsSync(nuxtDir)) return null;
  const names = readdirSync(nuxtDir);
  return (
    names.find((name) => /^style\.[a-zA-Z0-9_-]+\.css$/.test(name)) ||
    names.find((name) => /^entry\.[a-zA-Z0-9_-]+\.css$/.test(name)) ||
    null
  );
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function walkHtmlFiles(dir) {
  /** @type {string[]} */
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...walkHtmlFiles(full));
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

/**
 * @param {string} html
 * @param {string} href e.g. /_nuxt/style.abc.css
 * @returns {{ html: string, changed: boolean }}
 */
export function injectStylesheetPreload(html, href) {
  const marker = `rel="preload" as="style" href="${href}"`;
  if (html.includes(marker)) return { html, changed: false };

  const linkTag = `<link rel="preload" as="style" href="${href}" crossorigin>`;
  if (!/<head[^>]*>/i.test(html)) return { html, changed: false };

  // Prefer immediately after an early LCP image preload when present.
  const afterLcp = html.replace(
    /(<head[^>]*>\s*<link\b[^>]*\bas=["']image["'][^>]*>)/i,
    `$1${linkTag}`,
  );
  if (afterLcp !== html) return { html: afterLcp, changed: true };

  return {
    html: html.replace(/<head[^>]*>/i, (open) => `${open}${linkTag}`),
    changed: true,
  };
}

/**
 * @param {string} publicDir
 * @returns {{ href: string, updated: number, lcpUpdated: number }}
 */
export function injectEntryCssLinkIntoPublicDir(publicDir) {
  const nuxtDir = join(publicDir, '_nuxt');
  const cssFile = findBundledStylesheet(nuxtDir);
  if (!cssFile) {
    throw new Error(`[css-link] No style.*.css / entry.*.css found in ${nuxtDir}`);
  }

  const href = `/_nuxt/${cssFile}`;
  let updated = 0;
  let lcpUpdated = 0;

  for (const file of walkHtmlFiles(publicDir)) {
    const before = readFileSync(file, 'utf8');
    const lcp = injectHeroLcpImagePreload(before);
    const css = injectStylesheetPreload(lcp.html, href);
    if (!lcp.changed && !css.changed) continue;
    writeFileSync(file, css.html, 'utf8');
    if (lcp.changed) lcpUpdated += 1;
    if (css.changed) updated += 1;
  }

  return { href, updated, lcpUpdated };
}

export { relative };
