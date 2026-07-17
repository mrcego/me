import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';

/** Display font stacks. Fira Code max Google weight is 700 — see CSS clamp in main.css. */
export type ThemeFont = 'Sans' | 'Fira Code';

export interface ThemePreset {
  id: string;
  name: string;
  background: string;
  surface: string;
  primary: string;
  font: ThemeFont;
  isDark: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dark-modern',
    name: 'Dark Modern',
    background: '#1f1f1f',
    surface: '#181818',
    primary: '#007acc',
    font: 'Sans',
    isDark: true,
  },
  {
    id: 'dark-plus',
    name: 'Dark+',
    background: '#1e1e1e',
    surface: '#252526',
    primary: '#0e639c',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    background: '#1a1b26',
    surface: '#16161e',
    primary: '#7aa2f7',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: '#282a36',
    surface: '#1e1f29',
    primary: '#bd93f9',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    background: '#282c34',
    surface: '#21252b',
    primary: '#61afef',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'nord',
    name: 'Nord',
    background: '#2e3440',
    surface: '#3b4252',
    primary: '#88c0d0',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    background: '#1e1e2e',
    surface: '#181825',
    primary: '#89b4fa',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'rose-pine',
    name: 'Rose Pine',
    background: '#191724',
    surface: '#1f1d2e',
    primary: '#ebbcba',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    background: '#0d1117',
    surface: '#161b22',
    primary: '#58a6ff',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'monokai',
    name: 'Monokai',
    background: '#272822',
    surface: '#1e1f1c',
    primary: '#f92672',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'cobalt2',
    name: 'Cobalt2',
    background: '#193549',
    surface: '#152c3e',
    primary: '#ffc600',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'light-modern',
    name: 'Light Modern',
    background: '#ffffff',
    surface: '#f3f3f3',
    primary: '#005fb8',
    font: 'Sans',
    isDark: false,
  },
  // --- +10 ---
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    background: '#002b36',
    surface: '#073642',
    primary: '#268bd2',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    background: '#fdf6e3',
    surface: '#eee8d5',
    primary: '#268bd2',
    font: 'Sans',
    isDark: false,
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    background: '#282828',
    surface: '#3c3836',
    primary: '#fe8019',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'ayu-mirage',
    name: 'Ayu Mirage',
    background: '#1f2430',
    surface: '#242936',
    primary: '#ffcc66',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    background: '#011627',
    surface: '#0b2942',
    primary: '#82aaff',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    background: '#2b213a',
    surface: '#241b2f',
    primary: '#ff7edb',
    font: 'Sans',
    isDark: true,
  },
  {
    id: 'material-ocean',
    name: 'Material Ocean',
    background: '#0f111a',
    surface: '#1a1c25',
    primary: '#84ffff',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    background: '#23262e',
    surface: '#2b2f3a',
    primary: '#00e8c6',
    font: 'Fira Code',
    isDark: true,
  },
  {
    id: 'vercel-dark',
    name: 'Vercel Dark',
    background: '#000000',
    surface: '#111111',
    primary: '#0070f3',
    font: 'Sans',
    isDark: true,
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    background: '#ffffff',
    surface: '#f6f8fa',
    primary: '#0969da',
    font: 'Sans',
    isDark: false,
  },
];

const FONT_STACKS: Record<ThemeFont, string> = {
  Sans: '"Outfit", ui-sans-serif, system-ui, sans-serif',
  // Outfit stays in the stack so missing Fira Code weights (800/900) soft-fallback cleanly
  'Fira Code': '"Fira Code", "Outfit", ui-sans-serif, system-ui, sans-serif',
};

// Shared state with VueUse localStorage persistence
const currentThemeId = useStorage('theme-preset-id', 'github-dark');

export const useTheme = () => {
  const currentTheme = computed(
    () => THEME_PRESETS.find((p) => p.id === currentThemeId.value) || THEME_PRESETS[0],
  );

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
