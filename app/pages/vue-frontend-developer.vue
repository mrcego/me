<template>
  <VueDeveloperLandingPage />
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/vue-frontend-developer',
    es: '/desarrollador-vue',
  },
});

useVueDeveloperLandingSeo();
</script>
