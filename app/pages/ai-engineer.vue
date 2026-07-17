<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/ai-engineer',
    es: '/ingeniero-ia',
  },
});

useAiEngineerLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingAi" />
</template>
