import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUNDLED_ICONS } from '~/config/icons.config';

describe('nuxt icon config', () => {
  it('disables Iconify API so CSP connect-src self cannot break icons', () => {
    const config = readFileSync(join(process.cwd(), 'nuxt.config.ts'), 'utf8');
    expect(config).toMatch(/mode:\s*'css'/);
    expect(config).toMatch(/provider:\s*'none'/);
    expect(config).toMatch(/fallbackToApi:\s*false/);
    expect(config).toMatch(/clientBundle:\s*\{/);
    expect(config).toMatch(/scan:\s*true/);
    expect(config).not.toMatch(/scan:\s*false/);
    expect(config).toMatch(/icons:\s*\[\.\.\.BUNDLED_ICONS\]/);
  });

  it('exports a valid, non-empty, deduplicated list of bundled icons with valid collections', () => {
    expect(BUNDLED_ICONS.length).toBeGreaterThan(30);

    const allowedPrefixes = ['solar:', 'logos:', 'lucide:', 'simple-icons:'];
    const uniqueIcons = new Set(BUNDLED_ICONS);

    expect(uniqueIcons.size).toBe(BUNDLED_ICONS.length);

    for (const icon of BUNDLED_ICONS) {
      expect(typeof icon).toBe('string');
      expect(allowedPrefixes.some((prefix) => icon.startsWith(prefix))).toBe(true);
      expect(icon).toMatch(/^[a-z0-9-]+:[a-z0-9-]+$/);
    }
  });
});
