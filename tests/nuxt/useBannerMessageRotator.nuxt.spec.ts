import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { useBannerMessageRotator } from '~/composables/ui/useBannerMessageRotator';

describe('useBannerMessageRotator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('rotates messages when enabled and motion is allowed', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('min-width: 1280px'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const enabled = ref(true);
    let api!: ReturnType<typeof useBannerMessageRotator>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useBannerMessageRotator(enabled);
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();

    expect(api.messages.value.length).toBeGreaterThanOrEqual(2);
    const first = api.activeIndex.value;
    await vi.advanceTimersByTimeAsync(3000);
    expect(api.activeIndex.value).not.toBe(first);
  });

  it('does not rotate when disabled (bad path)', async () => {
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

    const enabled = ref(false);
    let api!: ReturnType<typeof useBannerMessageRotator>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useBannerMessageRotator(enabled);
          return {};
        },
        template: '<div />',
      }),
    );

    const first = api.activeIndex.value;
    await vi.advanceTimersByTimeAsync(9000);
    expect(api.activeIndex.value).toBe(first);
  });
});
