<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/vue-developer-colombia',
    es: '/desarrollador-vue-colombia',
  },
});

useVueColombiaLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingVueColombia" />
</template>
