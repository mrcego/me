import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useWebVitalsRum } from '~/composables/seo/useWebVitalsRum';

describe('useWebVitalsRum', () => {
  it('registers web-vitals reporters on mount without throwing', async () => {
    const onCLS = vi.fn();
    const onINP = vi.fn();
    const onLCP = vi.fn();
    const onTTFB = vi.fn();
    const onFCP = vi.fn();

    vi.doMock('web-vitals', () => ({
      onCLS,
      onINP,
      onLCP,
      onTTFB,
      onFCP,
    }));

    await mountSuspended(
      defineComponent({
        setup() {
          useWebVitalsRum();
          return {};
        },
        template: '<div />',
      }),
    );

    await vi.waitFor(() => {
      expect(onCLS).toHaveBeenCalled();
    });
    expect(onLCP).toHaveBeenCalled();
  });
});
