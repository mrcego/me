<template>
  <Motion
    v-if="showReopenHint"
    :initial="motionInitial({ opacity: 0, scale: 0.92, x: -8 })"
    :animate="motionAnimate({ opacity: 1, scale: 1, x: 0 })"
    :transition="{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }"
  >
    <button
      type="button"
      class="availability-reopen-chip surface-card surface-card--soft group/chip"
      :aria-label="$t('availability.reopenAria')"
      @click="openAnnouncement"
    >
      <span class="availability-reopen-chip__icon-wrap" aria-hidden="true">
        <Icon name="solar:bell-bing-bold-duotone" class="availability-reopen-chip__icon" />
      </span>
      <span
        class="availability-reopen-chip__label type-overline text-primary tracking-[0.28em] sm:tracking-[0.34em]"
      >
        {{ $t('availability.reopen') }}
      </span>
      <Icon
        name="lucide:arrow-up-right"
        class="availability-reopen-chip__arrow"
        aria-hidden="true"
      />
    </button>
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';

const { motionInitial, motionAnimate } = useMotionConfig();
const { showReopenHint, openAnnouncement } = useAvailability();
</script>
