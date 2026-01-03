<template>
  <div class="main-container bg-background">
    <!-- Entrance Loader -->
    <AppLoader :loading="loading" />

    <SkipToContent />

    <!-- Global Scroll Progress -->
    <div
      class="fixed top-0 left-0 right-0 h-1 z-100 origin-left bg-linear-to-r from-primary via-primary/80 to-primary/40 transition-transform duration-100 ease-out"
      :style="{ transform: `scaleX(${scrollProgress / 100})` }"
      role="progressbar"
      :aria-valuenow="scrollProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    />

    <!-- Particles Background -->
    <ParticlesBackground />

    <AppNavbar :active-section="activeSection" />

    <NuxtPage />

    <AppProtocolChat />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "primeicons/primeicons.css";
import { usePortfolio } from "~/composables/usePortfolio";

const { activeSection, scrollProgress } = usePortfolio();
const loading = ref(true);

onMounted(() => {
  // Entrance delay for "Megawow" impact
  setTimeout(() => {
    loading.value = false;
  }, 3500);
});
</script>
