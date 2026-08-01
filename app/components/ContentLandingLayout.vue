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
            <a
              class="btn-premium bg-primary text-primary-contrast rounded-2xl! px-8! py-4! border-none! inline-flex items-center justify-center gap-3"
              :href="sectionHref('#contact')"
              @click="goToSection($event, '#contact')"
            >
              <Icon name="solar:letter-bold-duotone" class="w-6 h-6" aria-hidden="true" />
              {{ $t('hero.cta') }}
            </a>
            <NuxtLink
              :to="localePath('/')"
              class="btn-premium glass rounded-2xl! px-8! py-4! border border-foreground/10! inline-flex items-center justify-center gap-3 font-black uppercase tracking-widest"
            >
              <Icon name="solar:arrow-left-linear" class="w-6 h-6" aria-hidden="true" />
              {{ $t('landingAi.portfolioCta') }}
            </NuxtLink>
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
