<script setup>
usePortfolioSeo();
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <HeroSection />
    <!--
      Near-fold: long hydrate-after (not visible). Keeps section JS off the LCP
      critical request chain; SSR HTML + inlined styles paint first.
      Far sections: hydrate-on-visible — only fetch when approaching viewport.
    -->
    <LazyAboutSection :hydrate-after="4500" />
    <LazyTechStackSection :hydrate-after="5000" />
    <LazyCertificationsSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyCapabilitiesSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <!-- <ProjectsSection /> -->
    <LazyTestimonialsSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyHireProfilesSection :hydrate-on-visible="{ rootMargin: '120px' }" />
    <LazyContactSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazySeoFaqSection :hydrate-on-visible="{ rootMargin: '200px' }" />
    <LazyAppFooter :hydrate-on-visible="{ rootMargin: '200px' }" />
  </main>
</template>
