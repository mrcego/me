<template>
  <section
    id="faq"
    class="py-20 md:py-28 px-6 md:px-12 bg-secondary/5 border-t border-foreground/5"
    aria-labelledby="faq-heading"
  >
    <div class="container mx-auto max-w-4xl space-y-10 md:space-y-12">
      <header class="space-y-4 text-center">
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <p class="type-eyebrow tracking-[0.4em]">
            {{ $t('faq.section') }}
          </p>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h2
          id="faq-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground text-balance"
        >
          {{ $t('faq.title') }}
        </h2>
        <p class="text-muted text-base md:text-lg font-medium leading-relaxed text-pretty">
          {{ $t('faq.description') }}
        </p>
      </header>

      <dl class="space-y-4 md:space-y-5">
        <div
          v-for="(item, index) in faqItems"
          :key="item.key ?? index"
          class="surface-card glass rounded-2xl md:rounded-3xl border border-foreground/5 p-5 md:p-6 overflow-hidden"
        >
          <dt class="text-base md:text-lg font-bold text-foreground text-pretty">
            {{ item.question }}
          </dt>
          <dd class="mt-3 text-base md:text-lg text-muted leading-relaxed text-pretty">
            <I18nT
              v-if="item.key === 'contact'"
              keypath="faq.contact.answer"
              tag="span"
              scope="global"
            >
              <template #form>
                <NuxtLink :to="contactFormTo" :class="faqLinkClass">{{
                  $t('faq.contact.linkForm')
                }}</NuxtLink>
              </template>
              <template #linkedin>
                <a
                  href="https://www.linkedin.com/in/mrcego"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="faqLinkClass"
                  >LinkedIn</a
                >
              </template>
              <template #github>
                <a
                  href="https://github.com/mrcego"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="faqLinkClass"
                  >GitHub</a
                >
              </template>
            </I18nT>
            <I18nT
              v-else-if="item.key === 'hire'"
              keypath="faq.hire.answer"
              tag="span"
              scope="global"
            >
              <template #portfolio>
                <NuxtLink :to="homeTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkPortfolio')
                }}</NuxtLink>
              </template>
              <template #vueProfile>
                <NuxtLink :to="vueProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkVueProfile')
                }}</NuxtLink>
              </template>
              <template #aiProfile>
                <NuxtLink :to="aiProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkAiProfile')
                }}</NuxtLink>
              </template>
              <template #nodeProfile>
                <NuxtLink :to="nodeProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkNodeProfile')
                }}</NuxtLink>
              </template>
              <template #form>
                <NuxtLink :to="contactFormTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkForm')
                }}</NuxtLink>
              </template>
              <template #linkedin>
                <a
                  href="https://www.linkedin.com/in/mrcego"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="faqLinkClass"
                  >LinkedIn</a
                >
              </template>
              <template #github>
                <a
                  href="https://github.com/mrcego"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="faqLinkClass"
                  >GitHub</a
                >
              </template>
            </I18nT>
            <span v-else>{{ item.answer }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { I18nT } from 'vue-i18n';

const faqItems = useFaqItems();
const localePath = useLocalePath();

const homeTo = computed(() => localePath('/'));
const vueProfileTo = computed(() => localePath('/vue-frontend-developer'));
const aiProfileTo = computed(() => localePath('/ai-engineer'));
const nodeProfileTo = computed(() => localePath('/nodejs-backend-developer'));
const contactFormTo = computed(() => ({
  path: localePath('/'),
  hash: '#contact',
}));

const faqLinkClass =
  'text-primary underline underline-offset-2 decoration-primary/40 hover:text-foreground hover:decoration-foreground/50 transition-colors font-medium';
</script>
