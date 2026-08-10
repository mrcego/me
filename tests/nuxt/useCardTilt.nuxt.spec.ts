import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useCardTilt } from '~/composables/ui/useCardTilt';

function stubReduced(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function fakeRect(): DOMRect {
  return {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

async function mountTilt() {
  let tilt!: ReturnType<typeof useCardTilt>;
  const wrapper = await mountSuspended(
    defineComponent({
      setup() {
        tilt = useCardTilt({ maxDeg: 10, settleMs: 100 });
        return {
          onPointerMove: tilt.onPointerMove,
          onPointerLeave: tilt.onPointerLeave,
          onPointerDown: tilt.onPointerDown,
          onPointerUp: tilt.onPointerUp,
          onPointerCancel: tilt.onPointerCancel,
        };
      },
      template: '<div data-hit />',
      mounted() {
        // bind hit ref after mount
      },
    }),
  );
  await nextTick();
  const el = wrapper.element as HTMLElement;
  el.getBoundingClientRect = fakeRect;
  tilt.hitRef.value = el;
  return { tilt, wrapper };
}

describe('useCardTilt', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('updates transform from pointer position (happy path)', async () => {
    stubReduced(false);
    const { tilt } = await mountTilt();
    tilt.onPointerMove({
      clientX: 100,
      clientY: 0,
      pointerType: 'mouse',
    } as PointerEvent);
    expect(tilt.style.value.transform).toContain('rotateX');
    expect(tilt.style.value.transform).not.toBe('rotateX(0deg) rotateY(0deg)');
  });

  it('resets on leave and cancel', async () => {
    stubReduced(false);
    const { tilt } = await mountTilt();
    tilt.onPointerMove({
      clientX: 90,
      clientY: 10,
      pointerType: 'mouse',
    } as PointerEvent);
    tilt.onPointerLeave();
    expect(tilt.style.value.transform).toBe('rotateX(0deg) rotateY(0deg)');

    tilt.onPointerMove({
      clientX: 90,
      clientY: 10,
      pointerType: 'mouse',
    } as PointerEvent);
    tilt.onPointerCancel();
    expect(tilt.style.value.transform).toBe('rotateX(0deg) rotateY(0deg)');
  });

  it('tilts on touch start then settles after pointer up', async () => {
    stubReduced(false);
    vi.useFakeTimers();
    const { tilt } = await mountTilt();
    tilt.onPointerDown({
      clientX: 80,
      clientY: 20,
      pointerType: 'touch',
    } as PointerEvent);
    expect(tilt.style.value.transform).toContain('rotate');
    tilt.onPointerUp({ pointerType: 'touch' } as PointerEvent);
    // settle timer is Math.max(320, settleMs * 0.55)
    await vi.advanceTimersByTimeAsync(400);
    expect(tilt.style.value.transform).toBe('rotateX(0deg) rotateY(0deg)');
  });

  it('no-ops when reduced motion is preferred (bad path)', async () => {
    stubReduced(true);
    const { tilt } = await mountTilt();
    tilt.onPointerMove({
      clientX: 100,
      clientY: 0,
      pointerType: 'mouse',
    } as PointerEvent);
    expect(tilt.style.value).toEqual({});
  });
});
