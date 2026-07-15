import { computed, onMounted, onUnmounted, ref } from 'vue';
import { createSharedComposable, usePreferredReducedMotion, useWindowScroll } from '@vueuse/core';

/**
 * Shared lerped scroll — one RAF loop for navbar, progress bar, etc.
 */
export const useSmoothedScroll = createSharedComposable((lerp = 0.12) => {
  const { y: rawY } = useWindowScroll();
  const y = ref(0);
  const prefersReducedMotion = usePreferredReducedMotion();

  let frame = 0;

  const step = () => {
    const target = rawY.value;
    const alpha = prefersReducedMotion.value === 'reduce' ? 1 : lerp;
    y.value += (target - y.value) * alpha;
    frame = requestAnimationFrame(step);
  };

  onMounted(() => {
    y.value = rawY.value;
    frame = requestAnimationFrame(step);
  });

  onUnmounted(() => {
    cancelAnimationFrame(frame);
  });

  const progress = (distance = 120) => computed(() => Math.min(1, Math.max(0, y.value / distance)));

  const scrollReady = ref(false);

  onMounted(() => {
    scrollReady.value = true;
  });

  const pageProgress = computed(() => {
    if (!scrollReady.value || typeof document === 'undefined') return 0;

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height <= 0) return 0;

    return (y.value / height) * 100;
  });

  return {
    y,
    rawY,
    progress,
    pageProgress,
  };
});
