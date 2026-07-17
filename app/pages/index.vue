<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <HeroSection />
    <LazyAboutSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyTechStackSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyCertificationsSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyCapabilitiesSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <!-- <ProjectsSection /> -->
    <LazyTestimonialsSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyHireProfilesSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyContactSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazySeoFaqSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyAppFooter :hydrate-on-visible="{ rootMargin: '200px' }" />
  </main>
</template>

<script setup>
usePortfolioSeo();
</script>
