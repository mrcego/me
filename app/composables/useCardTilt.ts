import type { CSSProperties } from 'vue';
import { usePreferredReducedMotion } from '@vueuse/core';

type UseCardTiltOptions = {
  /** Max rotation in degrees from center toward an edge. */
  maxDeg?: number;
  /** Transform duration while tracking the pointer (ms). */
  followMs?: number;
  /** Transform duration when settling back to rest (ms). */
  settleMs?: number;
};

/**
 * Perspective tilt for a card: follows pointer on hover (mouse/pen),
 * and tilts toward the tap point on touch.
 *
 * Bind pointer handlers + `hitRef` to a stable outer shell (no transform).
 * Bind `style` to an inner visual layer — preferably with pointer-events: none —
 * so click targets don't move under the cursor (which cancels click).
 */
export function useCardTilt(options: UseCardTiltOptions = {}) {
  const maxDeg = options.maxDeg ?? 12;
  const followMs = options.followMs ?? 120;
  const settleMs = options.settleMs ?? 520;
  /** Untransformed hit target — use for refs + pointer listeners. */
  const hitRef = ref<HTMLElement | null>(null);
  const rotateX = ref(0);
  const rotateY = ref(0);
  const isActive = ref(false);
  const prefersReducedMotion = usePreferredReducedMotion();

  let touchResetTimer: ReturnType<typeof setTimeout> | undefined;
  /** Cached shell rect while active — ignores child visual movement. */
  let activeRect: DOMRect | null = null;
  /** Freeze tilt updates while pressed so browsers still emit click. */
  let isPointerDown = false;

  const disabled = computed(() => prefersReducedMotion.value === 'reduce');

  function clearTouchReset() {
    if (touchResetTimer !== undefined) {
      clearTimeout(touchResetTimer);
      touchResetTimer = undefined;
    }
  }

  function captureRect() {
    const el = hitRef.value;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return rect;
  }

  function updateFromPoint(clientX: number, clientY: number) {
    if (disabled.value || isPointerDown) return;

    if (!activeRect) {
      activeRect = captureRect();
    }
    const rect = activeRect;
    if (!rect) return;

    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const nx = Math.min(1, Math.max(0, px));
    const ny = Math.min(1, Math.max(0, py));

    rotateY.value = (nx - 0.5) * 2 * maxDeg;
    rotateX.value = (0.5 - ny) * 2 * maxDeg;
    isActive.value = true;
  }

  function reset() {
    rotateX.value = 0;
    rotateY.value = 0;
    isActive.value = false;
    activeRect = null;
    isPointerDown = false;
  }

  function onPointerMove(event: PointerEvent) {
    if (disabled.value || event.pointerType === 'touch' || isPointerDown) return;
    updateFromPoint(event.clientX, event.clientY);
  }

  function onPointerLeave() {
    if (disabled.value) return;
    clearTouchReset();
    reset();
  }

  function onPointerDown(event: PointerEvent) {
    if (disabled.value) return;
    isPointerDown = true;
    clearTouchReset();
    if (event.pointerType === 'touch') {
      activeRect = captureRect();
      // Allow a single tilt sample on touch start, then freeze for the tap.
      isPointerDown = false;
      updateFromPoint(event.clientX, event.clientY);
      isPointerDown = true;
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (disabled.value) return;
    isPointerDown = false;
    if (event.pointerType !== 'touch') return;
    clearTouchReset();
    touchResetTimer = setTimeout(
      () => {
        reset();
        touchResetTimer = undefined;
      },
      Math.max(320, settleMs * 0.55),
    );
  }

  function onPointerCancel() {
    clearTouchReset();
    reset();
  }

  const style = computed((): CSSProperties => {
    if (disabled.value) return {};

    return {
      transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
      transition: isActive.value
        ? `transform ${followMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : `transform ${settleMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      transformStyle: 'preserve-3d',
      willChange: isActive.value ? 'transform' : 'auto',
    };
  });

  onBeforeUnmount(() => {
    clearTouchReset();
  });

  return {
    /** @deprecated Prefer `hitRef` — same element (stable hit shell). */
    cardRef: hitRef,
    hitRef,
    style,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}
