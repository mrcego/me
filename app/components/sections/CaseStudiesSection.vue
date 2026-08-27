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
    class="py-16 sm:py-20 md:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-background relative overflow-hidden"
    aria-labelledby="case-studies-heading"
  >
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        class="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-125 bg-radial from-primary/6 via-transparent to-transparent blur-3xl opacity-50"
      />
    </div>

    <div class="container mx-auto space-y-12 md:space-y-16 xl:space-y-20 relative z-10">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.42 })"
        :viewport="{ once: true }"
        class="max-w-3xl mx-auto"
      >
        <AppSectionHeader
          :eyebrow="$t('caseStudies.section_tag')"
          :title="$t('caseStudies.title_top')"
          :highlight="$t('caseStudies.title_bottom')"
          :description="$t('caseStudies.lead')"
          heading-id="case-studies-heading"
          align="center"
        />
      </Motion>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 xl:gap-8 w-full items-stretch">
        <Motion
          v-for="(study, index) in studies"
          :key="study.slug"
          :initial="motionInitial({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: index * 0.06 })"
          :viewport="{ once: true }"
          class="h-full min-w-0"
        >
          <AppSurface
            as="article"
            variant="glass"
            rounded="3xl"
            class="surface-card group relative h-full border-foreground/5 p-5 sm:p-6 xl:p-8 flex flex-col overflow-hidden min-w-0"
          >
            <div
              class="absolute inset-0 bg-linear-to-tr from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[0.85s] pointer-events-none"
            />

            <div class="relative z-10 flex flex-col h-full gap-4 sm:gap-5 xl:gap-6 min-w-0">
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
                <li v-for="tag in studyTags(study.slug)" :key="tag">
                  <AppBadge
                    :label="tag"
                    variant="outline"
                    size="sm"
                    class="font-mono text-xs text-foreground bg-foreground/5 border-foreground/10"
                  />
                </li>
              </ul>

              <div class="mt-auto pt-2">
                <NuxtLink
                  :to="localePath(study.to)"
                  :aria-label="
                    $t('caseStudies.readMoreAria', {
                      title: $t(`caseStudies.items.${study.slug}.cardTitle`),
                    })
                  "
                  class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary group-hover:text-primary-hover transition-colors"
                  @click="onCaseStudyClick(study.slug)"
                >
                  <span>{{ $t('caseStudies.readMore') }}</span>
                  <Icon name="solar:arrow-right-linear" class="size-4" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </AppSurface>
        </Motion>
      </div>
    </div>
  </section>
</template>
