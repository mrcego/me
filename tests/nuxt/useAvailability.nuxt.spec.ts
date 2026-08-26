import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { AVAILABILITY_START, useAvailability } from '~/composables/domain/useAvailability';

describe('useAvailability', () => {
  it('hides announcement when enabled is false and evaluates isAvailable=true when availableFrom is null', async () => {
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
    expect(api.showAnnouncement.value).toBe(false);
    expect(api.isAvailable.value).toBe(true);
    wrapper.unmount();
  });

  it('shows announcement when explicitly enabled via override', async () => {
    let api!: ReturnType<typeof useAvailability>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          api = useAvailability(true);
          return {};
        },
        template: '<div />',
      }),
    );

    await nextTick();
    expect(api.showAnnouncement.value).toBe(true);
    expect(api.isAvailable.value).toBe(true);
    wrapper.unmount();
  });

  it('evaluates isAvailable=true on/after the start date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() + 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          api = useAvailability(true);
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
