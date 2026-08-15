<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSmoothedScroll } from '~/composables/ui/useSmoothedScroll';
import { buildThemeFaviconHref } from '~/utils/themeFavicon';

// Apply the persisted palette immediately; the navbar itself can hydrate on demand.
const { currentTheme } = useTheme();
const { showAnnouncement } = useAvailability();
// Keep intersection observers alive even while LazyAppNavbar is deferred.
usePortfolio();
const { pageProgress } = useSmoothedScroll(0.14);
const { vibeCodingModalMounted } = useVibeCodingModal();
const { terminalMounted } = usePortfolioTerminal();
const {
  gatePhase,
  revealedKeys,
  progressIndex,
  sequenceLength,
  announce: gateAnnounce,
} = usePortfolioTerminalShortcut();
useWebVitalsRum();

/** Fixed full-viewport particle canvas is too expensive on mobile scroll. */
const enableGlobalParticles = ref(false);
const faviconReady = ref(false);

useHead({
  link: [
    {
      // Must match HeroSection NuxtImg sizes/srcset. Generate pipeline re-injects this
      // at the start of <head> (scripts/lib/lcp-image-preload.mjs) so discovery is not
      // delayed by theme-init + inlined CSS (~200KB) — that was ~320ms resource load delay.
      // Mobile display ~154 CSS px × ~2.625 DPR → prefers 392w (not a bare 448w default).
      rel: 'preload',
      as: 'image',
      type: 'image/webp',
      href: '/_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg',
      fetchpriority: 'high',
      tagPriority: 'critical',
      imagesizes:
        '(max-width: 640px) 154px, (max-width: 768px) 205px, (max-width: 1024px) 256px, (max-width: 1280px) 392px, 448px',
      imagesrcset:
        '/_ipx/f_webp&q_85&fit_cover&s_224x280/img/me.jpg 224w, /_ipx/f_webp&q_85&fit_cover&s_256x320/img/me.jpg 256w, /_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg 392w, /_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg 448w',
    },
  ],
});

useHead(() => {
  if (!faviconReady.value) return {};

  return {
    link: [
      {
        id: 'theme-favicon',
        key: 'theme-favicon',
        rel: 'icon',
        type: 'image/svg+xml',
        href: buildThemeFaviconHref(currentTheme.value.primary),
      },
    ],
  };
});

onMounted(() => {
  // Keep the static favicon for SSR, then match the persisted theme after hydration.
  faviconReady.value = true;

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
  <!--
    Keep fixed chrome (nav / banner / progress) outside overflow-x-clip.
    Ancestors with overflow clip/hidden disable backdrop-filter on fixed children,
    which made the scrolled navbar look fully transparent.
  -->
  <div
    class="main-container bg-background min-w-0"
    :class="{ 'has-availability-banner': showAnnouncement }"
  >
    <SkipToContent />
    <div data-terminal-gate-announcement class="sr-only" aria-live="polite" aria-atomic="true">
      {{ gateAnnounce }}
    </div>

    <AvailabilityBanner />

    <!-- Global Scroll Progress — scale driven by --page-progress (direct DOM from useSmoothedScroll) -->
    <div
      class="page-scroll-progress fixed left-0 right-0 h-1 z-110 origin-left bg-linear-to-r from-primary via-primary/80 to-primary/40 will-change-transform"
      :style="{ top: 'var(--availability-banner-h, 0px)' }"
      role="progressbar"
      :aria-valuenow="Math.round(pageProgress)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="$t('a11y.pageScrollProgress')"
    />

    <!-- No reactive props: prop changes force immediate hydration on Lazy islands. -->
    <LazyAppNavbar :hydrate-after="4200" />

    <div class="relative min-w-0 overflow-x-clip">
      <!--
        Mount-delay: Lazy islands still fetch their chunk when inserted into the tree;
        keep particles out of the first-second network window.
      -->
      <LazyParticlesBackground v-if="enableGlobalParticles" />

      <NuxtPage />
    </div>

    <LazyVibeCodingModal v-if="vibeCodingModalMounted" />
    <LazyTerminalKonamiSequenceGate
      v-if="gatePhase !== 'idle'"
      :phase="gatePhase"
      :keys="revealedKeys"
      :progress="progressIndex"
      :total="sequenceLength"
    />
    <LazyPortfolioTerminal v-if="terminalMounted" />

    <LazyAngieChatLauncher :hydrate-after="3500" />

    <LazyPerformanceOptimizations :hydrate-after="5000" />
  </div>
</template>
