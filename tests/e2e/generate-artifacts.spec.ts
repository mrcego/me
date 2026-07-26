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
    expect(html).toMatch(/s_448x560\/img\/me\.jpg/);
    // Webfonts must stay off the discovery/preload critical path (LCP is the hero image).
    expect(html).not.toMatch(/rel="preload"[^>]*as="font"/);
    expect(html).toMatch(/font-display:optional/);
    expect(html).not.toContain('font-display:swap');
    // First-paint --font-main uses metric-adjusted locals only (no "Fira Code",… webfont head).
    // Minified CSS may use double quotes and drop spaces after `:`.
    expect(html).toMatch(/--font-main:\s*["']Fira Code Fallback: Consolas["']/);
    expect(html).not.toMatch(/--font-main:\s*["']Fira Code["']/);
    expect(html).toContain('requestIdleCallback');
    expect(html).toContain('dataset.webfonts');
  });
});
