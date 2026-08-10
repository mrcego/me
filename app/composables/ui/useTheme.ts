import { computed, ref, watch } from 'vue';
import {
  DEFAULT_THEME_ID,
  FONT_STACKS,
  FONT_STACKS_LOCAL,
  MUTED_DARK,
  MUTED_LIGHT,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  getThemePreset,
  type ThemePreset,
} from '~/utils/themePresets';

/** Persist theme id without `@vueuse/core` (keeps entry free of the VueUse barrel). */
const currentThemeId = ref(DEFAULT_THEME_ID);

/** True once webfonts may name "Fira Code" / "Outfit" (after LCP or user theme pick). */
let webfontsActivated = false;
let webfontsScheduleStarted = false;

const scheduleWebfontsActivation = (apply: () => void) => {
  if (webfontsScheduleStarted || webfontsActivated) return;
  webfontsScheduleStarted = true;
  const run = () => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(apply, { timeout: 2500 });
    } else {
      setTimeout(apply, 1);
    }
  };
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run, { once: true });
  }
};

if (import.meta.client) {
  webfontsActivated = document.documentElement.dataset.webfonts === '1';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEME_PRESETS.some((p) => p.id === stored)) {
      currentThemeId.value = stored;
    }
  } catch {
    // private mode / blocked storage
  }
  watch(currentThemeId, (id) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // ignore
    }
  });
}

type ColorPalette = Record<string, string>;

type PrimeThemeApis = {
  updatePrimaryPalette: (palette: ColorPalette) => void;
  updateSurfacePalette: (palette: ColorPalette) => void;
  palette: (color: string) => ColorPalette;
};

let primeThemeApis: PrimeThemeApis | null = null;
let primeThemeApisPromise: Promise<PrimeThemeApis> | null = null;

const loadPrimeThemeApis = () => {
  if (primeThemeApis) return Promise.resolve(primeThemeApis);
  if (!primeThemeApisPromise) {
    primeThemeApisPromise = import('@primeuix/themes').then((mod) => {
      primeThemeApis = {
        updatePrimaryPalette: mod.updatePrimaryPalette,
        updateSurfacePalette: mod.updateSurfacePalette,
        palette: mod.palette as PrimeThemeApis['palette'],
      };
      return primeThemeApis;
    });
  }
  return primeThemeApisPromise;
};

/** Lightweight mix for CSS vars — keeps @primeuix/themes off the entry critical path. */
const mixHex = (hex: string, toward: 0 | 255, amount: number) => {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const mix = (channel: number) => Math.round(channel + (toward - channel) * amount);
  const r = mix(parseInt(hex.slice(1, 3), 16));
  const g = mix(parseInt(hex.slice(3, 5), 16));
  const b = mix(parseInt(hex.slice(5, 7), 16));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
};

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

  const syncCSSVariables = (
    theme: ThemePreset,
    { activateWebfonts = webfontsActivated }: { activateWebfonts?: boolean } = {},
  ) => {
    if (!import.meta.client) return;
    const root = document.documentElement;
    const dark = theme.isDark;

    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty(
      '--primary-hover',
      dark ? mixHex(theme.primary, 255, 0.22) : mixHex(theme.primary, 0, 0.18),
    );
    root.style.setProperty('--primary-contrast', getContrastColor(theme.primary));
    if (/^#[0-9a-fA-F]{6}$/.test(theme.primary)) {
      const r = parseInt(theme.primary.slice(1, 3), 16);
      const g = parseInt(theme.primary.slice(3, 5), 16);
      const b = parseInt(theme.primary.slice(5, 7), 16);
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }

    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', dark ? '#ffffff' : '#0f172a');
    root.style.setProperty('--muted', dark ? MUTED_DARK : MUTED_LIGHT);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty(
      '--secondary',
      dark ? mixHex(theme.surface, 0, 0.35) : mixHex(theme.surface, 255, 0.92),
    );
    root.style.setProperty('--border', dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty(
      '--glass-bg',
      dark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    );

    if (activateWebfonts) {
      webfontsActivated = true;
      root.dataset.webfonts = '1';
      root.style.setProperty('--app-font', FONT_STACKS[theme.font]);
    } else {
      root.style.setProperty('--app-font', FONT_STACKS_LOCAL[theme.font]);
    }
    root.dataset.themeFont = theme.font === 'Fira Code' ? 'fira-code' : 'sans';
  };

  const syncPrimePalettes = async (theme: ThemePreset) => {
    if (!import.meta.client || !theme) return;
    const apis = await loadPrimeThemeApis();
    apis.updatePrimaryPalette(apis.palette(theme.primary));
    apis.updateSurfacePalette(apis.palette(theme.surface));
  };

  const applyTheme = (
    theme: ThemePreset,
    {
      syncPrime = false,
      activateWebfonts = webfontsActivated,
    }: { syncPrime?: boolean; activateWebfonts?: boolean } = {},
  ) => {
    if (!import.meta.client || !theme) return;
    const root = document.documentElement;
    if (theme.isDark) {
      root.classList.add('app-dark', 'dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('app-dark', 'dark');
      root.classList.add('light');
    }

    syncCSSVariables(theme, { activateWebfonts });

    if (syncPrime) {
      void syncPrimePalettes(theme);
    } else if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => {
        void syncPrimePalettes(theme);
      });
    } else {
      setTimeout(() => {
        void syncPrimePalettes(theme);
      }, 0);
    }
  };

  // Inicializar — keep webfonts deferred until load+idle (or until the user picks a theme).
  if (import.meta.client) {
    const theme = currentTheme.value;
    if (theme) {
      applyTheme(theme, { activateWebfonts: webfontsActivated });
      if (!webfontsActivated) {
        scheduleWebfontsActivation(() => {
          const latest = currentTheme.value;
          if (latest) applyTheme(latest, { activateWebfonts: true });
        });
      }
    }
  }

  /** Persist + apply (click / Enter). */
  const setThemePreset = (id: string) => {
    const theme = THEME_PRESETS.find((p) => p.id === id);
    if (theme) {
      currentThemeId.value = id;
      applyTheme(theme, { syncPrime: true, activateWebfonts: true });
    }
  };

  /** Live preview without persisting (keyboard arrow navigation). */
  const previewTheme = (id: string) => {
    const theme = THEME_PRESETS.find((p) => p.id === id);
    if (theme) applyTheme(theme, { syncPrime: true, activateWebfonts: true });
  };

  /** Restore the persisted selection (Escape / cancel preview). */
  const cancelThemePreview = () => {
    const theme = currentTheme.value;
    if (theme) applyTheme(theme, { syncPrime: true, activateWebfonts: true });
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
