<script setup>
usePortfolioSeo();
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <HeroSection />
    <LazyAboutSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyCaseStudiesSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyTechStackSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyCertificationsSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyCapabilitiesSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyTestimonialsSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyHireProfilesSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyContactSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazySeoFaqSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyAppFooter :hydrate-on-visible="{ rootMargin: '200px' }" />
  </main>
</template>
