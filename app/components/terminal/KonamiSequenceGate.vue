<script setup lang="ts">
import { Motion } from 'motion-v';
import type {
  KonamiGatePhase,
  KonamiRevealedKey,
} from '~/composables/usePortfolioTerminalShortcut';

const props = defineProps<{
  phase: KonamiGatePhase;
  keys: KonamiRevealedKey[];
  progress: number;
  total: number;
  announce: string;
}>();

const { motionEnabled, motionTransition } = useMotionConfig();
const prefersReduced = usePrefersReducedMotion();

const showGate = computed(() => props.phase !== 'idle');
const slashArmed = computed(
  () => props.phase === 'armed' || props.phase === 'progress' || props.phase === 'unlocked',
);

const statusLabel = computed(() => {
  if (props.phase === 'unlocked') return 'terminal.gate.unlockedLabel';
  if (props.phase === 'failed') return 'terminal.gate.resetLabel';
  return 'terminal.gate.label';
});

const ticks = computed(() =>
  Array.from({ length: props.total }, (_, index) => ({
    id: `tick-${index}`,
    filled: index < props.progress,
  })),
);

function fallOffset(index: number) {
  const x = ((index * 37) % 11) - 5;
  const rotate = ((index * 23) % 17) - 8;
  return { x: x * 14, rotate: rotate * 8, delay: index * 0.03 };
}

function keyAnimate(_key: KonamiRevealedKey, index: number) {
  if (props.phase === 'failed') {
    if (prefersReduced.value || !motionEnabled.value) {
      return { opacity: 0, y: 0, rotate: 0, scale: 1 };
    }
    const drift = fallOffset(index);
    return {
      opacity: 0,
      y: 420,
      x: drift.x,
      rotate: drift.rotate,
      scale: 0.85,
    };
  }
  if (props.phase === 'unlocked') {
    if (prefersReduced.value || !motionEnabled.value) {
      return { opacity: 0, scale: 1, y: 0 };
    }
    return { opacity: 0, scale: 0.85, y: -8 };
  }
  return { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 };
}

function keyTransition(index: number) {
  if (props.phase === 'failed') {
    if (prefersReduced.value || !motionEnabled.value) return { duration: 0 };
    const drift = fallOffset(index);
    return {
      duration: 0.7,
      delay: drift.delay,
      ease: [0.33, 1, 0.45, 1] as const,
    };
  }
  if (props.phase === 'unlocked') {
    return motionTransition({ duration: 0.28 });
  }
  return motionTransition({ duration: 0.16 });
}

const reduceMotion = computed(() => prefersReduced.value || !motionEnabled.value);
</script>

<template>
  <div v-if="showGate" class="konami-gate" aria-hidden="true">
    <div class="sr-only" aria-live="polite">{{ announce }}</div>

    <div class="konami-gate__panel glass-lite">
      <div
        class="konami-gate__slash"
        :class="{ 'konami-gate__slash--armed': slashArmed }"
        data-armed="/"
      >
        /
      </div>

      <p class="konami-gate__status type-label">
        <template v-if="phase === 'unlocked'">{{ $t(statusLabel) }}</template>
        <template v-else-if="phase === 'failed'">{{ $t(statusLabel) }}</template>
        <template v-else>
          {{ $t('terminal.gate.label', { current: progress, total }) }}
        </template>
      </p>

      <div class="konami-gate__ticks" aria-hidden="true">
        <span
          v-for="tick in ticks"
          :key="tick.id"
          class="konami-gate__tick"
          :class="{ 'konami-gate__tick--filled': tick.filled }"
        />
      </div>

      <div class="konami-gate__rail" :class="{ 'konami-gate__rail--burning': phase === 'failed' }">
        <Motion
          v-for="(key, index) in keys"
          :key="key.id"
          class="konami-keycap"
          :class="{
            'konami-keycap--ok': key.kind === 'ok',
            'konami-keycap--error': key.kind === 'error',
            'konami-keycap--burn': phase === 'failed',
          }"
          :initial="
            reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 8, scale: 0.96 }
          "
          :animate="keyAnimate(key, index)"
          :transition="keyTransition(index)"
        >
          <span class="konami-keycap__face">
            <span class="konami-keycap__label">{{ key.label }}</span>
          </span>
          <span v-if="phase === 'failed'" class="konami-keycap__flame" />
        </Motion>
      </div>
    </div>
  </div>
</template>
