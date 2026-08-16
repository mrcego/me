<script setup lang="ts">
import Button from 'primevue/button';
import type { CaseStudySlug } from '~/composables/seo/useCaseStudySeo';
import type { I18nSectionContent } from '~/core/types/i18n';
import { getI18nArray } from '~/core/utils/i18nHelpers';

interface Props {
  slug: CaseStudySlug;
}

const props = defineProps<Props>();
const localePath = useLocalePath();
const { t, tm, rt } = useI18n();

const copyKey = (key: string) => `caseStudies.items.${props.slug}.${key}`;
const { sectionHref } = useSectionNavigation();
const contactHref = computed(() => sectionHref('#contact'));

const homeCaseStudiesHref = computed(() => sectionHref('#case-studies'));

const ALL_STUDIES = [
  {
    slug: 'colegium' as const,
    icon: 'solar:buildings-2-bold-duotone',
    to: '/case-studies/colegium',
  },
  {
    slug: 'lingoquesto' as const,
    icon: 'solar:chat-round-dots-bold-duotone',
    to: '/case-studies/lingoquesto',
  },
  {
    slug: 'tissini' as const,
    icon: 'solar:bag-2-bold-duotone',
    to: '/case-studies/tissini',
  },
] as const;

const otherStudies = computed(() => ALL_STUDIES.filter((study) => study.slug !== props.slug));

function otherTags(slug: CaseStudySlug): string[] {
  const data = getI18nArray(tm, `caseStudies.items.${slug}.tags`);
  return data.map((item) => rt(item));
}

const sectionBlocks = computed(() => {
  const data = getI18nArray<I18nSectionContent>(tm, copyKey('page.sections'));
  return data.map((item) => ({
    title: rt(item.title),
    body: rt(item.body),
  }));
});

const highlightItems = computed(() => {
  const data = getI18nArray(tm, copyKey('page.highlights'));
  return data.map((item) => rt(item));
});

const tagItems = computed(() => {
  const data = getI18nArray(tm, copyKey('tags'));
  return data.map((item) => rt(item));
});
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <section class="relative pt-33 pb-24 md:pt-41 md:pb-32 px-6 md:px-12 overflow-hidden">
      <div class="container mx-auto max-w-4xl space-y-10 md:space-y-14">
        <div class="space-y-6 md:space-y-8">
          <div class="flex items-center gap-4">
            <div class="h-0.5 w-10 bg-primary/30" />
            <p class="type-eyebrow tracking-[0.35em]">{{ t(copyKey('page.eyebrow')) }}</p>
          </div>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-balance"
          >
            {{ t(copyKey('page.title')) }}
          </h1>

          <p
            class="text-lg md:text-xl text-muted font-medium leading-relaxed max-w-3xl text-pretty"
          >
            {{ t(copyKey('page.lead')) }}
          </p>

          <div class="flex flex-wrap gap-3 text-sm font-bold text-muted">
            <span class="glass rounded-xl px-3 py-1.5 border border-foreground/10">
              {{ t(copyKey('role')) }}
            </span>
            <span class="glass rounded-xl px-3 py-1.5 border border-foreground/10">
              {{ t(copyKey('period')) }}
            </span>
          </div>

          <ul class="flex flex-wrap gap-2" :aria-label="t('caseStudies.tagsLabel')">
            <li
              v-for="tag in tagItems"
              :key="tag"
              class="bg-foreground/5 border border-foreground/10 text-foreground type-label px-3 py-1.5 rounded-xl"
            >
              {{ tag }}
            </li>
          </ul>

          <div class="flex flex-col sm:flex-row gap-4">
            <Button
              class="btn-premium bg-primary text-primary-contrast rounded-2xl! px-8! py-4! border-none!"
              as="a"
              :href="contactHref"
            >
              <Icon name="solar:letter-bold-duotone" class="w-6 h-6" />
              {{ t(copyKey('page.contactCta')) }}
            </Button>
            <NuxtLink
              :to="homeCaseStudiesHref"
              class="btn-premium glass rounded-2xl! px-8! py-4! border border-foreground/10! inline-flex items-center justify-center gap-3 font-black uppercase tracking-widest"
            >
              <Icon name="solar:arrow-left-linear" class="w-6 h-6" />
              {{ t(copyKey('page.backCta')) }}
            </NuxtLink>
          </div>
        </div>

        <section class="space-y-6 md:space-y-8">
          <article
            v-for="block in sectionBlocks"
            :key="block.title"
            class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-3"
          >
            <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ block.title }}
            </h2>
            <p class="text-muted leading-relaxed text-pretty">{{ block.body }}</p>
          </article>
        </section>

        <section
          v-if="highlightItems.length"
          class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-5"
        >
          <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {{ t(copyKey('page.highlightsTitle')) }}
          </h2>
          <ul class="space-y-3">
            <li
              v-for="item in highlightItems"
              :key="item"
              class="flex gap-3 text-muted leading-relaxed"
            >
              <Icon name="lucide:circle-check" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- Cross-linking: Other Case Studies -->
        <section
          class="space-y-6 md:space-y-8 pt-8 md:pt-12 border-t border-foreground/10"
          aria-labelledby="other-cases-heading"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="h-0.5 w-8 bg-primary/30" />
              <p class="type-eyebrow tracking-[0.35em]">{{ t('caseStudies.otherEyebrow') }}</p>
            </div>
            <h2
              id="other-cases-heading"
              class="text-3xl md:text-4xl font-black tracking-tight text-foreground"
            >
              {{ t('caseStudies.otherTitle') }}
            </h2>
            <p class="text-muted text-base leading-relaxed max-w-2xl text-pretty">
              {{ t('caseStudies.otherSubtitle') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article
              v-for="other in otherStudies"
              :key="other.slug"
              class="surface-card group relative glass rounded-3xl border border-foreground/5 hover:border-primary/20 p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 min-w-0"
            >
              <div class="space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <CoreIconBadge
                    :name="other.icon"
                    size="lg"
                    class="transition-transform group-hover:scale-105 shrink-0"
                  />
                  <span class="type-meta text-muted font-bold text-xs sm:text-sm shrink-0">
                    {{ t(`caseStudies.items.${other.slug}.period`) }}
                  </span>
                </div>
                <div class="space-y-2">
                  <p class="type-eyebrow tracking-[0.25em] text-primary">
                    {{ t(`caseStudies.items.${other.slug}.role`) }}
                  </p>
                  <h3
                    class="text-xl sm:text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors text-pretty"
                  >
                    {{ t(`caseStudies.items.${other.slug}.cardTitle`) }}
                  </h3>
                  <p class="text-muted text-sm leading-relaxed text-pretty">
                    {{ t(`caseStudies.items.${other.slug}.cardSummary`) }}
                  </p>
                </div>

                <ul class="flex flex-wrap gap-1.5 pt-1" :aria-label="t('caseStudies.tagsLabel')">
                  <li
                    v-for="tag in otherTags(other.slug)"
                    :key="tag"
                    class="bg-foreground/5 border border-foreground/10 text-foreground type-label px-2.5 py-1 rounded-xl text-xs font-mono"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <div class="pt-6 mt-4 border-t border-foreground/5 flex items-center justify-between">
                <NuxtLink
                  :to="localePath(other.to)"
                  class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary group-hover:text-primary-hover transition-colors"
                >
                  <span>{{ t('caseStudies.readMore') }}</span>
                  <Icon name="solar:arrow-right-linear" class="size-4" />
                </NuxtLink>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
