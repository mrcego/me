<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/frontend-architect',
    es: '/arquitecto-frontend',
  },
});

useFrontendArchitectLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingArchitect" />
</template>
