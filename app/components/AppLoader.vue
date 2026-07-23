<template>
  <Transition name="loader-fade" @after-leave="onAfterLeave">
    <div
      v-if="loading"
      class="fixed inset-0 z-1000000 bg-background text-foreground flex flex-col items-center justify-center overflow-hidden"
    >
      <div class="relative z-10 flex flex-col items-center gap-8 md:gap-12">
        <Motion
          :initial="
            motionInitial(
              { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
              { opacity: 1, scale: 1, filter: 'blur(0px)' },
            )
          "
          :animate="motionAnimate({ opacity: 1, scale: 1, filter: 'blur(0px)' })"
          :transition="{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }"
          class="relative group"
        >
          <!-- Logo Container -->
          <div class="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <!-- Breathing Glow Behind -->
            <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />

            <img
              src="/img/logo-final.svg?v=cg1"
              alt="César Gómez"
              width="128"
              height="128"
              decoding="async"
              class="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
        </Motion>

        <!-- Minimalist Loading Line -->
        <div class="w-48 md:w-64 space-y-4">
          <div class="h-0.5 w-full bg-foreground/5 rounded-full overflow-hidden relative">
            <Motion
              :initial="motionInitial({ x: '-100%' }, { x: '0%' })"
              :animate="motionAnimate({ x: '0%' })"
              :transition="{ duration: 2.5, ease: 'easeInOut' }"
              class="absolute inset-0 bg-primary h-full shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_80%,transparent)]"
            />
          </div>

          <div class="flex justify-between items-center type-label text-muted tracking-[0.3em]">
            <Motion
              :initial="motionInitial({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })"
              :animate="motionAnimate({ opacity: 1, y: 0 })"
              :transition="{ delay: 0.5, duration: 0.8 }"
            >
              System Ready
            </Motion>
            <Motion
              :initial="motionInitial({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })"
              :animate="motionAnimate({ opacity: 1, y: 0 })"
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

<script setup lang="ts">
import { Motion } from 'motion-v';

const { motionInitial, motionAnimate } = useMotionConfig();

defineProps({
  loading: Boolean,
});

const emit = defineEmits<{
  afterLeave: [];
}>();

function onAfterLeave() {
  emit('afterLeave');
}
</script>

<style scoped>
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
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
