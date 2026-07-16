<template>
  <div
    class="main-container bg-background overflow-x-clip min-w-0"
    :class="{ 'has-availability-banner': showAnnouncement }"
  >
    <!-- Dev-only entrance loader — SSR so it covers first paint (no content→loader flash) -->
    <LazyAppLoader v-if="showLoader" :loading="loading" />

    <SkipToContent />

    <AvailabilityBanner />

    <!-- Global Scroll Progress -->
    <div
      class="fixed left-0 right-0 h-1 z-110 origin-left bg-linear-to-r from-primary via-primary/80 to-primary/40 will-change-transform"
      :style="{
        top: 'var(--availability-banner-h, 0px)',
        transform: `scaleX(${pageProgress / 100})`,
      }"
      role="progressbar"
      :aria-valuenow="pageProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    />

    <!-- Non-critical canvas work starts when the browser is idle. -->
    <LazyParticlesBackground :hydrate-on-idle="2000" />

    <AppNavbar :active-section="activeSection" />

    <NuxtPage />

    <LazyAppProtocolChat :hydrate-on-idle="2000" />

    <LazyVibeCodingModal :hydrate-on-idle="1200" />

    <LazyPerformanceOptimizations hydrate-on-idle />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePortfolio } from '~/composables/usePortfolio';
import { useSmoothedScroll } from '~/composables/useSmoothedScroll';

// Apply the persisted palette immediately; the navbar itself can hydrate on demand.
useTheme();
const { showAnnouncement } = useAvailability();
const { activeSection } = usePortfolio();
const { pageProgress } = useSmoothedScroll(0.14);
const showLoader = import.meta.dev;
const loading = ref(showLoader);

onMounted(() => {
  if (!showLoader) return;

  const hideLoader = () => {
    loading.value = false;
  };

  const maxWaitMs = 450;
  const maxTimer = window.setTimeout(hideLoader, maxWaitMs);

  void document.fonts?.ready.then(() => {
    window.clearTimeout(maxTimer);
    hideLoader();
  });
});
</script>
