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
        :initial="{ opacity: 0, scale: 0.98, y: 5 }"
        :in-view="{ opacity: 1, scale: 1, y: 0 }"
        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 group"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-[2px] w-12 md:w-16 bg-primary/20" />
          <h2
            class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
          >
            {{ $t("techStack.section") }}
          </h2>
          <div class="h-[2px] w-12 md:w-16 bg-primary/20" />
        </div>
        <h3
          class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tighter leading-[0.9] text-foreground"
        >
          {{ $t("techStack.title") }}<br>
          <span class="text-gradient">{{
            $t("techStack.titleHighlight")
          }}</span>
        </h3>
        <p
          class="text-muted text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto px-4 md:px-0"
        >
          {{ $t("techStack.description") }}
        </p>
      </Motion>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-2 md:px-0"
      >
        <Motion
          v-for="(t, i) in detailedStack"
          :key="t.name"
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="group relative glass p-10 md:p-14 rounded-[3rem] border-foreground/5 hover:border-primary/40 transition-all duration-700 hover:shadow-4xl overflow-hidden min-h-[400px] flex flex-col justify-between cursor-crosshair"
        >
          <div
            class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          />

          <div
            class="relative space-y-8 md:space-y-12 h-full flex flex-col z-10"
          >
            <div class="flex justify-between items-start">
              <div
                class="w-16 h-16 md:w-20 md:h-20 glass rounded-2xl md:rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6"
              >
                <Icon :name="t.icon" class="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div class="flex flex-col items-end">
                <span
                  class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors"
                  >{{ t.years }}</span
                >
                <span
                  class="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-primary/60"
                  >Expertise</span
                >
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <h4
                class="text-2xl md:text-3xl font-black tracking-tighter text-foreground group-hover:text-gradient transition-all"
              >
                {{ t.name }}
              </h4>
              <p
                class="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] leading-normal"
              >
                {{ $t(t.level) }}
              </p>
            </div>

            <p
              class="text-sm text-muted font-medium leading-relaxed group-hover:text-foreground transition-colors mt-auto"
            >
              {{ t.desc }}
            </p>
          </div>

          <!-- Subtle Inner Glow on Hover -->
          <div
            class="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
          />
        </Motion>
      </div>

      <!-- Certifications HUD -->
      <div class="grid lg:grid-cols-2 gap-8 md:gap-12 relative px-2 md:px-0">
        <Motion
          :initial="{ opacity: 0, x: -30 }"
          :in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="glass p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] border-foreground/5 space-y-10 md:space-y-12 group/hud relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary/5 opacity-0 group-hover/hud:opacity-40 pointer-events-none tech-hud-horizontal"
          />

          <div class="flex items-center gap-4 md:gap-6 relative z-10">
            <div
              class="w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover/hud:scale-110 transition-transform"
            >
              <Icon name="solar:medal-ribbon-star-linear" class="w-6 h-6" />
            </div>
            <h4
              class="text-2xl md:text-3xl font-black tracking-tight text-foreground"
            >
              {{ $t("techStack.creds") }}
            </h4>
          </div>

          <div class="grid gap-6 md:gap-8 relative z-10">
            <div
              v-for="cert in certifications"
              :key="cert"
              class="flex items-center gap-6 md:gap-8 group/cert cursor-help"
            >
              <div
                class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/20 group-hover/cert:bg-primary transition-all scale-100 group-hover/cert:scale-150 shrink-0 shadow-[0_0_10px_rgba(255,75,92,0.5)]"
              />
              <span
                class="text-base md:text-lg font-bold text-muted group-hover/cert:text-foreground transition-colors"
                >{{ cert }}</span
              >
            </div>
          </div>
        </Motion>

        <Motion
          :initial="{ opacity: 0, x: 30 }"
          :in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="glass p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] border-foreground/5 flex flex-col justify-between space-y-16 group/hud relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary/5 opacity-0 group-hover/hud:opacity-40 pointer-events-none tech-hud-vertical"
          />

          <div class="space-y-8 md:space-y-10 relative z-10">
            <div class="flex items-center gap-4 md:gap-6 relative z-10">
              <div
                class="w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover/hud:rotate-12 transition-transform"
              >
                <Icon name="solar:global-linear" class="w-6 h-6" />
              </div>
              <h4
                class="text-2xl md:text-3xl font-black tracking-tight text-foreground"
              >
                {{ $t("techStack.flow") }}
              </h4>
            </div>
            <div class="flex flex-wrap gap-3 md:gap-4">
              <div
                v-for="lang in languages"
                :key="lang.name"
                class="px-6 py-2.5 md:px-8 md:py-3 glass rounded-xl md:rounded-2xl border-foreground/5 hover:border-primary/40 transition-all cursor-alias active:scale-95 shadow-md"
              >
                <span
                  class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted block mb-1"
                  >{{ lang.level }}</span
                >
                <span class="text-lg md:text-xl font-bold text-foreground">{{
                  lang.name
                }}</span>
              </div>
            </div>
          </div>

          <div
            class="pt-10 md:pt-16 border-t border-foreground/5 relative z-10"
          >
            <p
              class="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-primary mb-4 md:mb-6"
            >
              Foundational Principles
            </p>
            <div class="flex flex-wrap gap-2 md:gap-3">
              <span
                v-for="skill in [
                  'GxP',
                  'POO',
                  'JSDoc',
                  'Clean Code',
                  'SPA/SSR',
                ]"
                :key="skill"
                class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted glass px-4 py-2 rounded-lg md:rounded-xl border-foreground/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-default shadow-sm hover:shadow-primary/10"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";

const detailedStack = [
  {
    name: "Vue & Nuxt",
    years: "8Y+",
    level: "techStack.levels.architect",
    icon: "logos:vue",
    desc: "Lead architect for complex SPA/SSR ecosystems, modular UI systems, and performance tuning.",
  },
  {
    name: "Fullstack TS",
    years: "10Y",
    level: "techStack.levels.senior",
    icon: "logos:typescript-icon",
    desc: "End-to-end type safety from Node.js APIs to sophisticated frontend reactive states.",
  },
  {
    name: "Systems Engineering",
    years: "Principal",
    level: "techStack.levels.principal",
    icon: "logos:javascript",
    desc: "Deep knowledge in software engineering patterns, modularity, and enterprise scalability.",
  },
  {
    name: "Senior Leadership",
    years: "13Y+",
    level: "techStack.levels.founding",
    icon: "logos:git-icon",
    desc: "Mentoring teams, defining technical roadmaps, and optimizing CI/CD velocity.",
  },
];

const certifications = [
  "Advanced Vue Architecture Specialist",
  "Senior Fullstack System Engineering",
  "Enterprise UI/UX Orchestration",
  "Advanced CI/CD Flow & Automation",
];

const languages = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Professional" },
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
