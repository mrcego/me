import type { Ref } from 'vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMediaQuery } from '@vueuse/core';

const ROTATE_MS = 3000;
/** Tailwind `xl` — date chip sits beside the rotator from this width up. */
const XL_UP = '(min-width: 1280px)';

export function useBannerMessageRotator(enabled: Ref<boolean> | (() => boolean)) {
  const { t } = useI18n();
  const activeIndex = ref(0);
  const isXlUp = useMediaQuery(XL_UP);
  let timer: ReturnType<typeof setInterval> | null = null;

  const dateMessage = computed(
    () => `${t('availability.banner.availableLabel')} ${t('availability.announcement.dateValue')}`,
  );

  const messages = computed(() => {
    const rotating = [t('availability.banner.messages.0'), t('availability.banner.messages.1')];

    // Below xl the side date chip is hidden / clipped — rotate the date as a 3rd line.
    if (!isXlUp.value) {
      rotating.push(dateMessage.value);
    }

    return rotating;
  });

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
    showDateChip: isXlUp,
  };
}
