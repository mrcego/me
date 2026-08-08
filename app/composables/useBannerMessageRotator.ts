import type { Ref } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAvailability } from '~/composables/useAvailability';
import { useMatchMedia } from '~/composables/useMatchMedia';
import { useTextRotator } from '~/composables/useTextRotator';

/** Tailwind `xl` — date chip sits beside the rotator from this width up. */
const XL_UP = '(min-width: 1280px)';

export function useBannerMessageRotator(enabled: Ref<boolean> | (() => boolean)) {
  const { t } = useI18n();
  const isXlUp = useMatchMedia(XL_UP);
  const isMounted = ref(false);
  const { isAvailable } = useAvailability();
  const showDateChip = computed(() => isMounted.value && isXlUp.value);

  const dateMessage = computed(() => {
    if (isAvailable.value) {
      return t('availability.banner.nowAvailable');
    }
    return `${t('availability.banner.availableLabel')} ${t('availability.announcement.dateValue')}`;
  });

  const messages = computed(() => {
    const rotating = [t('availability.banner.messages.0'), t('availability.banner.messages.1')];

    // Below xl the side date chip is hidden / clipped — rotate the date as a 3rd line.
    if (!showDateChip.value) {
      rotating.push(dateMessage.value);
    }

    return rotating;
  });

  onMounted(() => {
    // Keep the first client render identical to SSR. The real media query is
    // applied only after hydration, preventing 3→2 child-node mismatches.
    isMounted.value = true;
  });

  const { activeIndex } = useTextRotator(messages, { enabled });

  return {
    activeIndex,
    messages,
    showDateChip,
    isAvailable,
  };
}
