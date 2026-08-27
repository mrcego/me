<script setup lang="ts">
import { Motion } from 'motion-v';
import type { HireProfileId } from '~/config/routes.manifest';
import { PORTFOLIO_ROUTES, hireProfileRoutes } from '~/config/routes.manifest';

const localePath = useLocalePath();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();
const { showAnnouncement } = useAvailability();

const BLURB_KEYS: Record<HireProfileId, string> = {
  vue: 'hireProfiles.vueBlurb',
  node: 'hireProfiles.nodeBlurb',
  ai: 'hireProfiles.aiBlurb',
  angular: 'hireProfiles.angularBlurb',
  architect: 'hireProfiles.architectBlurb',
  fullstack: 'hireProfiles.fullstackBlurb',
};

const PROFILE_TAGS: Record<HireProfileId, string[]> = {
  architect: ['13+ YOE', 'SYSTEM DESIGN', 'PERF 100'],
  vue: ['VUE 3 / NUXT 4', 'SSR / SSG', 'STATE & ARCH'],
  fullstack: ['NODE / NITRO', 'POSTGRES / DB', 'REST & GRAPHQL'],
  ai: ['AI-AUGMENTED', 'AGENTIC WORKFLOW', 'QUALITY GATES'],
  node: ['NITRO / H3', 'MICROSERVICES', 'PERF TUNING'],
  angular: ['ANGULAR MIGRATION', 'RXJS / NGXS', 'ENTERPRISE'],
};

const profiles = hireProfileRoutes().map((link) => ({
  key: link.id,
  titleKey: link.hireLabelKey,
  blurbKey: BLURB_KEYS[link.id],
  tags: PROFILE_TAGS[link.id] ?? [],
  icon: link.hireIcon,
  to: link.localePath,
}));

const craftMethodologyTo =
  PORTFOLIO_ROUTES.find((route) => route.id === 'craft')?.localePath ?? '/ai-assisted-craft';
</script>

<template>
  <section
    id="hire-profiles"
    class="py-16 sm:py-20 md:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-secondary/5 border-y border-foreground/5"
    aria-labelledby="hire-profiles-heading"
  >
    <div class="container mx-auto space-y-10 md:space-y-14">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.4 })"
        :viewport="{ once: true }"
        class="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <p class="type-eyebrow tracking-[0.4em]">{{ $t('hireProfiles.section') }}</p>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h2
          id="hire-profiles-heading"
          class="text-3xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl font-black tracking-tighter leading-tight text-foreground text-balance"
        >
          {{ $t('hireProfiles.title') }}
          <span class="text-gradient">{{ $t('hireProfiles.titleHighlight') }}</span>
        </h2>
        <p class="text-muted text-base md:text-lg font-medium leading-relaxed text-pretty">
          {{ $t('hireProfiles.lead') }}
        </p>
      </Motion>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        <Motion
          v-for="(profile, index) in profiles"
          :key="profile.key"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: index * 0.05 })"
          :viewport="{ once: true }"
        >
          <NuxtLink
            :to="localePath(profile.to)"
            class="surface-card glass group relative flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-foreground/5 p-5 sm:p-6 md:p-7 transition-all duration-300 hover:border-primary/30 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <!-- holographic scanline hover animation -->
            <div
              class="absolute inset-0 bg-linear-to-tr from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[0.85s] pointer-events-none"
              style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
              aria-hidden="true"
            />

            <div class="relative z-10 flex flex-col h-full gap-5">
              <div class="flex items-center justify-between gap-3">
                <CoreIconBadge
                  :name="profile.icon"
                  size="xl"
                  class="transition-transform group-hover:scale-105"
                />
                <span
                  v-if="showAnnouncement"
                  class="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 px-2 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20"
                >
                  {{ $t('hireProfiles.availableLead') }}
                </span>
              </div>
              <div class="space-y-3 flex-1">
                <h3 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {{ $t(profile.titleKey) }}
                </h3>
                <p class="text-muted leading-relaxed text-sm md:text-base">
                  {{ $t(profile.blurbKey) }}
                </p>

                <!-- Quick-fit skill chips -->
                <div class="flex flex-wrap gap-1.5 pt-2">
                  <span
                    v-for="tag in profile.tags"
                    :key="tag"
                    class="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-foreground/5 text-muted group-hover:text-primary group-hover:bg-primary/10 border border-foreground/5 group-hover:border-primary/20 transition-colors"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="pt-2">
                <span
                  class="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-primary glass px-4 py-2.5 rounded-xl border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-background group-hover:shadow-lg transition-all duration-300"
                >
                  {{ $t('hireProfiles.viewProfile') }}
                  <Icon
                    name="solar:arrow-right-linear"
                    class="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </NuxtLink>
        </Motion>
      </div>

      <p class="text-center text-sm md:text-base text-muted">
        <NuxtLink
          :to="localePath(craftMethodologyTo)"
          class="inline-flex items-center gap-2 font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors"
        >
          {{ $t('hireProfiles.craftMethodology') }}
          <Icon name="solar:arrow-right-linear" class="size-4" />
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.hire-profile__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem; /* 72px */
  height: 4.5rem;
  border-radius: 1rem;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--background) 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .hire-profile__icon {
    width: 5.25rem; /* 84px */
    height: 5.25rem;
    border-radius: 1.5rem;
  }
}

@media (min-width: 768px) {
  .hire-profile__icon {
    width: 6rem; /* 96px */
    height: 6rem;
  }
}

.hire-profile__glyph {
  width: 3rem; /* 48px */
  height: 3rem;
}

@media (min-width: 640px) {
  .hire-profile__glyph {
    width: 3.5rem; /* 56px */
    height: 3.5rem;
  }
}

@media (min-width: 768px) {
  .hire-profile__glyph {
    width: 4rem; /* 64px */
    height: 4rem;
  }
}
</style>
