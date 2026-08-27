<script setup lang="ts">
import { ref } from 'vue';
import { Motion } from 'motion-v';
import { useI18n } from 'vue-i18n';

useI18n();

const { motionInitial, motionInView, motionTransition } = useMotionConfig();

const activeStackCard = ref<string | null>(null);

const STACK_SYNERGIES: Record<string, string[]> = {
  vue: [
    'Vue 3',
    'Nuxt 4',
    'TypeScript',
    'Frontend Architecture',
    'State Management',
    'Vite',
    'PrimeVue',
    'Testing (Vitest & Playwright)',
  ],
  ts: [
    'TypeScript',
    'Node.js',
    'REST APIs',
    'PostgreSQL / SQLite',
    'CI/CD Pipelines',
    'Testing (Vitest & Playwright)',
  ],
  js: [
    'JavaScript',
    'TypeScript',
    'Web Performance',
    'Micro-frontends',
    'Monorepos',
    'Design Systems',
    'Code Quality',
  ],
  perf: [
    'Web Performance',
    'Frontend Architecture',
    'Testing (Vitest & Playwright)',
    'Accessibility (a11y)',
    'CI/CD Pipelines',
    'Code Quality',
    'Design Systems',
  ],
  git: [
    'Design Systems',
    'CI/CD Pipelines',
    'Code Quality',
    'Accessibility (a11y)',
    'Frontend Architecture',
  ],
  ai: [
    'LLM & NLP Integration',
    'AI-Augmented Workflows',
    'Agentic Tooling (Cursor, Copilot, Claude)',
    'Code Quality',
  ],
};

function isSkillHighlighted(skill: string): boolean {
  if (!activeStackCard.value) return false;
  return STACK_SYNERGIES[activeStackCard.value]?.includes(skill) ?? false;
}

function onStackHover(id: string | null) {
  activeStackCard.value = id;
}

function onSkillHover(skill: string | null) {
  if (!skill) {
    activeStackCard.value = null;
    return;
  }
  const match = Object.entries(STACK_SYNERGIES).find(([_, list]) => list.includes(skill));
  activeStackCard.value = match ? match[0] : null;
}

const detailedStack = [
  {
    id: 'vue',
    titleKey: 'techStack.cards.vue.title',
    yearsKey: 'techStack.cards.vue.years',
    level: 'techStack.levels.architect',
    icon: 'logos:vue',
    descKey: 'techStack.detailed.vue',
  },
  {
    id: 'ts',
    titleKey: 'techStack.cards.ts.title',
    yearsKey: 'techStack.cards.ts.years',
    level: 'techStack.levels.senior',
    icon: 'logos:typescript-icon',
    descKey: 'techStack.detailed.ts',
  },
  {
    id: 'js',
    titleKey: 'techStack.cards.js.title',
    yearsKey: 'techStack.cards.js.years',
    level: 'techStack.levels.principal',
    icon: 'logos:javascript',
    descKey: 'techStack.detailed.js',
  },
  {
    id: 'perf',
    titleKey: 'techStack.cards.perf.title',
    yearsKey: 'techStack.cards.perf.years',
    level: 'techStack.levels.perf',
    icon: 'solar:layers-minimalistic-bold-duotone',
    descKey: 'techStack.detailed.perf',
  },
  {
    id: 'git',
    titleKey: 'techStack.cards.git.title',
    yearsKey: 'techStack.cards.git.years',
    level: 'techStack.levels.founding',
    icon: 'logos:git-icon',
    descKey: 'techStack.detailed.git',
  },
  {
    id: 'ai',
    titleKey: 'techStack.cards.ai.title',
    yearsKey: 'techStack.cards.ai.years',
    level: 'techStack.levels.ai',
    icon: 'solar:cpu-bolt-bold-duotone',
    descKey: 'techStack.detailed.ai',
  },
];

const skillGroups = [
  {
    categoryKey: 'techStack.categories.core',
    items: ['Vue 3', 'Nuxt 4', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs'],
  },
  {
    categoryKey: 'techStack.categories.architecture',
    items: [
      'Frontend Architecture',
      'Design Systems',
      'Micro-frontends',
      'Monorepos',
      'State Management',
    ],
  },
  {
    categoryKey: 'techStack.categories.engineering',
    items: [
      'Testing (Vitest & Playwright)',
      'CI/CD Pipelines',
      'Web Performance',
      'Accessibility (a11y)',
      'Code Quality',
    ],
  },
  {
    categoryKey: 'techStack.categories.ai',
    items: [
      'LLM & NLP Integration',
      'AI-Augmented Workflows',
      'Agentic Tooling (Cursor, Copilot, Claude)',
    ],
  },
  {
    categoryKey: 'techStack.categories.additional',
    items: ['Angular (v16+)', 'Tailwind CSS', 'PrimeVue', 'Vite', 'PostgreSQL / SQLite'],
  },
];
</script>

<template>
  <section
    id="tech-stack"
    class="py-16 sm:py-20 md:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-background relative overflow-hidden"
  >
    <!-- Kinetic Grid Background -->
    <div
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
    />
    <div
      class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
    />

    <div class="container mx-auto space-y-16 md:space-y-24">
      <Motion
        :initial="motionInitial({ opacity: 0, scale: 0.98, y: 5 }, { opacity: 1, scale: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, scale: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.4 })"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-5 md:space-y-6 group"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
          <p class="type-eyebrow tracking-[0.4em]">
            {{ $t('techStack.section') }}
          </p>
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
        </div>
        <h2
          id="tech-stack-heading"
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-black tracking-tighter leading-[0.95] text-foreground text-balance"
        >
          {{ $t('techStack.title') }}
          <br />
          <span class="text-gradient">{{ $t('techStack.titleHighlight') }}</span>
        </h2>
        <p
          class="text-muted text-base md:text-lg lg:text-xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto text-pretty"
        >
          {{ $t('techStack.description') }}
        </p>
      </Motion>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 items-stretch"
      >
        <Motion
          v-for="(t, i) in detailedStack"
          :key="t.id"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: i * 0.05 })"
          :viewport="{ once: true }"
          class="surface-card surface-evidence group relative p-6 sm:p-7 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl overflow-hidden min-h-0 flex flex-col justify-between cursor-crosshair h-full min-w-0 transition-all duration-300"
          :class="{
            'border-primary! shadow-xl! shadow-primary/20!': activeStackCard === t.id,
          }"
          @mouseenter="onStackHover(t.id)"
          @mouseleave="onStackHover(null)"
        >
          <div
            class="surface-card__blob absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0"
          />

          <div
            class="relative space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 h-full flex flex-col z-10"
          >
            <div class="flex justify-between items-start">
              <div class="tech-card__icon glass shrink-0">
                <Icon :name="t.icon" class="tech-card__glyph shrink-0" />
              </div>
              <div class="flex flex-col items-end gap-0.5 sm:gap-1">
                <span
                  class="surface-card__meta text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-muted"
                  >{{ $t(t.yearsKey) }}</span
                >
                <span class="type-label text-primary">{{ $t('techStack.expertise') }}</span>
              </div>
            </div>

            <div class="space-y-1.5 sm:space-y-2 md:space-y-3">
              <h3
                class="surface-card__title surface-card__title--gradient text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground"
              >
                {{ $t(t.titleKey) }}
              </h3>
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
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-0.5 bg-primary origin-left pointer-events-none"
          />
        </Motion>
      </div>

      <!-- Sub-section Header: Ecosystem & Fluency -->
      <Motion
        :initial="motionInitial({ opacity: 0, y: 15 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.4 })"
        :viewport="{ once: true, amount: 0.2 }"
        class="text-center space-y-4 max-w-3xl mx-auto pt-4 md:pt-8"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-8 sm:w-12 bg-primary/20" />
          <p class="type-eyebrow tracking-[0.3em]">
            {{ $t('techStack.hudEyebrow') }}
          </p>
          <div class="h-px w-8 sm:w-12 bg-primary/20" />
        </div>
        <h3 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
          {{ $t('techStack.hudTitle') }}
        </h3>
        <p class="text-muted text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          {{ $t('techStack.hudSubtitle') }}
        </p>
      </Motion>

      <!-- Stats & Bio HUD -->
      <div class="grid xl:grid-cols-2 gap-6 sm:gap-8 md:gap-12 relative">
        <Motion
          :initial="motionInitial({ opacity: 0, x: -30 }, { opacity: 1, x: 0 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="motionTransition({ duration: 0.42 })"
          :viewport="{ once: true }"
          class="surface-card surface-card--soft group/hud glass p-6 sm:p-8 md:p-10 lg:p-16 rounded-2xl sm:rounded-3xl xl:rounded-4xl border-foreground/5 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 relative overflow-hidden"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none tech-hud-horizontal"
          />

          <div class="flex items-center gap-3 sm:gap-4 md:gap-6 relative z-10">
            <div class="tech-hud__icon glass shrink-0">
              <Icon name="solar:crown-star-bold" class="tech-hud__glyph shrink-0" />
            </div>
            <h3 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">
              {{ $t('techStack.principles') }}
            </h3>
          </div>

          <div class="space-y-6 relative z-10">
            <div v-for="group in skillGroups" :key="group.categoryKey" class="space-y-2">
              <span
                class="type-label text-primary/80 font-bold uppercase tracking-wider text-xs block"
              >
                {{ $t(group.categoryKey) }}
              </span>
              <div class="flex flex-wrap gap-2 md:gap-2.5">
                <span
                  v-for="skill in group.items"
                  :key="skill"
                  class="surface-card__tag text-xs font-bold uppercase tracking-wider text-muted glass px-4 py-2 rounded-lg border-foreground/5 cursor-pointer shadow-xs transition-all duration-300"
                  :class="{
                    'text-primary! bg-primary/20! border-primary/50! scale-105 shadow-md shadow-primary/20 font-black!':
                      isSkillHighlighted(skill),
                  }"
                  @mouseenter="onSkillHover(skill)"
                  @mouseleave="onSkillHover(null)"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>

        <Motion
          :initial="motionInitial({ opacity: 0, x: 30 }, { opacity: 1, x: 0 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="motionTransition({ duration: 0.42, delay: 0.06 })"
          :viewport="{ once: true }"
          class="surface-card surface-card--soft group/hud glass p-6 sm:p-8 md:p-10 lg:p-16 rounded-2xl sm:rounded-3xl xl:rounded-4xl border-foreground/5 flex flex-col justify-between space-y-12 sm:space-y-16 relative overflow-hidden"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none tech-hud-vertical"
          />

          <div class="space-y-8 md:space-y-10 relative z-10">
            <div class="flex items-center gap-4 md:gap-6 relative z-10">
              <div class="tech-hud__icon glass shrink-0">
                <Icon name="solar:global-linear" class="tech-hud__glyph shrink-0" />
              </div>
              <h3 class="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {{ $t('techStack.flow') }}
              </h3>
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

.tech-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem; /* 56px */
  height: 3.5rem;
  border-radius: 1rem;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--background) 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .tech-card__icon {
    width: 4rem; /* 64px */
    height: 4rem;
    border-radius: 1rem;
  }
}

.tech-card__glyph {
  width: 2.25rem; /* 36px */
  height: 2.25rem;
}

@media (min-width: 640px) {
  .tech-card__glyph {
    width: 2.625rem; /* 42px */
    height: 2.625rem;
  }
}

.tech-hud__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem; /* 48px */
  height: 3rem;
  border-radius: 0.75rem;
  color: var(--color-primary);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--background) 24%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .tech-hud__icon {
    width: 3.5rem; /* 56px */
    height: 3.5rem;
    border-radius: 1rem;
  }
}

.tech-hud__glyph {
  width: 1.875rem; /* 30px */
  height: 1.875rem;
}

@media (min-width: 640px) {
  .tech-hud__glyph {
    width: 2.25rem; /* 36px */
    height: 2.25rem;
  }
}
</style>
