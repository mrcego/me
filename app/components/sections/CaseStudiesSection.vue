<script setup lang="ts">
import { Motion } from 'motion-v';

import { getI18nArray } from '~/core/utils/i18nHelpers';

const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();
const { trackEvent } = useAnalytics();

const studies = [
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
  {
    slug: 'tissini',
    icon: 'solar:bag-2-bold-duotone',
    to: '/case-studies/tissini',
  },
] as const;

function studyTags(slug: (typeof studies)[number]['slug']): string[] {
  const data = getI18nArray(tm, `caseStudies.items.${slug}.tags`);
  return data.map((item) => rt(item));
}

function onCaseStudyClick(slug: string) {
  trackEvent('view_case_study', { case_study_slug: slug });
}
</script>

<template>
  <section
    id="case-studies"
    class="py-24 md:py-40 px-6 md:px-12 bg-background relative overflow-hidden"
    aria-labelledby="case-studies-heading"
  >
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        class="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial from-primary/6 via-transparent to-transparent blur-3xl opacity-50"
      />
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

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 max-w-7xl mx-auto items-stretch"
      >
        <Motion
          v-for="(study, index) in studies"
          :key="study.slug"
          :initial="motionInitial({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: index * 0.06 })"
          :viewport="{ once: true }"
          class="h-full min-w-0"
        >
          <article
            class="surface-card group relative glass h-full rounded-3xl md:rounded-[2.5rem] border-foreground/5 p-6 sm:p-7 xl:p-9 flex flex-col overflow-hidden min-w-0"
          >
            <div
              class="absolute inset-0 bg-linear-to-tr from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[0.85s] pointer-events-none"
            />

            <div class="relative z-10 flex flex-col h-full gap-5 sm:gap-6 xl:gap-8 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <CoreIconBadge
                  :name="study.icon"
                  size="xl"
                  class="transition-transform group-hover:scale-105 shrink-0"
                />
                <p class="type-meta text-muted font-bold text-right shrink-0">
                  {{ $t(`caseStudies.items.${study.slug}.period`) }}
                </p>
              </div>

              <div class="space-y-2.5 sm:space-y-3 flex-1 min-w-0">
                <p class="type-eyebrow tracking-[0.3em] text-primary">
                  {{ $t(`caseStudies.items.${study.slug}.role`) }}
                </p>
                <h3
                  class="surface-card__title text-xl sm:text-2xl xl:text-3xl font-black tracking-tight text-foreground text-pretty"
                >
                  {{ $t(`caseStudies.items.${study.slug}.cardTitle`) }}
                </h3>
                <p
                  class="surface-card__text text-muted text-sm sm:text-base leading-relaxed text-pretty"
                >
                  {{ $t(`caseStudies.items.${study.slug}.cardSummary`) }}
                </p>
              </div>

              <ul class="flex flex-wrap gap-1.5 sm:gap-2" :aria-label="$t('caseStudies.tagsLabel')">
                <li
                  v-for="tag in studyTags(study.slug)"
                  :key="tag"
                  class="bg-foreground/5 border border-foreground/10 text-foreground type-label px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-mono"
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
                class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary group-hover:text-primary-hover transition-colors mt-auto pt-2"
                @click="onCaseStudyClick(study.slug)"
              >
                <span>{{ $t('caseStudies.readMore') }}</span>
                <Icon name="solar:arrow-right-linear" class="size-4" aria-hidden="true" />
              </NuxtLink>
            </div>
          </article>
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-study__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem; /* 64px */
  height: 4rem;
  border-radius: 1rem;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--background) 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .case-study__icon {
    width: 4.75rem; /* 76px */
    height: 4.75rem;
    border-radius: 1.5rem;
  }
}

@media (min-width: 768px) {
  .case-study__icon {
    width: 5.5rem; /* 88px */
    height: 5.5rem;
  }
}

.case-study__glyph {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
}

@media (min-width: 640px) {
  .case-study__glyph {
    width: 3rem; /* 48px */
    height: 3rem;
  }
}

@media (min-width: 768px) {
  .case-study__glyph {
    width: 3.5rem; /* 56px */
    height: 3.5rem;
  }
}
</style>
