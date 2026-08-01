import { describe, expect, it } from 'vitest';
import {
  buildCspDirectives,
  buildCspHeaderValue,
  buildNetlifyHeadersFile,
  buildSecurityHeaders,
  extractExecutableInlineScripts,
  hashInlineScript,
  parseCspFromHeadersFile,
  parseHeaderFromHeadersFile,
} from '../../scripts/lib/csp.mjs';

describe('CSP builders', () => {
  it('falls back to unsafe-inline when no script hashes are provided', () => {
    const directives = buildCspDirectives();
    expect(directives).toContain("script-src 'self' 'unsafe-inline'");
    expect(directives.some((d) => d.includes('require-trusted-types-for'))).toBe(false);
  });

  it('uses sha256 hashes and Trusted Types when enabled for generate output', () => {
    const hash = hashInlineScript('window.__NUXT__={}');
    const directives = buildCspDirectives({
      scriptHashes: [hash],
      enableTrustedTypes: true,
    });
    const scriptSrc = directives.find((d) => d.startsWith('script-src'));
    expect(scriptSrc).toContain(hash);
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(directives).toContain("require-trusted-types-for 'script'");
    expect(directives).toContain('trusted-types vue default');
  });

  it('hashes executable inline scripts and import maps (skips JSON / src)', () => {
    const html = `
      <script src="/a.js"></script>
      <script type="application/json">{"x":1}</script>
      <script type="importmap">{"imports":{"#entry":"/_nuxt/x.js"}}</script>
      <script>window.__NUXT__={}</script>
    `;
    const bodies = extractExecutableInlineScripts(html);
    expect(bodies).toEqual(['{"imports":{"#entry":"/_nuxt/x.js"}}', 'window.__NUXT__={}']);
    expect(hashInlineScript(bodies[0]!)).toMatch(/^'sha256-[A-Za-z0-9+/=]+'$/);
  });

  it('locks connect-src to self so Iconify CDN cannot be fetched', () => {
    expect(buildCspDirectives()).toContain("connect-src 'self'");
  });

  it('writes a Netlify _headers file that parses back to the same CSP', () => {
    const csp = buildCspHeaderValue({
      scriptHashes: [hashInlineScript('console.log(1)')],
      enableTrustedTypes: true,
    });
    const file = buildNetlifyHeadersFile(csp);
    expect(parseCspFromHeadersFile(file)).toBe(csp);
    expect(file).toContain('/*');
    expect(file).toContain('Content-Security-Policy:');
  });

  it('ships HSTS preload + COOP in _headers (artifact deploy ignores netlify.toml headers)', () => {
    const security = buildSecurityHeaders();
    expect(security['Strict-Transport-Security']).toContain('includeSubDomains');
    expect(security['Strict-Transport-Security']).toContain('preload');
    expect(security['Cross-Origin-Opener-Policy']).toBe('same-origin');

    const file = buildNetlifyHeadersFile();
    expect(parseHeaderFromHeadersFile(file, 'Strict-Transport-Security')).toBe(
      security['Strict-Transport-Security'],
    );
    expect(parseHeaderFromHeadersFile(file, 'Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(parseHeaderFromHeadersFile(file, 'X-Frame-Options')).toBe('DENY');
  });

  it('returns null when _headers has no CSP line (bad path)', () => {
    expect(parseCspFromHeadersFile('# empty\n')).toBeNull();
  });

  it('embeds immutable + HTML cache policies for artifact deploys', () => {
    const file = buildNetlifyHeadersFile();
    expect(file).toContain('/_nuxt/*');
    expect(file).toContain('/_fonts/*');
    expect(file).toContain('/_i18n/*');
    expect(file).toContain('/_ipx/*');
    expect(file).toContain('/img/*');
    expect(file).toContain('/*.html');
    expect(file).toMatch(/\/_nuxt\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(file).toMatch(/\/_fonts\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(file).toMatch(/\/_i18n\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(file).toMatch(/\/_ipx\/\*[\s\S]*max-age=31536000,\s*immutable/);
    expect(file).toMatch(/\/img\/\*[\s\S]*max-age=2592000,\s*stale-while-revalidate=604800/);
    expect(file).toMatch(/\/\n\s*Cache-Control:\s*no-cache/);
    expect(file).toMatch(/\/index\.html[\s\S]*no-cache/);
    expect(file).toMatch(/\/200\.html[\s\S]*no-cache/);
    expect(file).toMatch(/\/favicon\.ico[\s\S]*max-age=86400/);
    expect(file).toMatch(/\/manifest\.json[\s\S]*stale-while-revalidate=604800/);
  });
});
