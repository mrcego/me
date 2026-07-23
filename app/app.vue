<template>
  <div
    class="main-container bg-background overflow-x-clip min-w-0"
    :class="{ 'has-availability-banner': showAnnouncement }"
  >
    <!-- CSS auto-hide splash — does not wait for Vue entry hydration -->
    <!-- Splash removed: it delayed FCP/LCP/SI in mobile lab without user value. -->

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

    <LazyAppProtocolChat hydrate-on-interaction />

    <LazyVibeCodingModal v-if="vibeCodingModalMounted" />

    <LazyPerformanceOptimizations hydrate-on-idle />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePortfolio } from '~/composables/usePortfolio';
import { useSmoothedScroll } from '~/composables/useSmoothedScroll';

// Apply the persisted palette immediately; the navbar itself can hydrate on demand.
useTheme();
const { showAnnouncement } = useAvailability();
const { activeSection } = usePortfolio();
const { pageProgress } = useSmoothedScroll(0.14);
const { vibeCodingModalMounted } = useVibeCodingModal();

onMounted(() => {
  // Defer CRT/scanline paint chrome until after first paint metrics settle.
  const enableFx = () => document.documentElement.classList.add('fx-on');
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(enableFx, { timeout: 2500 });
  } else {
    setTimeout(enableFx, 1200);
  }
});

useHead({
  link: [
    {
      // Match mobile DPR (~1.75–2x) so preload === LCP request (392w for 224 CSS px).
      rel: 'preload',
      as: 'image',
      type: 'image/webp',
      href: '/_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg',
      fetchpriority: 'high',
      imagesizes: '224px',
      imagesrcset:
        '/_ipx/f_webp&q_85&fit_cover&s_224x280/img/me.jpg 224w, /_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg 392w, /_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg 448w',
    },
  ],
});
</script>
