export const LOCALE_SWITCH_SCROLL_KEY = 'portfolio:locale-switch-scroll';

export const storeLocaleSwitchScroll = () => {
  if (!import.meta.client) return;
  sessionStorage.setItem(LOCALE_SWITCH_SCROLL_KEY, String(window.scrollY));
};

export const consumeLocaleSwitchScroll = (): number | null => {
  if (!import.meta.client) return null;

  const raw = sessionStorage.getItem(LOCALE_SWITCH_SCROLL_KEY);
  sessionStorage.removeItem(LOCALE_SWITCH_SCROLL_KEY);

  if (raw === null) return null;

  const top = Number(raw);
  return Number.isNaN(top) ? null : top;
};

export const isHomeLocalePath = (path: string) => path === '/' || path === '/es';
