<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  translationKey: 'landingVue' | 'landingAi' | 'landingNode';
}

const props = defineProps<Props>();
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const openFaqIndexes = shallowRef<ReadonlySet<number>>(new Set());

const copyKey = (key: string) => `${props.translationKey}.${key}`;
const contactHref = computed(() => `${localePath('/')}#contact`);

const sisterProfiles = computed(() => {
  const profiles = [
    {
      key: 'landingVue',
      to: localePath('/vue-frontend-developer'),
      labelKey: 'hireProfiles.hireForVue',
    },
    {
      key: 'landingAi',
      to: localePath('/ai-engineer'),
      labelKey: 'hireProfiles.hireForAi',
    },
    {
      key: 'landingNode',
      to: localePath('/nodejs-backend-developer'),
      labelKey: 'hireProfiles.hireForNode',
    },
  ] as const;

  return profiles.filter((profile) => profile.key !== props.translationKey);
});

const expertiseItems = computed(() => {
  const data = tm(copyKey('expertise')) as unknown;
  return Array.isArray(data) ? data.map((item) => rt(item)) : [];
});

const proofItems = computed(() => {
  const data = tm(copyKey('proof')) as unknown;
  return Array.isArray(data) ? data.map((item) => rt(item)) : [];
});

const faqItems = computed(() => {
  const data = tm(copyKey('faq')) as Array<{ question: unknown; answer: unknown }> | unknown;
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    question: rt(item.question),
    answer: rt(item.answer),
  }));
});

const isFaqOpen = (index: number) => openFaqIndexes.value.has(index);

const toggleFaq = (index: number) => {
  const nextOpenIndexes = new Set(openFaqIndexes.value);
  if (nextOpenIndexes.has(index)) {
    nextOpenIndexes.delete(index);
  } else {
    nextOpenIndexes.add(index);
  }
  openFaqIndexes.value = nextOpenIndexes;
};
</script>

<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <section class="relative pt-33 pb-24 md:pt-41 md:pb-32 px-6 md:px-12 overflow-hidden">
      <div class="container mx-auto max-w-5xl space-y-10 md:space-y-14">
        <div class="space-y-6 md:space-y-8 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-4">
            <div class="h-0.5 w-10 bg-primary/30" />
            <p class="type-eyebrow tracking-[0.35em]">{{ t(copyKey('eyebrow')) }}</p>
          </div>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-balance"
          >
            {{ t(copyKey('title')) }}
            <span class="text-gradient block xl:inline">{{ t(copyKey('titleHighlight')) }}</span>
          </h1>

          <p
            class="text-lg md:text-xl lg:text-2xl text-muted font-medium leading-relaxed max-w-3xl"
          >
            {{ t(copyKey('lead')) }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              class="btn-premium bg-primary text-primary-contrast rounded-2xl! px-8! py-4! border-none!"
              as="a"
              :href="contactHref"
            >
              <Icon name="solar:letter-bold-duotone" class="w-6 h-6" />
              {{ t(copyKey('contactCta')) }}
            </Button>
            <NuxtLink
              :to="localePath('/')"
              class="btn-premium glass rounded-2xl! px-8! py-4! border border-foreground/10! inline-flex items-center justify-center gap-3 font-black uppercase tracking-widest"
            >
              <Icon name="solar:arrow-left-linear" class="w-6 h-6" />
              {{ t(copyKey('portfolioCta')) }}
            </NuxtLink>
          </div>

          <div
            class="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3"
          >
            <span class="text-xs font-black uppercase tracking-widest text-muted">
              {{ t('hireProfiles.alsoAvailable') }}
            </span>
            <NuxtLink
              v-for="profile in sisterProfiles"
              :key="profile.key"
              :to="profile.to"
              class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors"
            >
              {{ t(profile.labelKey) }}
              <Icon name="solar:arrow-right-linear" class="size-4" />
            </NuxtLink>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 md:gap-8">
          <article class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-5">
            <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ t(copyKey('expertiseTitle')) }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="item in expertiseItems"
                :key="item"
                class="flex gap-3 text-muted leading-relaxed"
              >
                <Icon name="lucide:check-circle-2" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>

          <article class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-5">
            <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ t(copyKey('experienceTitle')) }}
            </h2>
            <p class="text-muted leading-relaxed">{{ t(copyKey('experienceBody')) }}</p>
            <h3 class="type-eyebrow tracking-[0.3em]">{{ t(copyKey('proofTitle')) }}</h3>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in proofItems"
                :key="item"
                class="flex gap-3 text-muted leading-relaxed"
              >
                <span class="text-primary font-black text-sm">{{
                  String(index + 1).padStart(2, '0')
                }}</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>

        <section class="space-y-6 md:space-y-8">
          <h2 class="text-3xl md:text-4xl font-black tracking-tight text-center md:text-left">
            {{ t(copyKey('faqTitle')) }}
          </h2>
          <div class="grid gap-4">
            <article
              v-for="(item, index) in faqItems"
              :key="item.question"
              class="surface-card glass rounded-2xl border-foreground/5 p-5 md:p-6"
            >
              <button
                type="button"
                class="w-full cursor-pointer font-bold text-foreground tracking-tight flex items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
                :aria-expanded="isFaqOpen(index)"
                :aria-controls="`${translationKey}-faq-panel-${index}`"
                @click="toggleFaq(index)"
              >
                {{ item.question }}
                <Icon
                  name="lucide:chevron-down"
                  class="faq-chevron w-5 h-5 text-primary shrink-0"
                  :class="{ 'faq-chevron--open': isFaqOpen(index) }"
                />
              </button>
              <div
                :id="`${translationKey}-faq-panel-${index}`"
                class="faq-panel"
                :class="{ 'faq-panel--open': isFaqOpen(index) }"
                :aria-hidden="!isFaqOpen(index)"
                :inert="!isFaqOpen(index)"
              >
                <div class="faq-panel__inner">
                  <p class="pt-4 text-muted leading-relaxed">{{ item.answer }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<style scoped>
.faq-chevron {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-chevron--open {
  transform: rotate(180deg);
}

.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-panel__inner {
  min-height: 0;
  overflow: hidden;
}

.faq-panel--open {
  grid-template-rows: 1fr;
}

@media (prefers-reduced-motion: reduce) {
  .faq-chevron,
  .faq-panel {
    transition: none;
  }
}
</style>
