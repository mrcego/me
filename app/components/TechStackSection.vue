<template>
  <section
    id="tech-stack"
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- Kinetic Grid Background -->
    <div
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
    />
    <div
      class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
    />

    <div class="container mx-auto space-y-24 md:space-y-32">
      <Motion
        :initial="motionInitial({ opacity: 0, scale: 0.98, y: 5 })"
        :while-in-view="motionInView({ opacity: 1, scale: 1, y: 0 })"
        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 group"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
          <h2 class="type-eyebrow tracking-[0.4em]">
            {{ $t('techStack.section') }}
          </h2>
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
        </div>
        <h3
          class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tighter leading-[0.9] text-foreground"
        >
          {{ $t('techStack.title') }}
          <br />
          <span class="text-gradient">{{ $t('techStack.titleHighlight') }}</span>
        </h3>
        <p
          class="text-muted text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto px-4 md:px-0"
        >
          {{ $t('techStack.description') }}
        </p>
      </Motion>

      <div
        class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 md:px-0 items-stretch"
      >
        <Motion
          v-for="(t, i) in detailedStack"
          :key="t.name"
          :initial="motionInitial({ opacity: 0, y: 20 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="surface-card group relative glass p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border-foreground/5 overflow-hidden min-h-0 flex flex-col justify-between cursor-crosshair h-full min-w-0"
        >
          <div
            class="surface-card__blob absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0"
          />

          <div
            class="relative space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 h-full flex flex-col z-10"
          >
            <div class="flex justify-between items-start">
              <div
                class="surface-card__icon surface-card__icon--tilt w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 glass rounded-xl sm:rounded-2xl flex items-center justify-center text-primary shadow-2xl shrink-0"
              >
                <Icon :name="t.icon" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div class="flex flex-col items-end gap-0.5 sm:gap-1">
                <span
                  class="surface-card__meta text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-muted"
                  >{{ t.years }}</span
                >
                <span class="type-label text-primary/70">Expertise</span>
              </div>
            </div>

            <div class="space-y-1.5 sm:space-y-2 md:space-y-3">
              <h4
                class="surface-card__title surface-card__title--gradient text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground"
              >
                {{ t.name }}
              </h4>
              <p class="type-meta text-muted leading-normal">
                {{ $t(t.level) }}
              </p>
            </div>

            <p
              class="surface-card__text text-sm sm:text-base text-muted font-medium leading-relaxed"
            >
              {{ $t(t.descKey) }}
            </p>
          </div>

          <!-- Subtle Inner Glow on Hover -->
          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left"
          />
        </Motion>
      </div>

      <!-- Stats & Bio HUD -->
      <div class="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 relative px-2 md:px-0">
        <Motion
          :initial="motionInitial({ opacity: 0, x: -30 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="surface-card surface-card--soft group/hud glass p-6 sm:p-8 md:p-10 lg:p-16 rounded-2xl sm:rounded-[3rem] md:rounded-[4rem] border-foreground/5 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 relative overflow-hidden"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none tech-hud-horizontal"
          />

          <div class="flex items-center gap-3 sm:gap-4 md:gap-6 relative z-10">
            <div
              class="surface-card__icon w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 glass rounded-lg sm:rounded-xl flex items-center justify-center text-primary shrink-0"
            >
              <Icon name="solar:crown-star-bold" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ $t('techStack.principles') }}
            </h4>
          </div>

          <div class="flex flex-wrap gap-2 md:gap-3 relative z-10">
            <span
              v-for="skill in skills"
              :key="skill"
              class="surface-card__tag text-xs md:text-sm font-bold uppercase tracking-wider text-muted glass px-6 py-3 rounded-xl border-foreground/5 cursor-default shadow-sm"
            >
              {{ skill }}
            </span>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>

        <Motion
          :initial="motionInitial({ opacity: 0, x: 30 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="surface-card surface-card--soft group/hud glass p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] border-foreground/5 flex flex-col justify-between space-y-16 relative overflow-hidden"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none tech-hud-vertical"
          />

          <div class="space-y-8 md:space-y-10 relative z-10">
            <div class="flex items-center gap-4 md:gap-6 relative z-10">
              <div
                class="surface-card__icon surface-card__icon--tilt w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 glass rounded-xl flex items-center justify-center text-primary shrink-0"
              >
                <Icon name="solar:global-linear" class="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {{ $t('techStack.flow') }}
              </h4>
            </div>
            <div class="flex flex-wrap gap-3 md:gap-4">
              <div
                class="surface-card surface-card--soft px-6 py-2.5 md:px-8 md:py-3 glass rounded-xl md:rounded-2xl border-foreground/5 cursor-alias active:scale-95 shadow-md"
              >
                <span class="type-label text-muted block mb-1">{{
                  $t('techStack.langList.native')
                }}</span>
                <span class="text-lg md:text-xl font-bold text-foreground">{{
                  $t('techStack.langList.es')
                }}</span>
              </div>
              <div
                class="surface-card surface-card--soft px-6 py-2.5 md:px-8 md:py-3 glass rounded-xl md:rounded-2xl border-foreground/5 cursor-alias active:scale-95 shadow-md"
              >
                <span class="type-label text-muted block mb-1">{{
                  $t('techStack.langList.pro')
                }}</span>
                <span class="text-lg md:text-xl font-bold text-foreground">{{
                  $t('techStack.langList.en')
                }}</span>
              </div>
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
import { useI18n } from 'vue-i18n';

useI18n();

const { motionInitial, motionInView } = useMotionConfig();

const detailedStack = [
  {
    name: 'Vue & Nuxt',
    years: '8Y+',
    level: 'techStack.levels.architect',
    icon: 'logos:vue',
    descKey: 'techStack.detailed.vue',
  },
  {
    name: 'Fullstack TS',
    years: '10Y',
    level: 'techStack.levels.senior',
    icon: 'logos:typescript-icon',
    descKey: 'techStack.detailed.ts',
  },
  {
    name: 'Systems Engineering',
    years: 'Principal',
    level: 'techStack.levels.principal',
    icon: 'logos:javascript',
    descKey: 'techStack.detailed.js',
  },
  {
    name: 'Senior Leadership',
    years: '13Y+',
    level: 'techStack.levels.founding',
    icon: 'logos:git-icon',
    descKey: 'techStack.detailed.git',
  },
];

const skills = [
  'Artificial Intelligence',
  'TypeScript',
  'Tailwind CSS',
  'Monorepo Architecture',
  'Functional Programming',
  'Frontend Architecture',
  'System Design',
  'Testing Strategy',
  'Web Performance',
  'Clean Code',
  'CI/CD Pipelines',
  'State Management',
  'Design Systems',
  'Accessibility',
  'SEO Optimization',
];
</script>

<style scoped>
.tech-hud-horizontal {
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.05) 2px
  );
}

.tech-hud-vertical {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.05) 2px
  );
}
</style>
