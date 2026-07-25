/**
 * Helpers for injecting an early CSS preload into generated HTML.
 * Used by scripts/inject-entry-css-link.mjs and unit tests.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

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
  const marker = `href="${href}"`;
  if (html.includes(marker)) return { html, changed: false };

  const linkTag = `<link rel="preload" as="style" href="${href}" crossorigin>`;
  if (!/<head[^>]*>/i.test(html)) return { html, changed: false };

  return {
    html: html.replace(/<head[^>]*>/i, (open) => `${open}${linkTag}`),
    changed: true,
  };
}

/**
 * @param {string} publicDir
 * @returns {{ href: string, updated: number }}
 */
export function injectEntryCssLinkIntoPublicDir(publicDir) {
  const nuxtDir = join(publicDir, '_nuxt');
  const cssFile = findBundledStylesheet(nuxtDir);
  if (!cssFile) {
    throw new Error(`[css-link] No style.*.css / entry.*.css found in ${nuxtDir}`);
  }

  const href = `/_nuxt/${cssFile}`;
  let updated = 0;

  for (const file of walkHtmlFiles(publicDir)) {
    const before = readFileSync(file, 'utf8');
    const { html, changed } = injectStylesheetPreload(before, href);
    if (!changed) continue;
    writeFileSync(file, html, 'utf8');
    updated += 1;
  }

  return { href, updated };
}

export { relative };
