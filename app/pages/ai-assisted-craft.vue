<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/ai-assisted-craft',
    es: '/craft-asistido-ia',
  },
});

useAiCraftLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingCraft" />
</template>
