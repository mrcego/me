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

    const csp = parseCspFromHeadersFile(readFileSync(headersPath, 'utf8'));
    expect(csp).toBeTruthy();
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("connect-src 'self'");

    const html = readFileSync(indexPath, 'utf8');
    expect(html).toMatch(/rel="preload"[^>]*as="style"/);
  });
});
