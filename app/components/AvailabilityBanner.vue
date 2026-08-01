<script setup lang="ts">
const { showAnnouncement } = useAvailability();
const { activeIndex, messages, showDateChip } = useBannerMessageRotator(
  () => showAnnouncement.value,
);
const { goToSection, sectionHref } = useSectionNavigation();
</script>

<template>
  <div
    v-if="showAnnouncement"
    class="availability-banner"
    role="region"
    :aria-label="$t('availability.banner.aria')"
  >
    <div class="availability-banner__message availability-banner__root">
      <div class="availability-banner__content-wrapper">
        <a
          :href="sectionHref('#contact')"
          class="availability-banner__content"
          @click="goToSection($event, '#contact')"
        >
          <span class="availability-banner__icon-slot" aria-hidden="true">
            <span class="availability-banner__pulse">
              <span class="availability-banner__pulse-ping" />
              <span class="availability-banner__pulse-dot" />
            </span>
          </span>

          <span class="availability-banner__text-wrap">
            <span class="availability-banner__inner">
              <span class="availability-banner__copy">
                <span class="availability-banner__rotator" aria-live="polite">
                  <span
                    class="availability-banner__rotator-track"
                    :style="{ transform: `translate3d(0, -${activeIndex * 100}%, 0)` }"
                  >
                    <span
                      v-for="(message, index) in messages"
                      :key="`${messages.length}-${index}`"
                      class="availability-banner__rotator-line"
                    >
                      {{ message }}
                    </span>
                  </span>
                </span>

                <span v-if="showDateChip" class="availability-banner__date-chip">
                  <span class="availability-banner__date-label">{{
                    $t('availability.banner.availableLabel')
                  }}</span>
                  <strong class="availability-banner__date">{{
                    $t('availability.announcement.dateValue')
                  }}</strong>
                </span>
              </span>

              <span class="availability-banner__cta" aria-hidden="true">
                <span class="availability-banner__cta-label">{{
                  $t('availability.banner.cta')
                }}</span>
                <svg
                  class="availability-banner__cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </span>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
