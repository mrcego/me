import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_ID, THEME_PRESETS, getThemePreset } from '../../app/utils/themePresets';
import { buildThemeInitScript } from '../../app/utils/themeInitScript';

describe('themePresets', () => {
  it('has a unique id for every preset', () => {
    const ids = THEME_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves the default preset and falls back for unknown ids', () => {
    expect(getThemePreset(DEFAULT_THEME_ID).id).toBe(DEFAULT_THEME_ID);
    expect(getThemePreset('not-a-real-theme').id).toBe(DEFAULT_THEME_ID);
    expect(getThemePreset(null).id).toBe(DEFAULT_THEME_ID);
  });

  it('embeds every preset id in the blocking theme-init script', () => {
    const script = buildThemeInitScript();
    for (const preset of THEME_PRESETS) {
      expect(script).toContain(`"${preset.id}"`);
    }
    expect(script).toContain('localStorage');
  });

  it('applies local font stacks before webfont activation in theme-init', () => {
    const script = buildThemeInitScript();
    expect(script).toContain('Fira Code Fallback: Consolas');
    expect(script).toContain('requestIdleCallback');
    expect(script).toContain("dataset.webfonts='1'");
    // First --font-main write must use the local map (lf), not the webfont map (f).
    expect(script).toMatch(/setProperty\('--font-main',lf\[t\.f\]\)/);
    expect(script).toMatch(/setProperty\('--font-main',f\[t\.f\]\)/);
  });
});
