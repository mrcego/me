<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/nodejs-backend-developer',
    es: '/desarrollador-backend-nodejs',
  },
});

useNodeBackendLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingNode" />
</template>
