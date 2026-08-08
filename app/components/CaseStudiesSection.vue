<script setup lang="ts">
import { Motion } from 'motion-v';

const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();

const studies = [
  {
    slug: 'tissini',
    icon: 'solar:bag-2-bold-duotone',
    to: '/case-studies/tissini',
  },
  {
    slug: 'colegium',
    icon: 'solar:buildings-2-bold-duotone',
    to: '/case-studies/colegium',
  },
  {
    slug: 'lingoquesto',
    icon: 'solar:chat-round-dots-bold-duotone',
    to: '/case-studies/lingoquesto',
  },
] as const;

function studyTags(slug: (typeof studies)[number]['slug']): string[] {
  const data = tm(`caseStudies.items.${slug}.tags`) as unknown;
  return Array.isArray(data) ? data.map((item) => rt(item)) : [];
}
</script>

<template>
  <section
    id="case-studies"
    class="py-24 md:py-40 px-6 md:px-12 bg-background relative overflow-hidden"
    aria-labelledby="case-studies-heading"
  >
    <div
      class="absolute inset-0 opacity-[0.03] z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div class="absolute inset-0 case-studies-grid-bg" />
    </div>

    <div class="container mx-auto space-y-16 md:space-y-24 relative z-10">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.42 })"
        :viewport="{ once: true }"
        class="max-w-3xl mx-auto text-center space-y-6"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <p class="type-eyebrow tracking-[0.4em]">{{ $t('caseStudies.section_tag') }}</p>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h2
          id="case-studies-heading"
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-foreground text-balance"
        >
          {{ $t('caseStudies.title_top') }}
          <span class="text-gradient">{{ $t('caseStudies.title_bottom') }}</span>
        </h2>
        <p class="text-muted text-base md:text-lg font-medium leading-relaxed text-pretty">
          {{ $t('caseStudies.lead') }}
        </p>
      </Motion>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
        <Motion
          v-for="(study, index) in studies"
          :key="study.slug"
          :initial="motionInitial({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: index * 0.06 })"
          :viewport="{ once: true }"
        >
          <article
            class="surface-card group relative glass h-full rounded-3xl md:rounded-[2.5rem] border-foreground/5 p-6 sm:p-8 md:p-10 flex flex-col overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-linear-to-tr from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[0.85s] pointer-events-none"
              style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
              aria-hidden="true"
            />

            <div class="relative z-10 flex flex-col h-full gap-6 md:gap-8">
              <div class="flex items-start justify-between gap-4">
                <div
                  class="flex size-14 items-center justify-center rounded-2xl glass text-primary shadow-lg shadow-primary/10"
                >
                  <Icon :name="study.icon" class="size-8" />
                </div>
                <p class="type-meta text-muted font-bold text-right">
                  {{ $t(`caseStudies.items.${study.slug}.period`) }}
                </p>
              </div>

              <div class="space-y-3 flex-1">
                <p class="type-eyebrow tracking-[0.3em] text-primary">
                  {{ $t(`caseStudies.items.${study.slug}.role`) }}
                </p>
                <h3
                  class="surface-card__title text-2xl md:text-3xl font-black tracking-tighter text-foreground text-pretty"
                >
                  {{ $t(`caseStudies.items.${study.slug}.cardTitle`) }}
                </h3>
                <p class="surface-card__text text-muted leading-relaxed text-pretty">
                  {{ $t(`caseStudies.items.${study.slug}.cardSummary`) }}
                </p>
              </div>

              <ul class="flex flex-wrap gap-2" :aria-label="$t('caseStudies.tagsLabel')">
                <li
                  v-for="tag in studyTags(study.slug)"
                  :key="tag"
                  class="bg-foreground/5 border border-foreground/10 text-foreground type-label px-3 py-1.5 rounded-xl"
                >
                  {{ tag }}
                </li>
              </ul>

              <NuxtLink
                :to="localePath(study.to)"
                :aria-label="
                  $t('caseStudies.readMoreAria', {
                    title: $t(`caseStudies.items.${study.slug}.cardTitle`),
                  })
                "
                class="btn-premium bg-primary text-primary-contrast rounded-2xl px-6 py-3 border-none w-fit inline-flex items-center gap-2 font-black uppercase tracking-widest after:absolute after:inset-0 opacity-100 translate-y-0 pointer-events-auto md:opacity-0 md:translate-y-4 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:pointer-events-auto transition-all duration-300 ease-out"
              >
                {{ $t('caseStudies.readMore') }}
                <Icon name="solar:arrow-right-linear" class="size-5" />
              </NuxtLink>
            </div>

            <div
              class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
              aria-hidden="true"
            />
          </article>
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-studies-grid-bg {
  background-image:
    linear-gradient(0deg, var(--foreground) 1px, transparent 1px),
    linear-gradient(90deg, var(--foreground) 1px, transparent 1px);
  background-size: 100px 100px;
}
</style>
