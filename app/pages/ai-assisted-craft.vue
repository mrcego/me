<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/ai-assisted-craft',
    es: '/craft-asistido-ia',
  },
});

useAiEngineerLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingAi" />
</template>
