import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useMatchMedia, usePrefersReducedMotion } from '~/composables/useMatchMedia';

describe('useMatchMedia', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tracks matchMedia changes and cleans up on unmount', async () => {
    const listeners = new Set<(e: MediaQueryListEvent) => void>();
    const mql = {
      matches: false,
      media: '(min-width: 1024px)',
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        listeners.delete(cb),
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql),
    );

    let value!: ReturnType<typeof useMatchMedia>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          value = useMatchMedia('(min-width: 1024px)');
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();
    expect(value.value).toBe(false);

    for (const cb of listeners) cb({ matches: true } as MediaQueryListEvent);
    expect(value.value).toBe(true);

    wrapper.unmount();
    expect(listeners.size).toBe(0);
  });

  it('stays false when matchMedia is missing (bad path)', async () => {
    vi.stubGlobal('matchMedia', undefined);
    let value!: ReturnType<typeof usePrefersReducedMotion>;
    await mountSuspended(
      defineComponent({
        setup() {
          value = usePrefersReducedMotion();
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();
    expect(value.value).toBe(false);
  });
});
