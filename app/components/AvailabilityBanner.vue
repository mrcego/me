<script setup lang="ts">
const { showAnnouncement } = useAvailability();
const { activeIndex, messages, showDateChip } = useBannerMessageRotator(
  () => showAnnouncement.value,
);
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
        <div class="availability-banner__content">
          <div class="availability-banner__icon-slot" aria-hidden="true">
            <span class="availability-banner__pulse">
              <span class="availability-banner__pulse-ping" />
              <span class="availability-banner__pulse-dot" />
            </span>
          </div>

          <div class="availability-banner__text-wrap">
            <div class="availability-banner__inner">
              <span class="availability-banner__badge">
                {{ $t('availability.banner.badge') }}
              </span>

              <div class="availability-banner__copy">
                <div class="availability-banner__rotator" aria-live="polite">
                  <div
                    class="availability-banner__rotator-track"
                    :style="{ transform: `translate3d(0, -${activeIndex * 100}%, 0)` }"
                  >
                    <p
                      v-for="(message, index) in messages"
                      :key="`${messages.length}-${index}`"
                      class="availability-banner__rotator-line"
                    >
                      {{ message }}
                    </p>
                  </div>
                </div>

                <span v-if="showDateChip" class="availability-banner__date-chip">
                  <span class="availability-banner__date-label">{{
                    $t('availability.banner.availableLabel')
                  }}</span>
                  <strong class="availability-banner__date">{{
                    $t('availability.announcement.dateValue')
                  }}</strong>
                </span>
              </div>

              <a
                href="#contact"
                class="availability-banner__cta"
                :aria-label="$t('availability.banner.cta')"
              >
                <Icon
                  name="solar:letter-bold-duotone"
                  class="availability-banner__cta-icon availability-banner__cta-icon--mail"
                />
                <span class="availability-banner__cta-label">{{
                  $t('availability.banner.cta')
                }}</span>
                <Icon name="lucide:arrow-up-right" class="availability-banner__cta-arrow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
