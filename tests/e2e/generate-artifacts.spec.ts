import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { parseCspFromHeadersFile } from '../../scripts/lib/csp.mjs';

test.describe('generate artifacts', () => {
  test('ships _headers CSP and prerendered home HTML', () => {
    const publicDir = join(process.cwd(), process.env.NUXT_OUTPUT_DIR || '.output', 'public');
    const headersPath = join(publicDir, '_headers');
    const indexPath = join(publicDir, 'index.html');

    expect(existsSync(headersPath), '_headers missing — run generate').toBe(true);
    expect(existsSync(indexPath), 'index.html missing — run generate').toBe(true);

    const headersText = readFileSync(headersPath, 'utf8');
    const csp = parseCspFromHeadersFile(headersText);
    expect(csp).toBeTruthy();
    expect(csp).toMatch(/script-src 'self' 'sha256-/);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    // TT enforcement breaks non-Vue innerHTML sinks on this stack — keep off in prod CSP.
    expect(csp).not.toContain('require-trusted-types-for');
    expect(csp).toContain("connect-src 'self'");
    // Artifact-only deploy: these must live in _headers, not only netlify.toml.
    expect(headersText).toMatch(/Strict-Transport-Security:.*includeSubDomains.*preload/);
    expect(headersText).toMatch(/Cross-Origin-Opener-Policy:\s*same-origin/);
    // Cache policies must ship in the artifact (toml [[headers]] are ignored on --no-build).
    expect(headersText).toMatch(/\/_nuxt\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(headersText).toMatch(/\/_fonts\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(headersText).toMatch(/\/_i18n\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(headersText).toMatch(/Cache-Control:\s*no-cache,\s*no-store,\s*must-revalidate/);

    const html = readFileSync(indexPath, 'utf8');
    expect(html).toMatch(/rel="preload"[^>]*as="style"/);
    // LCP image preload must be discoverable before theme-init / inlined CSS.
    const headOpen = html.search(/<head[^>]*>/i);
    const lcpPreload = html.search(
      /rel="preload"[^>]*as="image"[^>]*me\.jpg|as="image"[^>]*rel="preload"[^>]*me\.jpg/i,
    );
    const themeInit = html.indexOf('theme-init');
    expect(lcpPreload).toBeGreaterThan(headOpen);
    expect(lcpPreload).toBeLessThan(themeInit);
    expect(html).toMatch(/s_392x490\/img\/me\.jpg/);
    // Webfonts must stay off the discovery/preload critical path (LCP is the hero image).
    expect(html).not.toMatch(/rel="preload"[^>]*as="font"/);
    expect(html).toMatch(/font-display:optional/);
    expect(html).not.toContain('font-display:swap');
    // First-paint --app-font uses local monospace fallbacks only (no "Fira Code" webfont head).
    // Minified CSS may use double quotes and drop spaces after `:`.
    expect(html).toMatch(/--app-font:\s*ui-monospace,\s*monospace/);
    expect(html).not.toMatch(/--app-font:\s*["']Fira Code["']/);
    expect(html).not.toContain('Fira Code Fallback:');
    expect(html).toContain('requestIdleCallback');
    expect(html).toContain('dataset.webfonts');
  });

  test('prerenders sitemap XML for crawl discovery', () => {
    const publicDir = join(process.cwd(), process.env.NUXT_OUTPUT_DIR || '.output', 'public');
    test.skip(
      !existsSync(publicDir),
      '.output/public missing — run pnpm generate / generate:netlify first',
    );

    const candidates = [
      'sitemap_index.xml',
      'sitemap.xml',
      '__sitemap__/en-US.xml',
      '__sitemap__/es-ES.xml',
      '__sitemap__/sitemap_index.xml',
      '__sitemap__/urls_sitemap.xml',
    ];
    const found = candidates.filter((rel) => existsSync(join(publicDir, rel)));
    const sitemapDir = join(publicDir, '__sitemap__');
    const hasDir = existsSync(sitemapDir);

    expect(
      found.length > 0 || hasDir,
      'sitemap artifact missing — check @nuxtjs/sitemap zeroRuntime prerender',
    ).toBe(true);

    // Prefer the production entrypoint when present.
    const indexPath = join(publicDir, 'sitemap_index.xml');
    if (existsSync(indexPath)) {
      const xml = readFileSync(indexPath, 'utf8');
      expect(xml).toMatch(/<sitemapindex|<urlset/i);
      expect(xml).not.toMatch(/\/\.netlify\/(functions|builders)\//);
    }

    // Redirects in the publish tree must not proxy sitemap to missing Nitro fns.
    const redirectsPath = join(publicDir, '_redirects');
    if (existsSync(redirectsPath)) {
      const redirects = readFileSync(redirectsPath, 'utf8');
      expect(redirects).not.toMatch(/sitemap_index\.xml\s+\/\.netlify\//);
    }
  });
});
