import { describe, expect, it } from 'vitest';
import {
  buildCspDirectives,
  buildCspHeaderValue,
  buildNetlifyHeadersFile,
  buildSecurityHeaders,
  parseCspFromHeadersFile,
  parseHeaderFromHeadersFile,
} from '../../scripts/lib/csp.mjs';

describe('CSP builders', () => {
  it('allows Nuxt inline scripts without Trusted Types enforcement', () => {
    const directives = buildCspDirectives();
    expect(directives).toContain("script-src 'self' 'unsafe-inline'");
    expect(directives.some((d) => d.includes('require-trusted-types-for'))).toBe(false);
    expect(directives.some((d) => /script-src.*'sha256-/.test(d))).toBe(false);
  });

  it('locks connect-src to self so Iconify CDN cannot be fetched', () => {
    expect(buildCspDirectives()).toContain("connect-src 'self'");
  });

  it('writes a Netlify _headers file that parses back to the same CSP', () => {
    const csp = buildCspHeaderValue();
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
});
