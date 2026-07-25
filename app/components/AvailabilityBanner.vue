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
                <!-- Inline SVGs keep @iconify/vue out of the eager entry chunk. -->
                <svg
                  class="availability-banner__cta-icon availability-banner__cta-icon--mail"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.1-.5 7.2 5.1a1.2 1.2 0 0 0 1.4 0L19.9 6H4.1Zm15.4 2.3-5.9 4.2a3.2 3.2 0 0 1-3.2 0L4.5 8.3V17.5c0 .55.45 1 1 1h13c.55 0 1-.45 1-1V8.3Z"
                  />
                </svg>
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
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
