<template>
  <section
    id="capabilities"
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- background grid light -->
    <div class="absolute inset-0 z-0 pointer-events-none capability-ambient-glow" />

    <div class="container mx-auto space-y-24">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <h2 class="type-eyebrow tracking-[0.4em]">
            {{ $t('capabilities.section') }}
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3 class="text-5xl md:text-8xl font-black tracking-tighter text-foreground">
          {{ $t('capabilities.title') }}<br />
          <span class="text-gradient">{{ $t('capabilities.titleHighlight') }}</span>
        </h3>
      </Motion>

      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-12 items-stretch"
      >
        <Motion
          v-for="(cap, i) in capabilities"
          :key="cap.key"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="surface-card group relative glass p-6 sm:p-8 md:p-10 lg:p-14 rounded-2xl sm:rounded-[3rem] border-foreground/5 cursor-pointer overflow-hidden h-full"
        >
          <!-- holographic scanline internal -->
          <div
            class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none capability-scanline"
          />

          <div
            class="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 h-full flex flex-col justify-center items-center text-center"
          >
            <div
              class="surface-card__icon surface-card__icon--tilt w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 glass rounded-xl sm:rounded-2xl flex items-center justify-center text-primary shadow-xl"
            >
              <Icon :name="cap.icon" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
            <div class="space-y-3 sm:space-y-4 max-w-xs mx-auto">
              <h4
                class="surface-card__title text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground"
              >
                {{ $t(`capabilities.items.${cap.key}.title`) }}
              </h4>
              <p
                class="surface-card__text text-muted text-base sm:text-lg leading-relaxed font-medium"
              >
                {{ $t(`capabilities.items.${cap.key}.desc`) }}
              </p>
            </div>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from 'motion-v';

const { motionInitial, motionInView } = useMotionConfig();

const capabilities = [
  {
    key: 'frontend',
    icon: 'solar:rocket-bold-duotone',
  },
  {
    key: 'fullstack',
    icon: 'solar:database-bold-duotone',
  },
  {
    key: 'devops',
    icon: 'solar:shield-check-bold-duotone',
  },
  {
    key: 'vibeCoding',
    icon: 'solar:magic-stick-3-bold-duotone',
  },
];
</script>

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
</style>
