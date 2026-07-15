<template>
  <Teleport to="body">
    <div
      v-if="layerMounted"
      class="announcement-dialog-mask"
      :class="{ 'announcement-dialog--leave': isClosing }"
    >
      <div
        class="announcement-dialog"
        :class="{ 'announcement-dialog--leave': isClosing }"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="bodyId"
      >
        <div class="announcement-modal">
          <div class="announcement-modal__ribbon" aria-hidden="true">
            <div class="announcement-modal__ribbon-track">
              <span v-for="n in 12" :key="n" class="announcement-modal__ribbon-item">
                {{ $t('availability.announcement.label') }}
              </span>
            </div>
          </div>

          <header class="announcement-modal__header">
            <button
              type="button"
              class="announcement-modal__close"
              :aria-label="$t('availability.announcement.close')"
              @click="close()"
            >
              <Icon name="lucide:x" class="w-7 h-7" />
            </button>

            <div class="announcement-modal__hero-icon" aria-hidden="true">
              <span class="announcement-modal__hero-ring announcement-modal__hero-ring--outer" />
              <span class="announcement-modal__hero-ring announcement-modal__hero-ring--inner" />
              <div class="announcement-modal__hero-core">
                <Icon name="solar:bell-bing-bold-duotone" class="announcement-modal__hero-glyph" />
              </div>
            </div>

            <div class="announcement-modal__badge">
              <span class="announcement-modal__pulse" aria-hidden="true">
                <span class="announcement-modal__pulse-dot announcement-modal__pulse-dot--ping" />
                <span class="announcement-modal__pulse-dot" />
              </span>
              <span>{{ $t('availability.announcement.badge') }}</span>
            </div>

            <h2 :id="titleId" class="announcement-modal__title">
              {{ $t('availability.announcement.title') }}
            </h2>
          </header>

          <div :id="bodyId" class="announcement-modal__body">
            <p class="announcement-modal__lead">
              {{ $t('availability.announcement.lead') }}
            </p>

            <div class="announcement-modal__date-card">
              <div class="announcement-modal__date-icon" aria-hidden="true">
                <Icon
                  name="solar:calendar-mark-bold-duotone"
                  class="announcement-modal__date-glyph"
                />
              </div>
              <div class="announcement-modal__date-copy">
                <span class="announcement-modal__date-label">
                  {{ $t('availability.announcement.dateLabel') }}
                </span>
                <span class="announcement-modal__date-value">
                  {{ $t('availability.announcement.dateValue') }}
                </span>
              </div>
            </div>

            <p class="announcement-modal__body-text">
              {{ $t('availability.announcement.body') }}
            </p>
          </div>

          <footer class="announcement-modal__footer">
            <label class="announcement-modal__remember">
              <input
                v-model="dontShowAgain"
                type="checkbox"
                class="announcement-modal__checkbox-input"
              />
              <span class="announcement-modal__checkbox-ui" aria-hidden="true">
                <Icon
                  v-if="dontShowAgain"
                  name="lucide:check"
                  class="announcement-modal__checkbox-icon"
                />
              </span>
              <span class="announcement-modal__remember-text">
                {{ $t('availability.announcement.dontShowAgain') }}
              </span>
            </label>

            <button type="button" class="announcement-modal__cta" @click="goToContact">
              <Icon name="solar:letter-bold-duotone" class="announcement-modal__cta-icon" />
              {{ $t('availability.announcement.cta') }}
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion, useScrollLock } from '@vueuse/core';

const props = defineProps<{
  ready?: boolean;
}>();

const {
  showAnnouncement,
  announcementVisible,
  isAnnouncementDismissed,
  dismissAnnouncement,
  markAnnouncementClosed,
} = useAvailability();

const dontShowAgain = ref(false);
const persistDismiss = ref(false);
const isClosing = ref(false);
const layerMounted = ref(false);
const pendingScrollAfter = ref(false);
const titleId = 'availability-announcement-title';
const bodyId = 'availability-announcement-body';

const EXIT_MS = 280;
const NAVBAR_SCROLL_OFFSET = 96;
const prefersReducedMotion = usePreferredReducedMotion();
const bodyScrollLock = useScrollLock(import.meta.client ? document.body : null);

watch(layerMounted, (mounted) => {
  bodyScrollLock.value = mounted;
});

watch(announcementVisible, (visible) => {
  if (!visible || isClosing.value) return;
  layerMounted.value = true;
});

function openIfNeeded() {
  if (!import.meta.client) return;
  if (!props.ready || !showAnnouncement.value || isAnnouncementDismissed()) return;
  dontShowAgain.value = false;
  layerMounted.value = true;
  announcementVisible.value = true;
}

watch(
  () => props.ready,
  (ready) => {
    if (!ready) return;
    setTimeout(openIfNeeded, 350);
  },
);

function finalizeClose() {
  if (persistDismiss.value) {
    dismissAnnouncement();
  }
  persistDismiss.value = false;

  if (pendingScrollAfter.value) {
    pendingScrollAfter.value = false;
    requestAnimationFrame(() => {
      scrollToContactSection();
    });
  }
}

function close(options: { scrollAfter?: boolean } = {}) {
  if (isClosing.value || !announcementVisible.value) return;

  persistDismiss.value = dontShowAgain.value;
  pendingScrollAfter.value = options.scrollAfter ?? false;
  isClosing.value = true;

  const delay = prefersReducedMotion.value === 'reduce' ? 0 : EXIT_MS;

  window.setTimeout(() => {
    announcementVisible.value = false;
    markAnnouncementClosed();
    layerMounted.value = false;
    isClosing.value = false;
    finalizeClose();
  }, delay);
}

function scrollToContactSection() {
  const element = document.getElementById('contact');
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

function goToContact() {
  close({ scrollAfter: true });
}
</script>
