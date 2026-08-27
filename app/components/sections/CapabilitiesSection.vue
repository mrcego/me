<script setup lang="ts">
import { Motion } from 'motion-v';

const localePath = useLocalePath();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();

const capabilities = [
  {
    key: 'frontend',
    icon: 'solar:rocket-bold-duotone',
    to: '/vue-frontend-developer',
    linkLabelKey: 'hireProfiles.hireForVue',
  },
  {
    key: 'fullstack',
    icon: 'solar:database-bold-duotone',
    to: '/nodejs-backend-developer',
    linkLabelKey: 'hireProfiles.hireForNode',
  },
  {
    key: 'devops',
    icon: 'solar:shield-check-bold-duotone',
  },
  {
    key: 'vibeCoding',
    icon: 'solar:magic-stick-3-bold-duotone',
    to: '/ai-assisted-craft',
    linkLabelKey: 'hireProfiles.hireForAi',
  },
];
</script>

<template>
  <section
    id="capabilities"
    class="py-16 sm:py-20 md:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-background relative overflow-hidden"
  >
    <!-- background grid light -->
    <div class="absolute inset-0 z-0 pointer-events-none capability-ambient-glow" />

    <div class="container mx-auto space-y-12 md:space-y-16">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.4 })"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto"
      >
        <AppSectionHeader
          :eyebrow="$t('capabilities.section')"
          :title="$t('capabilities.title')"
          :highlight="$t('capabilities.titleHighlight')"
          align="center"
        />
      </Motion>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
        <Motion
          v-for="(cap, i) in capabilities"
          :key="cap.key"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: i * 0.05 })"
          :viewport="{ once: true }"
          class="h-full"
        >
          <AppSurface
            variant="glass"
            rounded="3xl"
            class="surface-card group relative p-6 sm:p-7 md:p-8 lg:p-10 border-foreground/5 overflow-hidden h-full"
          >
            <!-- holographic scanline internal -->
            <div
              class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none capability-scanline"
            />

            <div
              class="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 h-full flex flex-col justify-center items-center text-center"
            >
              <CoreIconBadge
                :name="cap.icon"
                size="xl"
                tilt
                class="transition-transform group-hover:scale-110"
              />
              <div class="space-y-3 sm:space-y-4 max-w-md mx-auto">
                <h3
                  class="surface-card__title text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground"
                >
                  {{ $t(`capabilities.items.${cap.key}.title`) }}
                </h3>
                <p
                  class="surface-card__text text-muted text-base sm:text-lg leading-relaxed font-medium"
                >
                  {{ $t(`capabilities.items.${cap.key}.desc`) }}
                </p>
                <CoreCtaLink v-if="cap.to && cap.linkLabelKey" :to="localePath(cap.to)" @click.stop>
                  {{ $t(cap.linkLabelKey) }}
                </CoreCtaLink>
              </div>
            </div>

            <div
              class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
            />
          </AppSurface>
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
.capability-scanline {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.03) 2px
  );
}

.capability-ambient-glow {
  background: radial-gradient(circle at 50% 0%, rgba(255, 75, 92, 0.03), transparent);
}

.capability-icon {
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
  .capability-icon {
    width: 5rem; /* 80px */
    height: 5rem;
    border-radius: 1.5rem;
  }
}

@media (min-width: 768px) {
  .capability-icon {
    width: 5.75rem; /* 92px */
    height: 5.75rem;
  }
}

.capability-glyph {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
}

@media (min-width: 640px) {
  .capability-glyph {
    width: 3.25rem; /* 52px */
    height: 3.25rem;
  }
}

@media (min-width: 768px) {
  .capability-glyph {
    width: 3.75rem; /* 60px */
    height: 3.75rem;
  }
}
</style>
