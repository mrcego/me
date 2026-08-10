import { onMounted, onUnmounted, shallowRef, type Ref } from 'vue';

/** Tiny matchMedia ref — avoids pulling `@vueuse/core` into the entry chunk. */
export function useMatchMedia(query: string): Ref<boolean> {
  const matches = shallowRef(false);
  let mql: MediaQueryList | null = null;
  let onChange: ((event: MediaQueryListEvent) => void) | null = null;

  onMounted(() => {
    if (typeof window.matchMedia !== 'function') return;
    mql = window.matchMedia(query);
    matches.value = mql.matches;
    onChange = (event: MediaQueryListEvent) => {
      matches.value = event.matches;
    };
    mql.addEventListener('change', onChange);
  });

  onUnmounted(() => {
    if (mql && onChange) mql.removeEventListener('change', onChange);
  });

  return matches;
}

/** prefers-reduced-motion without VueUse. */
export function usePrefersReducedMotion(): Ref<boolean> {
  return useMatchMedia('(prefers-reduced-motion: reduce)');
}
