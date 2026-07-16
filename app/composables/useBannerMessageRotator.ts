import type { Ref } from 'vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const ROTATE_MS = 3000;

export function useBannerMessageRotator(enabled: Ref<boolean> | (() => boolean)) {
  const { t } = useI18n();
  const activeIndex = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const messages = computed(() => [
    t('availability.banner.messages.0'),
    t('availability.banner.messages.1'),
  ]);

  const isEnabled = computed(() => (typeof enabled === 'function' ? enabled() : enabled.value));

  function clearTimer() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function advance() {
    if (messages.value.length < 2) return;
    activeIndex.value = (activeIndex.value + 1) % messages.value.length;
  }

  function startTimer() {
    clearTimer();
    if (!import.meta.client || !isEnabled.value || messages.value.length < 2) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    timer = setInterval(advance, ROTATE_MS);
  }

  onMounted(startTimer);

  watch(isEnabled, (value) => {
    if (value) startTimer();
    else clearTimer();
  });

  watch(messages, () => {
    activeIndex.value = 0;
    startTimer();
  });

  onUnmounted(clearTimer);

  return {
    activeIndex,
    messages,
  };
}
