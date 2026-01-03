import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';

export interface ThemePreset {
  id: string;
  name: string;
  background: string;
  surface: string;
  primary: string;
  font: 'Sans' | 'Fira Code';
  isDark: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'dark-modern', name: 'Dark Modern', background: '#1f1f1f', surface: '#181818', primary: '#007acc', font: 'Sans', isDark: true },
  { id: 'dark-plus', name: 'Dark+', background: '#1e1e1e', surface: '#252526', primary: '#0e639c', font: 'Fira Code', isDark: true },
  { id: 'tokyo-night', name: 'Tokyo Night', background: '#1a1b26', surface: '#16161e', primary: '#7aa2f7', font: 'Fira Code', isDark: true },
  { id: 'dracula', name: 'Dracula', background: '#282a36', surface: '#1e1f29', primary: '#bd93f9', font: 'Fira Code', isDark: true },
  { id: 'one-dark', name: 'One Dark', background: '#282c34', surface: '#21252b', primary: '#61afef', font: 'Fira Code', isDark: true },
  { id: 'nord', name: 'Nord', background: '#2e3440', surface: '#3b4252', primary: '#88c0d0', font: 'Fira Code', isDark: true },
  { id: 'catppuccin', name: 'Catppuccin', background: '#1e1e2e', surface: '#181825', primary: '#89b4fa', font: 'Fira Code', isDark: true },
  { id: 'rose-pine', name: 'Rose Pine', background: '#191724', surface: '#1f1d2e', primary: '#ebbcba', font: 'Fira Code', isDark: true },
  { id: 'github-dark', name: 'GitHub Dark', background: '#0d1117', surface: '#161b22', primary: '#58a6ff', font: 'Fira Code', isDark: true },
  { id: 'monokai', name: 'Monokai', background: '#272822', surface: '#1e1f1c', primary: '#f92672', font: 'Fira Code', isDark: true },
  { id: 'cobalt2', name: 'Cobalt2', background: '#193549', surface: '#152c3e', primary: '#ffc600', font: 'Fira Code', isDark: true },
  { id: 'light-modern', name: 'Light Modern', background: '#ffffff', surface: '#f3f3f3', primary: '#005fb8', font: 'Sans', isDark: false },
];

// Shared state with VueUse localStorage persistence
const currentThemeId = useStorage('theme-preset-id', 'github-dark');

export const useTheme = () => {
  const currentTheme = computed(() =>
    THEME_PRESETS.find(p => p.id === currentThemeId.value) || THEME_PRESETS[0]
  );

  const getContrastColor = (hex: string) => {
    if (!hex || hex.length < 7) return '#ffffff';
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  };

  const syncCSSVariables = () => {
    if (!import.meta.client) return;
    const root = document.documentElement;
    const theme = currentTheme.value;
    if (!theme) return;
    const dark = theme.isDark;

    // Primary Palette
    const pPalette = palette(theme.primary) as any;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-hover', (dark ? pPalette[400] : pPalette[600]) || theme.primary);
    root.style.setProperty('--primary-contrast', getContrastColor(theme.primary));

    // Surface Palette
    const sPalette = palette(theme.surface) as any;

    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', dark ? '#ffffff' : '#0f172a');
    root.style.setProperty('--muted', dark ? '#94a3b8' : '#64748b');
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--secondary', (dark ? sPalette[800] : sPalette[100]) || '#080c14');
    root.style.setProperty('--border', dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--glass-bg', dark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)');

    // Font Family
    const fontStack = theme.font === 'Fira Code'
      ? '"Fira Code", "Outfit", "Inter", sans-serif'
      : '"Outfit", "Inter", sans-serif';
    root.style.setProperty('--font-main', fontStack);
  };

  const applyTheme = (theme: ThemePreset) => {
    if (import.meta.client) {
      if (!theme) return;
      const root = document.documentElement;
      if (theme.isDark) {
        root.classList.add('app-dark', 'dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('app-dark', 'dark');
        root.classList.add('light');
      }

      // Update PrimeVue Palettes
      updatePrimaryPalette(palette(theme.primary) as any);
      updateSurfacePalette(palette(theme.surface) as any);

      syncCSSVariables();
    }
  };

  // Inicializar
  if (import.meta.client) {
    const theme = currentTheme.value;
    if (theme) applyTheme(theme);
  }

  const setThemePreset = (id: string) => {
    const theme = THEME_PRESETS.find(p => p.id === id);
    if (theme) {
      currentThemeId.value = id;
      applyTheme(theme);
    }
  };

  // Keep toggleTheme for quick switch between current and light/dark equivalents? 
  // No, user said "without allowed user to change dark/light manually" or "standardize better".
  // Let's just allow picking from the list.
  const toggleTheme = () => {
    const theme = currentTheme.value;
    if (!theme) return;
    const isNowDark = theme.isDark;
    const nextTheme = THEME_PRESETS.find(p => p.isDark !== isNowDark);
    if (nextTheme) setThemePreset(nextTheme.id);
  };

  return {
    currentThemeId,
    currentTheme,
    THEME_PRESETS,
    setThemePreset,
    toggleTheme
  };
};
