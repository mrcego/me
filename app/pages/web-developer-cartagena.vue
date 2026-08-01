<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/web-developer-cartagena',
    es: '/desarrollo-web-cartagena',
  },
});

useLocalLandingSeo();
</script>

<template>
  <ExpertiseLandingPage translation-key="landingLocal" />
</template>
