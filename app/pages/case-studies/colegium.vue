<script setup lang="ts">
import { useCaseStudySeo } from '~/composables/useCaseStudySeo';

defineI18nRoute({
  paths: {
    en: '/case-studies/colegium',
    es: '/casos/colegium',
  },
});

useCaseStudySeo('colegium');
</script>

<template>
  <CaseStudyPage slug="colegium" />
</template>
