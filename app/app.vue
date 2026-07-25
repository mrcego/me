<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSmoothedScroll } from '~/composables/useSmoothedScroll';

// Apply the persisted palette immediately; the navbar itself can hydrate on demand.
useTheme();
const { showAnnouncement } = useAvailability();
// Keep intersection observers alive even while LazyAppNavbar is deferred.
usePortfolio();
const { pageProgress } = useSmoothedScroll(0.14);
const { vibeCodingModalMounted } = useVibeCodingModal();

/** Fixed full-viewport particle canvas is too expensive on mobile scroll. */
const enableGlobalParticles = ref(false);

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

onMounted(() => {
  const coarseOrNarrow =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;

  // Defer CRT/scanline paint chrome until after first paint metrics settle.
  // On mobile, never enable full-viewport HUD overlays (also clear a sticky class).
  if (coarseOrNarrow) {
    document.documentElement.classList.remove('fx-on');
  } else {
    window.setTimeout(() => {
      enableGlobalParticles.value = true;
    }, 4200);
    // Stagger CRT/scanline chrome after particle canvases so idle work doesn't stack.
    const enableFx = () => document.documentElement.classList.add('fx-on');
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(enableFx, { timeout: 5500 });
    } else {
      setTimeout(enableFx, 4000);
    }
  }
});
</script>

<template>
  <div
    class="main-container bg-background overflow-x-clip min-w-0"
    :class="{ 'has-availability-banner': showAnnouncement }"
  >
    <!-- CSS auto-hide splash — does not wait for Vue entry hydration -->
    <!-- Splash removed: it delayed FCP/LCP/SI in mobile lab without user value. -->

    <SkipToContent />

    <AvailabilityBanner />

    <!-- Global Scroll Progress — scale driven by --page-progress (direct DOM from useSmoothedScroll) -->
    <div
      class="page-scroll-progress fixed left-0 right-0 h-1 z-110 origin-left bg-linear-to-r from-primary via-primary/80 to-primary/40 will-change-transform"
      :style="{ top: 'var(--availability-banner-h, 0px)' }"
      role="progressbar"
      :aria-valuenow="Math.round(pageProgress)"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    />

    <!--
      Mount-delay (not only hydrate-after): Lazy islands still fetch their chunk when
      inserted into the tree; keep particles out of the first-second network window.
    -->
    <LazyParticlesBackground v-if="enableGlobalParticles" />

    <!-- No reactive props: prop changes force immediate hydration on Lazy islands. -->
    <LazyAppNavbar :hydrate-after="2800" />

    <NuxtPage />

    <!--
      hydrate-after (not interaction): scroll-to-top + chat FAB need mounted listeners.
      Interaction-only left them inert / invisible until a click that never came.
    -->
    <LazyAppProtocolChat :hydrate-after="1200" />

    <LazyVibeCodingModal v-if="vibeCodingModalMounted" />

    <LazyPerformanceOptimizations :hydrate-after="5000" />
  </div>
</template>
