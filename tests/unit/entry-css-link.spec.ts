import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';
import {
  findBundledStylesheet,
  injectEntryCssLinkIntoPublicDir,
  injectStylesheetPreload,
  isBundledStylesheetName,
} from '../../scripts/lib/entry-css-link.mjs';
import {
  buildHeroLcpPreloadTag,
  injectHeroLcpImagePreload,
} from '../../scripts/lib/lcp-image-preload.mjs';

describe('entry CSS preload helpers', () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it('recognizes Vite-hashed style/entry CSS names', () => {
    expect(isBundledStylesheetName('style.BZ5XyGp0.css')).toBe(true);
    expect(isBundledStylesheetName('entry.abc123.css')).toBe(true);
    expect(isBundledStylesheetName('About.abc.css')).toBe(false);
  });

  it('injects preload once and is idempotent (happy path)', () => {
    const href = '/_nuxt/style.test.css';
    const first = injectStylesheetPreload('<html><head><title>x</title></head></html>', href);
    expect(first.changed).toBe(true);
    expect(first.html).toContain(`rel="preload" as="style" href="${href}"`);

    const second = injectStylesheetPreload(first.html, href);
    expect(second.changed).toBe(false);
    expect(second.html.match(/rel="preload" as="style"/g)?.length).toBe(1);
  });

  it('places LCP image preload before CSS preload right after <head>', () => {
    const href = '/_nuxt/style.test.css';
    const late =
      '<html><head><style>.x{}</style>' +
      '<link rel="preload" as="image" type="image/webp" href="/_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg" fetchpriority="high">' +
      '</head></html>';
    const lcp = injectHeroLcpImagePreload(late);
    const css = injectStylesheetPreload(lcp.html, href);
    const headInner = css.html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const imageIdx = headInner.indexOf('as="image"');
    const styleIdx = headInner.indexOf('as="style"');
    const styleBlockIdx = headInner.indexOf('<style');
    expect(imageIdx).toBeGreaterThanOrEqual(0);
    expect(styleIdx).toBeGreaterThan(imageIdx);
    expect(imageIdx).toBeLessThan(styleBlockIdx);
    expect(headInner).toContain(buildHeroLcpPreloadTag());
    expect(headInner.match(/as="image"/g)?.length).toBe(1);
  });

  it('does not invent a head when missing (bad path)', () => {
    const result = injectStylesheetPreload('<html><body></body></html>', '/_nuxt/style.x.css');
    expect(result.changed).toBe(false);
  });

  it('finds style.*.css over entry.*.css and writes all HTML files', () => {
    const root = mkdtempSync(join(tmpdir(), 'css-link-'));
    dirs.push(root);
    const publicDir = join(root, 'public');
    const nuxtDir = join(publicDir, '_nuxt');
    mkdirSync(nuxtDir, { recursive: true });
    mkdirSync(join(publicDir, 'es'), { recursive: true });
    writeFileSync(join(nuxtDir, 'entry.old.css'), '/* entry */');
    writeFileSync(join(nuxtDir, 'style.abc123.css'), '/* style */');
    writeFileSync(join(publicDir, 'index.html'), '<html><head></head><body></body></html>');
    writeFileSync(join(publicDir, 'es', 'index.html'), '<html><head></head><body></body></html>');

    expect(findBundledStylesheet(nuxtDir)).toBe('style.abc123.css');

    const { href, updated, lcpUpdated } = injectEntryCssLinkIntoPublicDir(publicDir);
    expect(href).toBe('/_nuxt/style.abc123.css');
    expect(updated).toBe(2);
    expect(lcpUpdated).toBe(2);
    const indexHtml = readFileSync(join(publicDir, 'index.html'), 'utf8');
    expect(indexHtml).toContain(href);
    expect(indexHtml).toContain('me.jpg');
    expect(indexHtml.indexOf('as="image"')).toBeLessThan(indexHtml.indexOf('as="style"'));
    expect(readFileSync(join(publicDir, 'es', 'index.html'), 'utf8')).toContain(href);

    const again = injectEntryCssLinkIntoPublicDir(publicDir);
    expect(again.updated).toBe(0);
    expect(again.lcpUpdated).toBe(0);
  });

  it('throws when no bundled CSS exists (bad path)', () => {
    const root = mkdtempSync(join(tmpdir(), 'css-link-empty-'));
    dirs.push(root);
    const publicDir = join(root, 'public');
    mkdirSync(join(publicDir, '_nuxt'), { recursive: true });
    expect(() => injectEntryCssLinkIntoPublicDir(publicDir)).toThrow(/No style/);
  });
});
