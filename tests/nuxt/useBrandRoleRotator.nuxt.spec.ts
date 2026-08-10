import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useBrandRoleRotator } from '~/composables/ui/useBrandRoleRotator';

describe('useBrandRoleRotator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('rotates brand roles when motion is allowed', async () => {
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

    let api!: ReturnType<typeof useBrandRoleRotator>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useBrandRoleRotator();
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();

    expect(api.brandRoles.value.length).toBe(6);
    const first = api.activeRoleIndex.value;
    await vi.advanceTimersByTimeAsync(3000);
    expect(api.activeRoleIndex.value).not.toBe(first);
  });

  it('contains expected i18n roles including Frontend Architect', async () => {
    let api!: ReturnType<typeof useBrandRoleRotator>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useBrandRoleRotator();
          return {};
        },
        template: '<div />',
      }),
    );
    await nextTick();

    expect(
      api.brandRoles.value.some(
        (role) =>
          role.toLowerCase().includes('architect') || role.toLowerCase().includes('arquitecto'),
      ),
    ).toBe(true);
  });
});
