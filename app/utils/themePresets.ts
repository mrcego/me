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

export const THEME_STORAGE_KEY = 'theme-preset-id';

/** Must match useStorage default and CSS :root tokens. */
export const DEFAULT_THEME_ID = 'github-dark';

/** Secondary text — tuned for WCAG AA on dark/light surfaces. */
export const MUTED_DARK = '#cbd5e1';
export const MUTED_LIGHT = '#64748b';

/**
 * Native first-paint stacks. They prevent a webfont request until after load.
 * Keep aliases real: @nuxt/fonts does not emit the former synthetic fallback
 * family names, which made browsers skip them and OG generation resolve them
 * as missing remote fonts.
 */
const SANS_LOCAL_FACES =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO_LOCAL_FACES =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/** First-paint stacks — no webfont family name (no network font request). */
export const FONT_STACKS_LOCAL: Record<ThemeFont, string> = {
  Sans: SANS_LOCAL_FACES,
  'Fira Code': MONO_LOCAL_FACES,
};

/**
 * Post-LCP stacks — webfont first, then local system fallbacks.
 * Outfit must not appear in the Fira stack (optional timeout used to race a second webfont).
 * Missing Fira weights (800/900) are clamped to 700 in main.css for fira-code themes.
 */
export const FONT_STACKS: Record<ThemeFont, string> = {
  Sans: `"Outfit", ${FONT_STACKS_LOCAL.Sans}`,
  'Fira Code': `"Fira Code", ${FONT_STACKS_LOCAL['Fira Code']}`,
};

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

export function getThemePreset(id: string | null | undefined): ThemePreset {
  const found =
    THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS.find((p) => p.id === DEFAULT_THEME_ID);
  return found ?? THEME_PRESETS[0]!;
}
