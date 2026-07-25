<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { usePrefersReducedMotion } from '~/composables/useMatchMedia';

const canvas = ref<HTMLCanvasElement | null>(null);
const enabled = ref(false);
const prefersReducedMotion = usePrefersReducedMotion();

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationFrameId: number | null = null;
let isPageVisible = true;
let isMobileBudget = false;
let isScrolling = false;
let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;

function refreshMobileBudget() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    isMobileBudget = false;
    return;
  }
  isMobileBudget = window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = canvasWidth;

    if (this.y > canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = canvasHeight;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = `rgba(255, 75, 92, ${this.opacity})`;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

function shouldAnimate() {
  // Pause while scrolling so GPU/CPU budget goes to compositing (resume after idle).
  if (isScrolling) return false;
  return enabled.value && isPageVisible && !prefersReducedMotion.value;
}

function cssSize() {
  return {
    w: window.innerWidth || 1,
    h: window.innerHeight || 1,
  };
}

function initParticles() {
  if (!canvas.value) return;

  const { w: canvasWidth, h: canvasHeight } = cssSize();
  // Desktop: keep ambient dots cheap — line connects live only in HeroParticles.
  const densityDivisor = isMobileBudget ? 42000 : 28000;
  const maxParticles = isMobileBudget ? 16 : 28;
  const particleCount = Math.min(
    maxParticles,
    Math.floor((canvasWidth * canvasHeight) / densityDivisor),
  );

  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvasWidth, canvasHeight));
  }
}

function animate() {
  if (!canvas.value || !ctx) return;

  if (!shouldAnimate()) {
    animationFrameId = null;
    return;
  }

  const { w, h } = cssSize();
  ctx.clearRect(0, 0, w, h);

  particles.forEach((particle) => {
    particle.update(w, h);
    particle.draw(ctx!);
  });

  // Never run O(n²) connects on the full-viewport canvas — HeroParticles owns
  // the line aesthetic in-hero. Dots alone keep ambient motion without long tasks.
  animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animationFrameId !== null) return;
  animationFrameId = requestAnimationFrame(animate);
}

function stopAnimation() {
  if (animationFrameId === null) return;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
}

function handleResize() {
  if (!canvas.value) return;
  setupCanvas();
}

function handleVisibilityChange() {
  isPageVisible = document.visibilityState === 'visible';
  if (isPageVisible && enabled.value) startAnimation();
  else stopAnimation();
}

function handleScrollBudget() {
  // Pause both budgets while scrolling so main-thread/GPU go to compositing.
  const wasScrolling = isScrolling;
  isScrolling = true;
  if (!wasScrolling) stopAnimation();
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
  scrollIdleTimer = setTimeout(
    () => {
      isScrolling = false;
      if (shouldAnimate()) startAnimation();
    },
    isMobileBudget ? 180 : 120,
  );
}

function setupCanvas() {
  if (!canvas.value) return;

  refreshMobileBudget();
  const { w, h } = cssSize();
  // Cap DPR on mobile — full retina canvas + particle fills is wasteful.
  const dpr = isMobileBudget ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  canvas.value.width = Math.floor(w * dpr);
  canvas.value.height = Math.floor(h * dpr);
  canvas.value.style.width = `${w}px`;
  canvas.value.style.height = `${h}px`;
  ctx = canvas.value.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  initParticles();
  if (shouldAnimate()) startAnimation();
}

watch(prefersReducedMotion, (value) => {
  enabled.value = !value;
  if (!enabled.value) {
    stopAnimation();
  } else if (canvas.value && !animationFrameId) {
    setupCanvas();
  }
});

onMounted(() => {
  enabled.value = !prefersReducedMotion.value;
  refreshMobileBudget();
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('scroll', handleScrollBudget, { passive: true });
  if (enabled.value) setupCanvas();
});

onUnmounted(() => {
  stopAnimation();
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('scroll', handleScrollBudget);
});
</script>

<template>
  <div v-if="enabled" class="particles-container" aria-hidden="true">
    <canvas ref="canvas" class="particles-canvas" />
  </div>
</template>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.particles-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
