import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useMotionConfig } from '~/composables/useMotionConfig';

function stubMedia({ mobile = false, reduced = false } = {}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches:
        (reduced && query.includes('prefers-reduced-motion')) ||
        (mobile && (query.includes('max-width: 1023px') || query.includes('pointer: coarse'))),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

async function mountMotion() {
  let api!: ReturnType<typeof useMotionConfig>;
  await mountSuspended(
    defineComponent({
      setup() {
        api = useMotionConfig();
        return {};
      },
      template: '<div />',
    }),
  );
  await nextTick();
  return api;
}

describe('useMotionConfig', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('enables softened desktop entrances when motion is allowed', async () => {
    stubMedia({ mobile: false, reduced: false });
    const api = await mountMotion();

    expect(api.motionEnabled.value).toBe(true);
    const transition = api.motionTransition({ duration: 2, delay: 1 });
    expect(transition.duration).toBeLessThanOrEqual(0.5);
    expect(transition.delay).toBeLessThanOrEqual(0.12);

    const left = api.slideInLeft();
    expect(left.initial).toMatchObject({ opacity: 1 });
    expect(Math.abs((left.initial as { x: number }).x)).toBeLessThanOrEqual(14);
  });

  it('disables motion on mobile / reduced-motion (bad path)', async () => {
    stubMedia({ mobile: true, reduced: true });
    const api = await mountMotion();

    expect(api.motionEnabled.value).toBe(false);
    expect(api.motionTransition({ duration: 0.4 })).toEqual({ duration: 0, delay: 0 });
    expect(api.motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })).toEqual({
      opacity: 1,
      y: 0,
    });
  });

  it('exposes the shared entrance helpers', async () => {
    stubMedia({ mobile: false, reduced: false });
    const api = await mountMotion();
    expect(api.slideInRight().whileInView).toEqual({ opacity: 1, x: 0 });
    expect(api.slideInUp().whileInView).toEqual({ opacity: 1, y: 0 });
    expect(api.fadeIn().whileInView).toEqual({ opacity: 1, scale: 1 });
    expect(api.staggerItem(2).transition.delay).toBeLessThanOrEqual(0.12);
    expect(api.motionInView({ opacity: 1 })).toEqual({ opacity: 1 });
    expect(api.motionAnimate({ x: 1 })).toEqual({ x: 1 });
  });
});
