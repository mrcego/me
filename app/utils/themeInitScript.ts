import {
  DEFAULT_THEME_ID,
  FONT_STACKS,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  type ThemePreset,
} from './themePresets';

function contrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

/** Compact payload embedded in the blocking head script (no Vue / PrimeVue). */
function toBootstrapEntry(theme: ThemePreset) {
  return {
    b: theme.background,
    s: theme.surface,
    p: theme.primary,
    c: contrastColor(theme.primary),
    f: theme.font === 'Fira Code' ? 1 : 0,
    d: theme.isDark ? 1 : 0,
  };
}

/**
 * Inline script that applies the persisted theme before first paint.
 * Prevents the CSS :root fallback (or default) flashing over the saved palette.
 */
export function buildThemeInitScript(): string {
  const map = Object.fromEntries(THEME_PRESETS.map((theme) => [theme.id, toBootstrapEntry(theme)]));
  const fonts = {
    0: FONT_STACKS.Sans,
    1: FONT_STACKS['Fira Code'],
  };

  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=${JSON.stringify(DEFAULT_THEME_ID)};var m=${JSON.stringify(map)};var f=${JSON.stringify(fonts)};var id=localStorage.getItem(k)||d;var t=m[id]||m[d];if(!t)return;var r=document.documentElement;r.style.setProperty('--primary',t.p);r.style.setProperty('--primary-hover',t.p);r.style.setProperty('--primary-contrast',t.c);r.style.setProperty('--background',t.b);r.style.setProperty('--surface',t.s);r.style.setProperty('--secondary',t.s);r.style.setProperty('--foreground',t.d?'#ffffff':'#0f172a');r.style.setProperty('--muted',t.d?'#94a3b8':'#64748b');r.style.setProperty('--border',t.d?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)');r.style.setProperty('--glass-bg',t.d?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)');r.style.setProperty('--font-main',f[t.f]);if(/^#[0-9a-fA-F]{6}$/.test(t.p)){r.style.setProperty('--primary-rgb',[1,3,5].map(function(i){return parseInt(t.p.slice(i,i+2),16)}).join(', '));}r.dataset.themeFont=t.f?'fira-code':'sans';if(t.d){r.classList.add('app-dark','dark');r.classList.remove('light')}else{r.classList.add('light');r.classList.remove('app-dark','dark')}}catch(e){}})();`;
}
