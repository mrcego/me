<template>
  <div v-if="enabled" class="particles-container" aria-hidden="true">
    <canvas ref="canvas" class="particles-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { usePreferredReducedMotion } from '@vueuse/core';

const canvas = ref<HTMLCanvasElement | null>(null);
const enabled = ref(false);
const prefersReducedMotion = usePreferredReducedMotion();

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationFrameId: number | null = null;
let isPageVisible = true;

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
  return enabled.value && isPageVisible && prefersReducedMotion.value !== 'reduce';
}

function initParticles() {
  if (!canvas.value) return;

  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const particleCount = Math.min(40, Math.floor((canvasWidth * canvasHeight) / 18000));

  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvasWidth, canvasHeight));
  }
}

function connectParticles() {
  if (!ctx) return;

  const maxDistance = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      if (!a || !b) continue;

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.1;
        ctx.strokeStyle = `rgba(255, 75, 92, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  if (!canvas.value || !ctx) return;

  if (!shouldAnimate()) {
    animationFrameId = null;
    return;
  }

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  particles.forEach((particle) => {
    particle.update(canvas.value!.width, canvas.value!.height);
    particle.draw(ctx!);
  });

  connectParticles();

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

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  initParticles();
}

function handleVisibilityChange() {
  isPageVisible = document.visibilityState === 'visible';
  if (isPageVisible && enabled.value) startAnimation();
  else stopAnimation();
}

function setupCanvas() {
  if (!canvas.value) return;

  ctx = canvas.value.getContext('2d');
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  initParticles();
  startAnimation();
}

watch(prefersReducedMotion, (value) => {
  enabled.value = value !== 'reduce';
  if (!enabled.value) {
    stopAnimation();
  } else if (canvas.value && !animationFrameId) {
    setupCanvas();
  }
});

onMounted(() => {
  enabled.value = prefersReducedMotion.value !== 'reduce';
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  if (enabled.value) setupCanvas();
});

onUnmounted(() => {
  stopAnimation();
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

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
