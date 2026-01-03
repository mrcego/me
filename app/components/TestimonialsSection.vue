<template>
  <section
    class="py-24 md:py-48 px-6 md:px-12 bg-secondary/5 relative overflow-hidden"
  >
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
            Ecosystem Feedback
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3 class="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Trusted by<br>
          <span class="text-gradient">Innovators.</span>
        </h3>
      </Motion>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <Motion
          v-for="(t, i) in testimonials"
          :key="t.name"
          :initial="{ opacity: 0, scale: 0.98, y: 5 }"
          :in-view="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }"
          :viewport="{ once: true, amount: 0.1 }"
          class="group relative glass p-10 md:p-14 rounded-[3.5rem] border-white/5 hover:border-primary/40 transition-all duration-700 cursor-alias overflow-hidden"
        >
          <!-- Holographic dust -->
          <div
            class="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none testimonial-dots"
          />

          <div class="relative z-10 space-y-10">
            <div
              class="text-slate-500 group-hover:text-primary transition-colors"
            >
              <Icon
                name="solar:chat-square-code-bold-duotone"
                class="w-10 h-10 md:w-12 md:h-12 opacity-50"
              />
            </div>

            <p
              class="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic group-hover:text-white transition-colors"
            >
              "{{ t.quote }}"
            </p>

            <div
              class="flex items-center gap-6 pt-6 border-t border-white/5 group-hover:border-primary/20 transition-all"
            >
              <div
                class="w-14 h-14 rounded-2xl glass overflow-hidden border-white/10 group-hover:scale-110 transition-transform"
              >
                <img:src="t.avatar"
                  class="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all"
                  alt="Testimonial Avatar"
                >
              </div>
              <div class="space-y-1">
                <h5 class="text-lg font-black text-white tracking-tight">
                  {{ t.name }}
                </h5>
                <p
                  class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors"
                >
                  {{ t.role }}
                </p>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";

const testimonials = [
  {
    name: "Tech Lead",
    role: "Colegium Architecture",
    quote:
      "CÃ©sar ability to bridge complex enterprise logic with high-performance frontend interfaces is extraordinary.",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    name: "Product Manager",
    role: "LingoQuesto",
    quote:
      "Design becomes engineering excellence under his guidance. The attention to detail is truly world-class.",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
];
</script>

<style scoped>
.testimonial-dots {
  background-image: radial-gradient(
    circle,
    rgba(255, 75, 92, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}
</style>

