<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/angular-developer',
    es: '/desarrollador-angular',
  },
});

useAngularDeveloperLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingAngular" />
</template>
