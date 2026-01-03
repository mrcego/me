<template>
  <section
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- background grid light -->
    <div
      class="absolute inset-0 z-0 pointer-events-none capability-ambient-glow"
    />

    <div class="container mx-auto space-y-24">
      <Motion
        :initial="{ opacity: 0, y: 5 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <h2
            class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
          >
            Strategic Core
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3 class="text-5xl md:text-8xl font-black tracking-tighter text-white">
          High-Velocity<br />
          <span class="text-gradient">Capabilities.</span>
        </h3>
      </Motion>

      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <Motion
          v-for="(cap, i) in capabilities"
          :key="cap.title"
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="group relative glass p-10 md:p-14 rounded-[3rem] border-white/5 hover:border-primary/40 transition-all duration-700 cursor-pointer overflow-hidden"
        >
          <!-- holographic scanline internal -->
          <div
            class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capability-scanline"
          />

          <div class="relative z-10 space-y-8">
            <div
              class="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-xl"
            >
              <Icon :name="cap.icon" class="w-6 h-6" />
            </div>
            <div class="space-y-4">
              <h4
                class="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors"
              >
                {{ cap.title }}
              </h4>
              <p
                class="text-slate-400 text-sm md:text-base leading-relaxed font-medium"
              >
                {{ cap.desc }}
              </p>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";

const capabilities = [
  {
    title: "Frontend Systems",
    desc: "Enterprise-grade Vue & Nuxt architectures focused on scalability, performance, and impact.",
    icon: "solar:monitor-camera-bold-duotone",
  },
  {
    title: "Fullstack Logic",
    desc: "Robust backend foundations using Node.js, ensuring 100% type safety and technical resilience.",
    icon: "solar:server-bold-duotone",
  },
  {
    title: "DevOps Flow",
    desc: "Expert CI/CD orchestration and automated pipelines that reduce friction and boost velocity.",
    icon: "solar:tuning-square-2-bold-duotone",
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
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 75, 92, 0.03),
    transparent
  );
}
</style>
