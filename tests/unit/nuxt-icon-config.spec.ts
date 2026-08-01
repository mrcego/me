import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('nuxt icon config', () => {
  it('disables Iconify API so CSP connect-src self cannot break icons', () => {
    const config = readFileSync(join(process.cwd(), 'nuxt.config.ts'), 'utf8');
    expect(config).toMatch(/mode:\s*'css'/);
    expect(config).toMatch(/provider:\s*'none'/);
    expect(config).toMatch(/fallbackToApi:\s*false/);
    expect(config).toMatch(/clientBundle:\s*\{/);
    expect(config).toMatch(/scan:\s*false/);
    expect(config).toMatch(/icons:\s*\[\s*\]/);
    expect(config).not.toMatch(/scan:\s*true/);
  });
});
