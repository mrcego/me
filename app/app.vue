<template>
  <div
    class="main-container bg-background overflow-x-clip min-w-0"
    :class="{ 'has-availability-banner': showAnnouncement }"
  >
    <!-- Entrance loader — SSR so it covers first paint (no content→loader flash) -->
    <AppLoader v-if="showLoader" :loading="loading" @after-leave="onLoaderGone" />

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

    <LazyVibeCodingModal v-if="vibeCodingModalMounted" />

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
const { vibeCodingModalMounted } = useVibeCodingModal();
const showLoader = ref(true);
const loading = ref(true);

function onLoaderGone() {
  showLoader.value = false;
}

onMounted(() => {
  // Fonts are already preloaded — hide ASAP so the hero owns LCP.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loading.value = false;
    });
  });
});

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      type: 'image/webp',
      href: '/_ipx/f_webp&q_85&fit_cover&s_224x280/img/me.jpg',
      fetchpriority: 'high',
    },
  ],
});
</script>
