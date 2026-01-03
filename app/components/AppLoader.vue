<template>
  <Transition name="loader-fade">
    <div
      v-if="loading"
      class="fixed inset-0 z-1000000 bg-background text-white flex flex-col items-center justify-center overflow-hidden"
    >
      <!-- Subtle ambient background -->
      <div
        class="absolute inset-0 opacity-20 pointer-events-none loader-ambient-bg"
      />

      <div class="relative z-10 flex flex-col items-center gap-8 md:gap-12">
        <Motion
          :initial="{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :transition="{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }"
          class="relative group"
        >
          <!-- Logo Container -->
          <div
            class="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
          >
            <!-- Breathing Glow Behind -->
            <div
              class="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow"
            />

            <NuxtImg
              src="/img/logo.png"
              alt="CÃ©sar GÃ³mez"
              class="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
        </Motion>

        <!-- Minimalist Loading Line -->
        <div class="w-48 md:w-64 space-y-4">
          <div
            class="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative"
          >
            <Motion
              :initial="{ x: '-100%' }"
              :animate="{ x: '0%' }"
              :transition="{ duration: 2.5, ease: 'easeInOut' }"
              class="absolute inset-0 bg-primary h-full shadow-[0_0_10px_rgba(255,75,92,0.8)]"
            />
          </div>

          <div
            class="flex justify-between items-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-500"
          >
            <Motion
              :initial="{ opacity: 0, y: 5 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.5, duration: 0.8 }"
            >
              System Ready
            </Motion>
            <Motion
              :initial="{ opacity: 0, y: 5 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.7, duration: 0.8 }"
            >
              100%
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Motion } from "motion-v";

defineProps({
  loading: Boolean,
});
</script>

<style scoped>
.loader-ambient-bg {
  background: radial-gradient(
    circle at center,
    rgba(255, 75, 92, 0.15) 0%,
    transparent 60%
  );
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.animate-pulse-slow {
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>

