<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/fullstack-engineer',
    es: '/ingeniero-fullstack',
  },
});

useFullstackEngineerLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingFullstack" />
</template>
