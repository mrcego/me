<template>
  <div class="main-container bg-background overflow-x-clip min-w-0">
    <!-- Entrance Loader -->
    <AppLoader :loading="loading" @after-leave="onLoaderAfterLeave" />

    <SkipToContent />

    <!-- Global Scroll Progress -->
    <div
      class="fixed top-0 left-0 right-0 h-1 z-100 origin-left bg-linear-to-r from-primary via-primary/80 to-primary/40 will-change-transform"
      :style="{ transform: `scaleX(${pageProgress / 100})` }"
      role="progressbar"
      :aria-valuenow="pageProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    />

    <!-- Particles Background -->
    <ClientOnly>
      <ParticlesBackground />
    </ClientOnly>

    <AppNavbar :active-section="activeSection" />

    <NuxtPage />

    <LazyAppProtocolChat />

    <AvailabilityAnnouncement :ready="announcementReady" />

    <PerformanceOptimizations />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePortfolio } from '~/composables/usePortfolio';
import { useSmoothedScroll } from '~/composables/useSmoothedScroll';

const { activeSection } = usePortfolio();
const { pageProgress } = useSmoothedScroll(0.14);
const loading = ref(true);
const announcementReady = ref(false);

function onLoaderAfterLeave() {
  announcementReady.value = true;
}

onMounted(() => {
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
