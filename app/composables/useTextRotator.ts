import type { Ref } from 'vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

export interface UseTextRotatorOptions {
  intervalMs?: number;
  enabled?: Ref<boolean> | (() => boolean);
}

export function useTextRotator(
  items: Ref<string[]> | (() => string[]),
  options: UseTextRotatorOptions = {},
) {
  const { intervalMs = 3000, enabled } = options;
  const activeIndex = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const itemList = computed(() => (typeof items === 'function' ? items() : items.value));

  const isEnabled = computed(() => {
    if (enabled === undefined) return true;
    return typeof enabled === 'function' ? enabled() : enabled.value;
  });

  function clearTimer() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function advance() {
    if (itemList.value.length < 2) return;
    activeIndex.value = (activeIndex.value + 1) % itemList.value.length;
  }

  function startTimer() {
    clearTimer();
    if (!import.meta.client || !isEnabled.value || itemList.value.length < 2) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    timer = setInterval(advance, intervalMs);
  }

  onMounted(startTimer);

  watch(isEnabled, (value) => {
    if (value) startTimer();
    else clearTimer();
  });

  watch(itemList, () => {
    activeIndex.value = 0;
    startTimer();
  });

  onUnmounted(clearTimer);

  return {
    activeIndex,
    items: itemList,
  };
}
