import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOCALE_SWITCH_SCROLL_KEY,
  consumeLocaleSwitchScroll,
  isHomeLocalePath,
  storeLocaleSwitchScroll,
} from '../../app/utils/locale-switch-scroll';

describe('locale-switch-scroll', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    });
    vi.stubGlobal('window', { scrollY: 240 });
  });

  it('identifies home locale paths', () => {
    expect(isHomeLocalePath('/')).toBe(true);
    expect(isHomeLocalePath('/es')).toBe(true);
    expect(isHomeLocalePath('/ai-engineer')).toBe(false);
  });

  it('stores and consumes scroll position across locale switches', () => {
    storeLocaleSwitchScroll();
    expect(sessionStorage.getItem(LOCALE_SWITCH_SCROLL_KEY)).toBe('240');
    expect(consumeLocaleSwitchScroll()).toBe(240);
    expect(sessionStorage.getItem(LOCALE_SWITCH_SCROLL_KEY)).toBeNull();
  });

  it('returns null when nothing was stored (bad path)', () => {
    expect(consumeLocaleSwitchScroll()).toBeNull();
  });

  it('returns null for non-numeric stored values (bad path)', () => {
    sessionStorage.setItem(LOCALE_SWITCH_SCROLL_KEY, 'nope');
    expect(consumeLocaleSwitchScroll()).toBeNull();
  });
});
