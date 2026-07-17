import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';
import {
  DEFAULT_THEME_ID,
  FONT_STACKS,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  getThemePreset,
  type ThemePreset,
} from '~/utils/themePresets';

// Shared state with VueUse localStorage persistence
const currentThemeId = useStorage(THEME_STORAGE_KEY, DEFAULT_THEME_ID);

export const useTheme = () => {
  const currentTheme = computed(() => getThemePreset(currentThemeId.value));

  const getContrastColor = (hex: string) => {
    if (!hex || hex.length < 7) return '#ffffff';
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  type ColorPalette = Record<string, string>;

  const syncCSSVariables = (theme: ThemePreset) => {
    if (!import.meta.client) return;
    const root = document.documentElement;
    const dark = theme.isDark;

    // Primary Palette
    const pPalette = palette(theme.primary) as ColorPalette;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty(
      '--primary-hover',
      (dark ? pPalette[400] : pPalette[600]) || theme.primary,
    );
    root.style.setProperty('--primary-contrast', getContrastColor(theme.primary));
    if (/^#[0-9a-fA-F]{6}$/.test(theme.primary)) {
      const r = parseInt(theme.primary.slice(1, 3), 16);
      const g = parseInt(theme.primary.slice(3, 5), 16);
      const b = parseInt(theme.primary.slice(5, 7), 16);
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }

    // Surface Palette
    const sPalette = palette(theme.surface) as ColorPalette;

    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', dark ? '#ffffff' : '#0f172a');
    root.style.setProperty('--muted', dark ? '#94a3b8' : '#64748b');
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--secondary', (dark ? sPalette[800] : sPalette[100]) || '#080c14');
    root.style.setProperty('--border', dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty(
      '--glass-bg',
      dark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    );

    // Font Family — data attribute drives weight clamp for mono fonts
    root.style.setProperty('--font-main', FONT_STACKS[theme.font]);
    root.dataset.themeFont = theme.font === 'Fira Code' ? 'fira-code' : 'sans';
  };

  const applyTheme = (theme: ThemePreset) => {
    if (!import.meta.client || !theme) return;
    const root = document.documentElement;
    if (theme.isDark) {
      root.classList.add('app-dark', 'dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('app-dark', 'dark');
      root.classList.add('light');
    }

    updatePrimaryPalette(palette(theme.primary) as ColorPalette);
    updateSurfacePalette(palette(theme.surface) as ColorPalette);
    syncCSSVariables(theme);
  };

  // Inicializar
  if (import.meta.client) {
    const theme = currentTheme.value;
    if (theme) applyTheme(theme);
  }

  /** Persist + apply (click / Enter). */
  const setThemePreset = (id: string) => {
    const theme = THEME_PRESETS.find((p) => p.id === id);
    if (theme) {
      currentThemeId.value = id;
      applyTheme(theme);
    }
  };

  /** Live preview without persisting (keyboard arrow navigation). */
  const previewTheme = (id: string) => {
    const theme = THEME_PRESETS.find((p) => p.id === id);
    if (theme) applyTheme(theme);
  };

  /** Restore the persisted selection (Escape / cancel preview). */
  const cancelThemePreview = () => {
    const theme = currentTheme.value;
    if (theme) applyTheme(theme);
  };

  const toggleTheme = () => {
    const theme = currentTheme.value;
    if (!theme) return;
    const isNowDark = theme.isDark;
    const nextTheme = THEME_PRESETS.find((p) => p.isDark !== isNowDark);
    if (nextTheme) setThemePreset(nextTheme.id);
  };

  return {
    currentThemeId,
    currentTheme,
    THEME_PRESETS,
    setThemePreset,
    previewTheme,
    cancelThemePreview,
    toggleTheme,
  };
};
