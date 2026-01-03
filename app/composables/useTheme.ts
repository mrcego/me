import { ref } from 'vue';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';

// Shared state
const isDark = ref(false);
const primaryColor = ref('#ff4b5c');
const surfaceColor = ref('#0f172a');

export const useTheme = () => {
  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      const root = document.documentElement;
      const body = document.body;
      if (dark) {
        root.classList.add('app-dark', 'dark');
        body.classList.add('app-dark', 'dark');
      } else {
        root.classList.remove('app-dark', 'dark');
        body.classList.remove('app-dark', 'dark');
      }
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

  // Cambiar color primario
  const changePrimaryColor = (color: string) => {
    const hexColor = ensureHex(color);
    primaryColor.value = hexColor;
    const colors = palette(hexColor);
    if (colors && typeof colors === 'object') {
      updatePrimaryPalette(colors);
      if (import.meta.client) {
        localStorage.setItem('primary-color', hexColor);
        document.documentElement.style.setProperty('--color-primary', hexColor);
        // Also update hover or other variations if needed
        document.documentElement.style.setProperty('--color-primary-hover', hexColor);
      }
    }
  };

  // Cambiar color de superficie
  const changeSurfaceColor = (color: string) => {
    const hexColor = ensureHex(color);
    surfaceColor.value = hexColor;
    const colors = palette(hexColor);
    if (colors && typeof colors === 'object') {
      updateSurfacePalette(colors);
      if (import.meta.client) {
        localStorage.setItem('surface-color', hexColor);
        document.documentElement.style.setProperty('--color-surface', hexColor);
        document.documentElement.style.setProperty('--color-background', hexColor);
      }
    }
  };

  // Restaurar colores guardados
  if (import.meta.client) {
    const savedPrimary = localStorage.getItem('primary-color');
    const savedSurface = localStorage.getItem('surface-color');

    if (savedPrimary) {
      changePrimaryColor(savedPrimary);
    }
    if (savedSurface) {
      changeSurfaceColor(savedSurface);
    }
  }

  return {
    isDark,
    primaryColor,
    surfaceColor,
    toggleTheme,
    changePrimaryColor,
    changeSurfaceColor
  };
};
