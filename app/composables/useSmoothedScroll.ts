import {
  computed,
  onMounted,
  onUnmounted,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';
import { usePrefersReducedMotion } from '~/composables/useMatchMedia';

function isMobileScrollBudget() {
  return (
    import.meta.client &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches
  );
}

type SmoothedScrollApi = {
  y: Ref<number>;
  rawY: Ref<number>;
  progress: (distance?: number) => ComputedRef<number>;
  pageProgress: ComputedRef<number>;
};

let shared: SmoothedScrollApi | null = null;

/**
 * Shared lerped scroll — one RAF loop for navbar, progress bar, etc.
 * Intentionally VueUse-free so the Nuxt entry chunk stays lean.
 */
function createSmoothedScroll(lerp = 0.12): SmoothedScrollApi {
  const rawY = shallowRef(0);
  const y = shallowRef(0);
  const scrollRange = shallowRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  let frame: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let lastPublishedY = Number.NaN;

  const publishChrome = (nextY: number) => {
    if (!import.meta.client) return;
    const range = scrollRange.value;
    const pagePct = range > 0 ? Math.min(1, Math.max(0, nextY / range)) : 0;
    const navP = Math.min(1, Math.max(0, nextY / 120));
    const root = document.documentElement;
    root.style.setProperty('--page-progress', pagePct.toFixed(4));
    root.style.setProperty('--nav-progress', navP.toFixed(4));
  };

  const step = () => {
    const target = rawY.value;
    const mobile = isMobileScrollBudget();
    const alpha = prefersReducedMotion.value || mobile ? 1 : lerp;
    const delta = target - y.value;

    let next: number;
    if (Math.abs(delta) <= 0.25) {
      next = target;
      frame = null;
    } else {
      next = y.value + delta * alpha;
      frame = requestAnimationFrame(step);
    }

    publishChrome(next);

    if (mobile) {
      const rounded = Math.round(next);
      if (rounded !== lastPublishedY || frame === null) {
        lastPublishedY = rounded;
        y.value = next;
      }
    } else {
      y.value = next;
    }
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
    publishChrome(y.value);
  };

  const onScroll = () => {
    rawY.value = window.scrollY || document.documentElement.scrollTop || 0;
  };

  watch(rawY, scheduleFrame, { flush: 'sync' });

  onMounted(() => {
    onScroll();
    y.value = rawY.value;
    lastPublishedY = Math.round(rawY.value);
    updateScrollRange();
    publishChrome(y.value);

    window.addEventListener('scroll', onScroll, { passive: true });
    resizeObserver = new ResizeObserver(updateScrollRange);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);
    window.addEventListener('resize', updateScrollRange, { passive: true });
  });

  onUnmounted(() => {
    if (frame !== null) cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    window.removeEventListener('scroll', onScroll);
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
}

export const useSmoothedScroll = (lerp = 0.12) => {
  if (!shared) shared = createSmoothedScroll(lerp);
  return shared;
};
