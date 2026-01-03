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
            {{ $t("capabilities.section") }}
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3
          class="text-5xl md:text-8xl font-black tracking-tighter text-foreground"
        >
          {{ $t("capabilities.title") }}<br />
          <span class="text-gradient">{{
            $t("capabilities.titleHighlight")
          }}</span>
        </h3>
      </Motion>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12"
      >
        <Motion
          v-for="(cap, i) in capabilities"
          :key="cap.key"
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="group relative glass p-6 sm:p-8 md:p-10 lg:p-14 rounded-2xl sm:rounded-[3rem] border-foreground/5 hover:border-primary/40 transition-all duration-700 cursor-pointer overflow-hidden"
        >
          <!-- holographic scanline internal -->
          <div
            class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capability-scanline"
          />

          <div
            class="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 h-full flex flex-col justify-center items-center text-center"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 glass rounded-xl sm:rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-contrast group-hover:rotate-6 transition-all duration-500 shadow-xl"
            >
              <Icon
                :name="cap.icon"
                class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              />
            </div>
            <div class="space-y-3 sm:space-y-4 max-w-xs mx-auto">
              <h4
                class="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors"
              >
                {{ $t(`capabilities.items.${cap.key}.title`) }}
              </h4>
              <p
                class="text-muted text-sm sm:text-base md:text-base leading-relaxed font-medium"
              >
                {{ $t(`capabilities.items.${cap.key}.desc`) }}
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
    key: "frontend",
    icon: "solar:rocket-bold-duotone",
  },
  {
    key: "fullstack",
    icon: "solar:database-bold-duotone",
  },
  {
    key: "devops",
    icon: "solar:shield-check-bold-duotone",
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
