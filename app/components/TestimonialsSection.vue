<template>
  <section
    id="testimonials"
    class="py-24 md:py-48 px-6 md:px-12 bg-secondary/5 relative overflow-hidden"
  >
    <div class="container mx-auto space-y-24">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 5 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <h2 class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">
            {{ $t('testimonials.section') }}
          </h2>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h3
          class="text-5xl md:text-8xl font-black tracking-tighter text-foreground pb-24 text-balance"
        >
          {{ $t('testimonials.title') }}<br />
          <span class="text-gradient">{{ $t('testimonials.titleHighlight') }}</span>
        </h3>
      </Motion>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 items-stretch">
        <Motion
          v-for="(t, i) in testimonials"
          :key="t.name"
          :initial="motionInitial({ opacity: 0, scale: 0.98, y: 5 })"
          :while-in-view="motionInView({ opacity: 1, scale: 1, y: 0 })"
          :transition="{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }"
          :viewport="{ once: true, amount: 0.1 }"
          class="surface-card group relative glass p-10 md:p-14 rounded-[3.5rem] border-foreground/5 overflow-hidden h-full"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-primary/2 pointer-events-none testimonial-dots"
          />

          <div class="relative z-10 space-y-10">
            <div class="surface-card__quote-icon text-muted">
              <Icon
                name="solar:chat-square-code-bold-duotone"
                class="w-12 h-12 md:w-14 md:h-14 opacity-50"
                aria-hidden="true"
              />
            </div>

            <blockquote
              class="surface-card__text text-lg md:text-xl text-muted font-medium leading-relaxed italic max-h-[9.2rem] md:max-h-[10.2rem] overflow-y-auto pr-4 custom-scrollbar"
            >
              <p>"{{ t.quote }}"</p>
            </blockquote>

            <footer
              class="surface-card__footer flex items-center gap-6 pt-6 border-t border-foreground/5"
            >
              <div
                class="surface-card__avatar w-14 h-14 rounded-2xl glass overflow-hidden border border-foreground/10 shrink-0"
              >
                <NuxtImg
                  v-if="!failedAvatars.has(t.name)"
                  :src="avatarSrc(t.name)"
                  :alt="`${t.name} — ${t.role}`"
                  width="56"
                  height="56"
                  loading="lazy"
                  class="surface-card__image w-full h-full object-cover grayscale brightness-90"
                  @error="markAvatarFailed(t.name)"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-primary/15 text-primary font-black text-sm"
                  :aria-label="t.name"
                >
                  {{ getInitials(t.name) }}
                </div>
              </div>
              <div class="space-y-1 min-w-0">
                <cite
                  class="text-lg font-black text-foreground tracking-tight not-italic block truncate"
                >
                  {{ t.name }}
                </cite>
                <p
                  class="surface-card__meta text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted line-clamp-2"
                >
                  {{ t.role }}
                </p>
              </div>
            </footer>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';

const { tm, rt } = useI18n();
const { getLocalAvatar, getInitials } = useTestimonialAvatar();
const { motionInitial, motionInView } = useMotionConfig();

const failedAvatars = ref(new Set<string>());

interface TestimonialEntry {
  name: string;
  role: string;
  quote: string;
}

const testimonials = computed(() => {
  const data = tm('testimonials.data') as TestimonialEntry[] | unknown;
  if (!Array.isArray(data)) return [];
  return data.map((t) => ({
    name: rt(t.name),
    role: rt(t.role),
    quote: rt(t.quote),
  }));
});

const avatarSrc = (name: string) => getLocalAvatar(name);

const markAvatarFailed = (name: string) => {
  failedAvatars.value = new Set([...failedAvatars.value, name]);
};

watch(testimonials, () => {
  failedAvatars.value = new Set();
});
</script>

<style scoped>
.testimonial-dots {
  background-image: radial-gradient(circle, rgba(255, 75, 92, 0.1) 1px, transparent 1px);
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

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 75, 92, 0.2) transparent;
}
</style>
