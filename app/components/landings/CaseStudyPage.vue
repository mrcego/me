<script setup lang="ts">
import Button from 'primevue/button';
import type { CaseStudySlug } from '~/composables/seo/useCaseStudySeo';
import type { I18nSectionContent } from '~/core/types/i18n';
import { getI18nArray } from '~/core/utils/i18nHelpers';

interface Props {
  slug: CaseStudySlug;
}

const props = defineProps<Props>();
const { t, tm, rt } = useI18n();

const copyKey = (key: string) => `caseStudies.items.${props.slug}.${key}`;
const { sectionHref } = useSectionNavigation();
const contactHref = computed(() => sectionHref('#contact'));

const homeCaseStudiesHref = computed(() => sectionHref('#case-studies'));

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
              <Icon name="lucide:check-circle-2" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
