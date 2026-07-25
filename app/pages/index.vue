<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <HeroSection />
    <!-- Tighter rootMargin reduces hydrate storms when fast-scrolling on mobile. -->
    <LazyAboutSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyTechStackSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyCertificationsSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyCapabilitiesSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <!-- <ProjectsSection /> -->
    <LazyTestimonialsSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyHireProfilesSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyContactSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazySeoFaqSection :hydrate-on-visible="{ rootMargin: '80px' }" />
    <LazyAppFooter :hydrate-on-visible="{ rootMargin: '80px' }" />
  </main>
</template>

<script setup>
usePortfolioSeo();
</script>
