<script setup lang="ts">
interface Props {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  lead: string;
}

defineProps<Props>();
const localePath = useLocalePath();
const { sectionHref, goToSection } = useSectionNavigation();
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <section class="relative pt-33 pb-24 md:pt-41 md:pb-32 px-6 md:px-12 overflow-hidden">
      <div class="container mx-auto max-w-3xl space-y-10 md:space-y-12">
        <div class="space-y-6 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-4">
            <div class="h-0.5 w-10 bg-primary/30" aria-hidden="true" />
            <p class="type-eyebrow tracking-[0.35em]">{{ eyebrow }}</p>
          </div>
          <h1
            class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-balance"
          >
            {{ title }}
            <span v-if="titleHighlight" class="text-gradient block md:inline">{{
              titleHighlight
            }}</span>
          </h1>
          <p class="text-lg md:text-xl text-muted font-medium leading-relaxed text-pretty">
            {{ lead }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <AppButton
              variant="primary"
              size="lg"
              :href="sectionHref('#contact')"
              icon-left="solar:letter-bold-duotone"
              @click="goToSection($event, '#contact')"
            >
              {{ $t('hero.cta') }}
            </AppButton>
            <AppButton
              variant="outline"
              size="lg"
              :to="localePath('/')"
              icon-left="solar:arrow-left-linear"
            >
              {{ $t('landingAi.portfolioCta') }}
            </AppButton>
          </div>
        </div>

        <div class="space-y-8 prose-invert max-w-none">
          <slot />
        </div>
      </div>
    </section>
    <AppFooter />
  </main>
</template>
