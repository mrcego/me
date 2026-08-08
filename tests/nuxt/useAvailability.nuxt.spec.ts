import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { AVAILABILITY_START, useAvailability } from '~/composables/useAvailability';

describe('useAvailability', () => {
  it('shows announcement and evaluates isAvailable=false before start date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() - 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          api = useAvailability();
          return {};
        },
        template: '<div />',
      }),
    );

    await nextTick();
    expect(api.showAnnouncement.value).toBe(true);
    expect(api.isAvailable.value).toBe(false);
    wrapper.unmount();
    vi.useRealTimers();
  });

  it('evaluates isAvailable=true on/after the start date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() + 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          api = useAvailability();
          return {};
        },
        template: '<div />',
      }),
    );

    await nextTick();
    expect(api.showAnnouncement.value).toBe(true);
    expect(api.isAvailable.value).toBe(true);
    wrapper.unmount();
    vi.useRealTimers();
  });
});
