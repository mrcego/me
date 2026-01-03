import { ref } from 'vue';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';

// Shared state
const isDark = ref(false);
const primaryColor = ref('#ff4b5c');
const surfaceColor = ref('#0f172a');

export const useTheme = () => {
  const syncCSSVariables = () => {
    if (!import.meta.client) return;
    const root = document.documentElement;
    const dark = isDark.value;

    // Primary Palette
    const pPalette = palette(primaryColor.value);
    root.style.setProperty('--primary', primaryColor.value);
    root.style.setProperty('--primary-hover', (dark ? pPalette[400] : pPalette[600]) || primaryColor.value);

    // Surface Palette logic based on isDark
    const sPalette = palette(surfaceColor.value);

    if (dark) {
      root.style.setProperty('--background', sPalette[950] || '#030612');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--muted', '#94a3b8');
      root.style.setProperty('--surface', sPalette[900] || '#0f172a');
      root.style.setProperty('--secondary', sPalette[800] || '#080c14');
      root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.03)');
    } else {
      root.style.setProperty('--background', sPalette[50] || '#ffffff');
      root.style.setProperty('--foreground', '#0f172a');
      root.style.setProperty('--muted', '#64748b');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--secondary', sPalette[100] || '#f1f5f9');
      root.style.setProperty('--border', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.03)');
    }
  };

  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      const root = document.documentElement;
      if (dark) {
        root.classList.add('app-dark', 'dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('app-dark', 'dark');
        root.classList.add('light');
      }
      syncCSSVariables();
    }
  };

  // Inicializar desde localStorage o sistema
  if (import.meta.client) {
    const stored = localStorage.getItem('theme-mode');
    if (stored) {
      isDark.value = stored === 'dark';
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const savedPrimary = localStorage.getItem('primary-color');
    const savedSurface = localStorage.getItem('surface-color');
    if (savedPrimary) primaryColor.value = savedPrimary;
    if (savedSurface) surfaceColor.value = savedSurface;

    applyTheme(isDark.value);
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme(isDark.value);
    if (import.meta.client) {
      localStorage.setItem('theme-mode', isDark.value ? 'dark' : 'light');
    }
  };

  const ensureHex = (color: string) => color.startsWith('#') ? color : `#${color}`;

  const changePrimaryColor = (color: string) => {
    const hexColor = ensureHex(color);
    primaryColor.value = hexColor;
    const colors = palette(hexColor);
    if (colors && typeof colors === 'object') {
      updatePrimaryPalette(colors);
      if (import.meta.client) {
        localStorage.setItem('primary-color', hexColor);
        syncCSSVariables();
      }
    }
  };

  const changeSurfaceColor = (color: string) => {
    const hexColor = ensureHex(color);
    surfaceColor.value = hexColor;
    const colors = palette(hexColor);
    if (colors && typeof colors === 'object') {
      updateSurfacePalette(colors);
      if (import.meta.client) {
        localStorage.setItem('surface-color', hexColor);
        syncCSSVariables();
      }
    }
  };

  return {
    isDark,
    primaryColor,
    surfaceColor,
    toggleTheme,
    changePrimaryColor,
    changeSurfaceColor
  };
};
