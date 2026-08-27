<script setup lang="ts">
import { computed } from 'vue';
import { I18nT } from 'vue-i18n';

const faqItems = useFaqItems();
const localePath = useLocalePath();

const homeTo = computed(() => localePath('/'));
const vueProfileTo = computed(() => localePath('/vue-frontend-developer'));
const aiProfileTo = computed(() => localePath('/ai-assisted-craft'));
const nodeProfileTo = computed(() => localePath('/nodejs-backend-developer'));
const angularProfileTo = computed(() => localePath('/angular-developer'));
const architectProfileTo = computed(() => localePath('/frontend-architect'));
const fullstackProfileTo = computed(() => localePath('/fullstack-engineer'));
const contactFormTo = computed(() => ({
  path: localePath('/'),
  hash: '#contact',
}));

const faqLinkClass =
  'text-primary underline underline-offset-2 decoration-primary/40 hover:text-foreground hover:decoration-foreground/50 transition-colors font-medium';
</script>

<template>
  <section
    id="faq"
    class="py-16 sm:py-20 md:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-secondary/5 border-t border-foreground/5"
    aria-labelledby="faq-heading"
  >
    <div class="container mx-auto max-w-4xl space-y-8 sm:space-y-10 md:space-y-12">
      <AppSectionHeader
        :eyebrow="$t('faq.section')"
        :title="$t('faq.title')"
        :description="$t('faq.description')"
        align="center"
      />

      <dl class="space-y-4 md:space-y-5">
        <AppSurface
          v-for="(item, index) in faqItems"
          :key="item.key ?? index"
          as="div"
          variant="glass"
          rounded="3xl"
          class="surface-card border border-foreground/5 p-5 md:p-6 overflow-hidden"
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
              <template #angularProfile>
                <NuxtLink :to="angularProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkAngularProfile')
                }}</NuxtLink>
              </template>
              <template #architectProfile>
                <NuxtLink :to="architectProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkArchitectProfile')
                }}</NuxtLink>
              </template>
              <template #fullstackProfile>
                <NuxtLink :to="fullstackProfileTo" :class="faqLinkClass">{{
                  $t('faq.hire.linkFullstackProfile')
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
        </AppSurface>
      </dl>
    </div>
  </section>
</template>
