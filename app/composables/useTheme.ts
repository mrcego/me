import { ref } from 'vue';
import { updatePrimaryPalette, updateSurfacePalette, palette } from '@primeuix/themes';

export const useTheme = () => {
  const isDark = ref(false);
  
  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      const root = document.documentElement;
      const body = document.body;
      if (dark) {
        root.classList.add('app-dark');
        body.classList.add('app-dark');
      } else {
        root.classList.remove('app-dark');
        body.classList.remove('app-dark');
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

  // Cambiar color primario
  const changePrimaryColor = (color: string) => {
    const colors = palette(color);
    if (colors && typeof colors === 'object') {
      updatePrimaryPalette(colors);
      if (import.meta.client) {
        localStorage.setItem('primary-color', color);
      }
    }
  };

  // Cambiar color de superficie
  const changeSurfaceColor = (color: string) => {
    const colors = palette(color);
    if (colors && typeof colors === 'object') {
      updateSurfacePalette(colors);
      if (import.meta.client) {
        localStorage.setItem('surface-color', color);
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
    toggleTheme,
    changePrimaryColor,
    changeSurfaceColor
  };
};
