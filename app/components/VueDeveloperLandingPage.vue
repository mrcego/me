<template>
  <main id="main-content" class="portfolio-content relative" tabindex="-1">
    <section class="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div class="container mx-auto max-w-5xl space-y-10 md:space-y-14">
        <div class="space-y-6 md:space-y-8 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-4">
            <div class="h-0.5 w-10 bg-primary/30" />
            <p class="type-eyebrow tracking-[0.35em]">{{ $t('landingVue.eyebrow') }}</p>
          </div>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-balance"
          >
            {{ $t('landingVue.title') }}
            <span class="text-gradient block md:inline">{{ $t('landingVue.titleHighlight') }}</span>
          </h1>

          <p
            class="text-lg md:text-xl lg:text-2xl text-muted font-medium leading-relaxed max-w-3xl"
          >
            {{ $t('landingVue.lead') }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              class="btn-premium bg-primary text-primary-contrast rounded-2xl! px-8! py-4! border-none!"
              as="a"
              :href="contactHref"
            >
              <Icon name="solar:letter-bold-duotone" class="w-6 h-6" />
              {{ $t('landingVue.contactCta') }}
            </Button>
            <NuxtLink
              :to="localePath('/')"
              class="btn-premium glass rounded-2xl! px-8! py-4! border border-foreground/10! inline-flex items-center justify-center gap-3 font-black uppercase tracking-widest"
            >
              <Icon name="solar:arrow-left-linear" class="w-6 h-6" />
              {{ $t('landingVue.portfolioCta') }}
            </NuxtLink>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 md:gap-8">
          <article class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-5">
            <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ $t('landingVue.expertiseTitle') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in expertiseItems"
                :key="index"
                class="flex gap-3 text-muted leading-relaxed"
              >
                <Icon name="lucide:check-circle-2" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>

          <article class="surface-card glass rounded-3xl border-foreground/5 p-6 md:p-8 space-y-5">
            <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ $t('landingVue.experienceTitle') }}
            </h2>
            <p class="text-muted leading-relaxed">{{ $t('landingVue.experienceBody') }}</p>
            <h3 class="type-eyebrow tracking-[0.3em]">{{ $t('landingVue.proofTitle') }}</h3>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in proofItems"
                :key="index"
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
            {{ $t('landingVue.faqTitle') }}
          </h2>
          <div class="grid gap-4">
            <details
              v-for="(item, index) in faqItems"
              :key="index"
              class="surface-card glass rounded-2xl border-foreground/5 p-5 md:p-6 group"
            >
              <summary
                class="cursor-pointer list-none font-bold text-foreground tracking-tight flex items-center justify-between gap-4"
              >
                {{ item.question }}
                <Icon
                  name="lucide:chevron-down"
                  class="w-5 h-5 text-primary transition-transform group-open:rotate-180"
                />
              </summary>
              <p class="mt-4 text-muted leading-relaxed">{{ item.answer }}</p>
            </details>
          </div>
        </section>
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const localePath = useLocalePath();

const contactHref = computed(() => `${localePath('/')}#contact`);

const expertiseItems = computed(() => {
  const data = tm('landingVue.expertise') as unknown;
  return Array.isArray(data) ? data.map((item) => rt(item)) : [];
});

const proofItems = computed(() => {
  const data = tm('landingVue.proof') as unknown;
  return Array.isArray(data) ? data.map((item) => rt(item)) : [];
});

const faqItems = computed(() => {
  const data = tm('landingVue.faq') as Array<{ question: unknown; answer: unknown }> | unknown;
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    question: rt(item.question),
    answer: rt(item.answer),
  }));
});
</script>
