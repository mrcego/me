<script setup>
usePortfolioSeo();
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <HeroSection />
    <!--
      Near-fold: hydrate-after (not visible). Desktop IO still treated About as visible
      and chained About CSS/JS into the critical path (~1.8s). SSR HTML paints first.
      Far sections: visible + rootMargin — outside the initial viewport, so they stay
      off the critical chain until scroll.
    -->
    <LazyAboutSection :hydrate-after="2400" />
    <LazyTechStackSection :hydrate-after="2800" />
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
