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
            {{ $t("testimonials.section") }}
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3
          class="text-5xl md:text-8xl font-black tracking-tighter text-foreground pb-24"
        >
          {{ $t("testimonials.title") }}<br />
          <span class="text-gradient">{{
            $t("testimonials.titleHighlight")
          }}</span>
        </h3>
      </Motion>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <Motion
          v-for="(t, i) in testimonials"
          :key="i"
          :initial="{ opacity: 0, scale: 0.98, y: 5 }"
          :in-view="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }"
          :viewport="{ once: true, amount: 0.1 }"
          class="group relative glass p-10 md:p-14 rounded-[3.5rem] border-foreground/5 hover:border-primary/40 transition-all duration-700 cursor-alias overflow-hidden"
        >
          <!-- Holographic dust -->
          <div
            class="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none testimonial-dots"
          />

          <div class="relative z-10 space-y-10">
            <div class="text-muted group-hover:text-primary transition-colors">
              <Icon
                name="solar:chat-square-code-bold-duotone"
                class="w-10 h-10 md:w-12 md:h-12 opacity-50"
              />
            </div>

            <p
              class="text-lg md:text-xl text-muted font-medium leading-relaxed italic group-hover:text-foreground transition-colors max-h-[9.2rem] md:max-h-[10.2rem] overflow-y-auto pr-4 custom-scrollbar"
            >
              "{{ t.quote }}"
            </p>
            <div
              class="flex items-center gap-6 pt-6 border-t border-foreground/5 group-hover:border-primary/20 transition-all"
            >
              <div
                class="w-14 h-14 rounded-2xl glass overflow-hidden border-foreground/10 group-hover:scale-110 transition-transform"
              >
                <img
                  :src="t.avatar"
                  class="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all"
                  alt="Testimonial Avatar"
                />
              </div>
              <div class="space-y-1">
                <h5 class="text-lg font-black text-foreground tracking-tight">
                  {{ t.name }}
                </h5>
                <p
                  class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors"
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
const { tm, rt } = useI18n();
const testimonials = computed(() => {
  const data = tm("testimonials.data");
  if (!data || !Array.isArray(data)) return [];
  return data.map((t) => ({
    name: rt(t.name),
    role: rt(t.role),
    quote: rt(t.quote),
    avatar: rt(t.avatar),
  }));
});
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 75, 92, 0.2);
  border-radius: 10px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 75, 92, 0.6);
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 75, 92, 0.2) transparent;
}
</style>
