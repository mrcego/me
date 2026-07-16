import type { CSSProperties } from 'vue';
import { usePreferredReducedMotion } from '@vueuse/core';

type UseCardTiltOptions = {
  /** Max rotation in degrees from center toward an edge. */
  maxDeg?: number;
};

/**
 * Perspective tilt for a card: follows pointer on hover (mouse/pen),
 * and tilts toward the tap point on touch.
 */
export function useCardTilt(options: UseCardTiltOptions = {}) {
  const maxDeg = options.maxDeg ?? 12;
  const cardRef = ref<HTMLElement | null>(null);
  const rotateX = ref(0);
  const rotateY = ref(0);
  const isActive = ref(false);
  const prefersReducedMotion = usePreferredReducedMotion();

  let touchResetTimer: ReturnType<typeof setTimeout> | undefined;

  const disabled = computed(() => prefersReducedMotion.value === 'reduce');

  function clearTouchReset() {
    if (touchResetTimer !== undefined) {
      clearTimeout(touchResetTimer);
      touchResetTimer = undefined;
    }
  }

  function updateFromPoint(clientX: number, clientY: number) {
    const el = cardRef.value;
    if (!el || disabled.value) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    rotateY.value = (px - 0.5) * 2 * maxDeg;
    rotateX.value = (0.5 - py) * 2 * maxDeg;
    isActive.value = true;
  }

  function reset() {
    rotateX.value = 0;
    rotateY.value = 0;
    isActive.value = false;
  }

  function onPointerMove(event: PointerEvent) {
    if (disabled.value || event.pointerType === 'touch') return;
    updateFromPoint(event.clientX, event.clientY);
  }

  function onPointerLeave() {
    if (disabled.value) return;
    clearTouchReset();
    reset();
  }

  function onPointerDown(event: PointerEvent) {
    if (disabled.value || event.pointerType !== 'touch') return;
    clearTouchReset();
    updateFromPoint(event.clientX, event.clientY);
  }

  function onPointerUp(event: PointerEvent) {
    if (disabled.value || event.pointerType !== 'touch') return;
    clearTouchReset();
    // Brief hold so a quick tap still reads as a bend.
    touchResetTimer = setTimeout(() => {
      reset();
      touchResetTimer = undefined;
    }, 320);
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
        ? 'transform 120ms ease-out'
        : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    };
  });

  onBeforeUnmount(() => {
    clearTouchReset();
  });

  return {
    cardRef,
    style,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}
