import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { AVAILABILITY_START, useAvailability } from '~/composables/useAvailability';

describe('useAvailability', () => {
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

    expect(api.showAnnouncement.value).toBe(false);
    vi.useRealTimers();
  });
});
