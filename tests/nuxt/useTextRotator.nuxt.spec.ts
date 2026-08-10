import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { useTextRotator } from '~/composables/ui/useTextRotator';

describe('useTextRotator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('rotates items when enabled and motion is allowed', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const items = ref(['Alpha', 'Beta', 'Gamma']);
    let api!: ReturnType<typeof useTextRotator>;

    await mountSuspended(
      defineComponent({
        setup() {
          api = useTextRotator(items, { intervalMs: 3000 });
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();

    expect(api.activeIndex.value).toBe(0);
    await vi.advanceTimersByTimeAsync(3000);
    expect(api.activeIndex.value).toBe(1);
    await vi.advanceTimersByTimeAsync(3000);
    expect(api.activeIndex.value).toBe(2);
    await vi.advanceTimersByTimeAsync(3000);
    expect(api.activeIndex.value).toBe(0);
  });
});
