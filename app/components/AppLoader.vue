<template>
  <div
    v-if="visible"
    class="app-loader-splash fixed inset-0 z-1000000 bg-background text-foreground flex flex-col items-center justify-center overflow-hidden"
    aria-busy="true"
    aria-live="polite"
    @animationend="onSplashAnimationEnd"
  >
    <div class="relative z-10 flex flex-col items-center gap-8 md:gap-12">
      <div class="relative group loader-mark">
        <div class="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
          <!-- Decorative only — must not steal LCP from the hero photo -->
          <img
            src="/img/logo-final.svg?v=cg1"
            alt=""
            width="96"
            height="96"
            decoding="async"
            fetchpriority="low"
            aria-hidden="true"
            class="w-full h-full object-contain relative z-10 drop-shadow-2xl"
          />
        </div>
      </div>

      <div class="w-48 md:w-64 space-y-4">
        <div class="h-0.5 w-full bg-foreground/5 rounded-full overflow-hidden relative">
          <div
            class="loader-bar-fill absolute inset-y-0 left-0 bg-primary h-full shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_80%,transparent)]"
          />
        </div>

        <div
          class="flex justify-between items-center type-label text-muted tracking-[0.3em] loader-meta"
        >
          <span>{{ $t('a11y.systemReady') }}</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CSS-driven splash: hides without waiting for Vue hydration / onMounted.
 * That lets the hero claim LCP as soon as the CSS animation finishes.
 */
const visible = ref(true);
const emit = defineEmits<{
  done: [];
}>();

function onSplashAnimationEnd(event: AnimationEvent) {
  // Ignore bubbled child animations (mark / bar / meta).
  if (event.target !== event.currentTarget) return;
  if (event.animationName !== 'app-loader-exit') return;
  if (!visible.value) return;
  visible.value = false;
  emit('done');
}
</script>

<style scoped>
.app-loader-splash {
  /* Start exit on first paint — no JS gate */
  animation: app-loader-exit 0.32s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}

.loader-mark {
  animation: loader-mark-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.loader-bar-fill {
  width: 100%;
  transform: translateX(-100%);
  animation: loader-bar 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.loader-meta {
  animation: loader-meta-in 0.35s ease-out 0.08s both;
}

.animate-pulse-slow {
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes app-loader-exit {
  to {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

@keyframes loader-mark-in {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes loader-bar {
  to {
    transform: translateX(0);
  }
}

@keyframes loader-meta-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@media (prefers-reduced-motion: reduce) {
  .app-loader-splash {
    animation: app-loader-exit 0.01ms linear 0.05s forwards;
  }

  .loader-mark,
  .loader-bar-fill,
  .loader-meta,
  .animate-pulse-slow {
    animation: none;
  }

  .loader-bar-fill {
    transform: none;
  }
}
</style>
