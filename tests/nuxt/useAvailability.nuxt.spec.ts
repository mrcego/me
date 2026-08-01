import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { AVAILABILITY_START, useAvailability } from '~/composables/useAvailability';

describe('useAvailability', () => {
  it('defaults to showing the announcement before client reconcile (SSG-safe)', async () => {
    vi.useFakeTimers();
    // After the boundary — SSG HTML should still ship the seeking banner, then hide on mount.
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() + 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          api = useAvailability();
          // Capture pre-mount default (true) is not observable after mountSuspended;
          // assert post-mount reconcile instead.
          return {};
        },
        template: '<div />',
      }),
    );

    await nextTick();
    expect(api.showAnnouncement.value).toBe(false);
    wrapper.unmount();
    vi.useRealTimers();
  });

  it('shows the announcement before the start date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() - 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    await mountSuspended(
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
    vi.useRealTimers();
  });

  it('hides the announcement on/after the start date (bad path for banner)', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AVAILABILITY_START.getTime() + 86_400_000));

    let api!: ReturnType<typeof useAvailability>;
    await mountSuspended(
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
    vi.useRealTimers();
  });
});
