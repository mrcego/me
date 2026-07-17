<script setup lang="ts">
import { Motion } from 'motion-v';

const localePath = useLocalePath();
const { motionInitial, motionInView } = useMotionConfig();

const profiles = [
  {
    key: 'vue',
    titleKey: 'hireProfiles.hireForVue',
    blurbKey: 'hireProfiles.vueBlurb',
    icon: 'logos:vue',
    to: '/vue-frontend-developer',
  },
  {
    key: 'node',
    titleKey: 'hireProfiles.hireForNode',
    blurbKey: 'hireProfiles.nodeBlurb',
    icon: 'logos:nodejs-icon',
    to: '/nodejs-backend-developer',
  },
  {
    key: 'ai',
    titleKey: 'hireProfiles.hireForAi',
    blurbKey: 'hireProfiles.aiBlurb',
    icon: 'solar:cpu-bolt-bold-duotone',
    to: '/ai-engineer',
  },
] as const;
</script>

<template>
  <section
    id="hire-profiles"
    class="py-20 md:py-28 px-6 md:px-12 bg-secondary/5 border-y border-foreground/5"
    aria-labelledby="hire-profiles-heading"
  >
    <div class="container mx-auto max-w-6xl space-y-10 md:space-y-14">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
        :viewport="{ once: true }"
        class="max-w-3xl mx-auto text-center space-y-5"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <p class="type-eyebrow tracking-[0.4em]">{{ $t('hireProfiles.section') }}</p>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h2
          id="hire-profiles-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground text-balance"
        >
          {{ $t('hireProfiles.title') }}
          <span class="text-gradient">{{ $t('hireProfiles.titleHighlight') }}</span>
        </h2>
        <p class="text-muted text-base md:text-lg font-medium leading-relaxed text-pretty">
          {{ $t('hireProfiles.lead') }}
        </p>
      </Motion>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <Motion
          v-for="(profile, index) in profiles"
          :key="profile.key"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="{
            duration: 0.55,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
        >
          <NuxtLink
            :to="localePath(profile.to)"
            class="surface-card glass group flex h-full flex-col gap-5 rounded-3xl border border-foreground/5 p-6 md:p-8 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <div
              class="flex size-14 items-center justify-center rounded-2xl glass text-primary shadow-lg shadow-primary/10"
            >
              <Icon :name="profile.icon" class="size-8" />
            </div>
            <div class="space-y-3 flex-1">
              <h3 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {{ $t(profile.titleKey) }}
              </h3>
              <p class="text-muted leading-relaxed">{{ $t(profile.blurbKey) }}</p>
            </div>
            <span
              class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all"
            >
              {{ $t('hireProfiles.viewProfile') }}
              <Icon name="solar:arrow-right-linear" class="size-5" />
            </span>
          </NuxtLink>
        </Motion>
      </div>
    </div>
  </section>
</template>
