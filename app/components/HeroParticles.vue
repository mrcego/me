<template>
  <div ref="containerRef" class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
    <canvas ref="canvasRef" class="block size-full" />
  </div>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion, useRafFn, useEventListener } from '@vueuse/core';

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  phase: number;
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const prefersReducedMotion = usePreferredReducedMotion();

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let width = 0;
let height = 0;
let dpr = 1;
let pointerX = -9999;
let pointerY = -9999;
let pointerActive = false;

const REPEL_RADIUS = 140;
const REPEL_STRENGTH = 42;
const RETURN_EASE = 0.06;

function particleCountForArea(w: number, h: number) {
  return Math.min(90, Math.max(36, Math.floor((w * h) / 12000)));
}

function createParticle(w: number, h: number): Particle {
  const x = Math.random() * w;
  const y = Math.random() * h;
  return {
    x,
    y,
    baseX: x,
    baseY: y,
    size: Math.random() * 2.2 + 0.6,
    opacity: Math.random() * 0.35 + 0.12,
    driftX: (Math.random() - 0.5) * 0.35,
    driftY: (Math.random() - 0.5) * 0.35,
    phase: Math.random() * Math.PI * 2,
  };
}

function initParticles() {
  const count =
    prefersReducedMotion.value === 'reduce'
      ? Math.min(24, particleCountForArea(width, height))
      : particleCountForArea(width, height);

  particles = Array.from({ length: count }, () => createParticle(width, height));
}

function resize() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const rect = container.getBoundingClientRect();
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  initParticles();
}

function setPointerFromClient(clientX: number, clientY: number) {
  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  pointerX = clientX - rect.left;
  pointerY = clientY - rect.top;
  pointerActive =
    pointerX >= -40 && pointerY >= -40 && pointerX <= width + 40 && pointerY <= height + 40;
}

function clearPointer() {
  pointerActive = false;
  pointerX = -9999;
  pointerY = -9999;
}

function updateParticle(p: Particle, reduceMotion: boolean) {
  if (!reduceMotion) {
    p.baseX += p.driftX;
    p.baseY += p.driftY;
    p.phase += 0.01;

    if (p.baseX < -20) p.baseX = width + 20;
    else if (p.baseX > width + 20) p.baseX = -20;
    if (p.baseY < -20) p.baseY = height + 20;
    else if (p.baseY > height + 20) p.baseY = -20;
  }

  let targetX = p.baseX + Math.sin(p.phase) * 6;
  let targetY = p.baseY + Math.cos(p.phase * 0.8) * 6;

  if (pointerActive && !reduceMotion) {
    const dx = p.x - pointerX;
    const dy = p.y - pointerY;
    const dist = Math.hypot(dx, dy);

    if (dist < REPEL_RADIUS && dist > 0.001) {
      const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
      targetX += (dx / dist) * force;
      targetY += (dy / dist) * force;
    }
  }

  p.x += (targetX - p.x) * (reduceMotion ? 1 : RETURN_EASE * 2.2);
  p.y += (targetY - p.y) * (reduceMotion ? 1 : RETURN_EASE * 2.2);
}

function drawParticle(p: Particle) {
  if (!ctx) return;

  ctx.fillStyle = `rgba(255, 75, 92, ${p.opacity})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
}

function connectNearby() {
  if (!ctx) return;

  const maxDist = 96;
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    if (!a) continue;

    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      if (!b) continue;

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= maxDist) continue;

      ctx.strokeStyle = `rgba(255, 75, 92, ${(1 - dist / maxDist) * 0.12})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

const { pause, resume } = useRafFn(
  () => {
    if (!ctx || width === 0 || height === 0) return;

    const reduceMotion = prefersReducedMotion.value === 'reduce';

    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      updateParticle(particle, reduceMotion);
      drawParticle(particle);
    }

    if (!reduceMotion) connectNearby();
  },
  { immediate: false },
);

function onPointerMove(event: PointerEvent) {
  setPointerFromClient(event.clientX, event.clientY);
}

onMounted(() => {
  resize();
  resume();
});

onUnmounted(() => {
  pause();
});

useEventListener(window, 'resize', resize, { passive: true });
useEventListener(window, 'pointermove', onPointerMove, { passive: true });
useEventListener(window, 'pointerleave', clearPointer, { passive: true });
useEventListener(document, 'visibilitychange', () => {
  if (document.visibilityState === 'visible') resume();
  else pause();
});

watch(prefersReducedMotion, () => {
  initParticles();
});
</script>
