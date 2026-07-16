import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue';
import { createSharedComposable, usePreferredReducedMotion, useWindowScroll } from '@vueuse/core';

/**
 * Shared lerped scroll — one RAF loop for navbar, progress bar, etc.
 */
export const useSmoothedScroll = createSharedComposable((lerp = 0.12) => {
  const { y: rawY } = useWindowScroll();
  const y = shallowRef(0);
  const scrollRange = shallowRef(0);
  const prefersReducedMotion = usePreferredReducedMotion();

  let frame: number | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const step = () => {
    const target = rawY.value;
    const alpha = prefersReducedMotion.value === 'reduce' ? 1 : lerp;
    const delta = target - y.value;

    if (Math.abs(delta) <= 0.25) {
      y.value = target;
      frame = null;
      return;
    }

    y.value += delta * alpha;
    frame = requestAnimationFrame(step);
  };

  const scheduleFrame = () => {
    if (!import.meta.client || frame !== null) return;
    frame = requestAnimationFrame(step);
  };

  const updateScrollRange = () => {
    scrollRange.value = Math.max(
      0,
      document.documentElement.scrollHeight - document.documentElement.clientHeight,
    );
  };

  watch(rawY, scheduleFrame, { flush: 'sync' });

  onMounted(() => {
    y.value = rawY.value;
    updateScrollRange();

    resizeObserver = new ResizeObserver(updateScrollRange);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);
    window.addEventListener('resize', updateScrollRange, { passive: true });
  });

  onUnmounted(() => {
    if (frame !== null) cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    window.removeEventListener('resize', updateScrollRange);
  });

  const progress = (distance = 120) => computed(() => Math.min(1, Math.max(0, y.value / distance)));

  const pageProgress = computed(() => {
    if (scrollRange.value <= 0) return 0;
    return Math.min(100, Math.max(0, (y.value / scrollRange.value) * 100));
  });

  return {
    y,
    rawY,
    progress,
    pageProgress,
  };
});
