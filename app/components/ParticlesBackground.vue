<template>
  <div class="particles-container" aria-hidden="true">
    <canvas ref="canvas" class="particles-canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvas = ref(null);
let ctx = null;
let particles = [];
let animationFrameId = null;

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = canvasWidth;

    if (this.y > canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = canvasHeight;
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 75, 92, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const initParticles = () => {
  if (!canvas.value) return;

  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const particleCount = Math.min(
    60,
    Math.floor((canvasWidth * canvasHeight) / 15000)
  );

  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvasWidth, canvasHeight));
  }
};

const connectParticles = () => {
  const maxDistance = 150;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.1;
        ctx.strokeStyle = `rgba(255, 75, 92, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

const animate = () => {
  if (!canvas.value || !ctx) return;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  particles.forEach((particle) => {
    particle.update(canvas.value.width, canvas.value.height);
    particle.draw(ctx);
  });

  connectParticles();

  animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
  if (!canvas.value) return;

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  initParticles();
};

onMounted(() => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  initParticles();
  animate();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener("resize", handleResize);
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

