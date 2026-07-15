<template>
  <section
    id="certifications"
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- Background Accents -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"
    />
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"
    />

    <div class="container mx-auto">
      <!-- Section Header -->
      <Motion
        :initial="motionInitial({ opacity: 0, y: 20 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
        :viewport="{ once: true }"
        class="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center space-y-6 md:space-y-10 mb-12 md:mb-24 px-2 sm:px-0"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
          <h2 class="type-eyebrow tracking-[0.4em]">
            {{ $t('certifications.section') }}
          </h2>
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
        </div>
        <h3
          class="certifications-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] text-foreground"
        >
          <span class="block">{{ $t('certifications.title') }}</span>
          <span class="text-gradient certifications-heading__highlight block">
            {{ $t('certifications.titleHighlight') }}
          </span>
        </h3>
        <p
          class="text-muted text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto"
        >
          {{ $t('certifications.description') }}
        </p>
      </Motion>

      <!-- Certifications Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
        <Motion
          v-for="(cert, i) in certifications"
          :key="i"
          :initial="motionInitial({ opacity: 0, y: 20 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="surface-card group relative glass p-6 md:p-8 rounded-4xl border-foreground/5 flex flex-col justify-between h-full overflow-hidden min-w-0"
        >
          <div class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none" />

          <div class="space-y-6 relative z-10">
            <!-- Icon and Date -->
            <div class="flex justify-between items-start">
              <div
                class="surface-card__icon w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary shadow-xl"
              >
                <Icon name="solar:medal-ribbon-bold" class="w-10 h-10" />
              </div>
              <span class="surface-card__meta type-meta text-muted">{{ cert.date }}</span>
            </div>

            <!-- Title and Issuer -->
            <div class="space-y-2 min-w-0">
              <h4
                class="surface-card__title text-lg sm:text-xl font-bold tracking-tight text-foreground text-balance break-words line-clamp-3"
              >
                {{ cert.title }}
              </h4>
              <div class="flex items-center gap-2 text-sm font-medium text-muted">
                <Icon name="simple-icons:linkedin" class="w-7 h-7" />
                <span>{{ cert.issuer }}</span>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in cert.skills"
                :key="skill"
                class="surface-card__tag type-label text-muted/80 bg-foreground/5 px-2.5 py-1 rounded-md border border-foreground/5"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="surface-card__footer mt-8 pt-6 border-t border-foreground/5 relative z-10">
            <NuxtLink
              :to="cert.url"
              target="_blank"
              class="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl text-sm font-black uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-contrast transition-all duration-500 group/btn"
            >
              {{ $t('certifications.viewCredential') }}
              <Icon
                name="solar:arrow-right-up-linear"
                class="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
              />
            </NuxtLink>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from 'motion-v';
import { useI18n } from 'vue-i18n';

const { tm, rt } = useI18n();

const { motionInitial, motionInView } = useMotionConfig();
// Acceder directamente a los datos de certificaciones desde i18n
const certifications = computed(() => {
  const data = tm('certifications.data');
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => ({
    title: rt(item.title),
    issuer: rt(item.issuer),
    date: rt(item.date),
    skills: Array.isArray(item.skills) ? item.skills.map((s) => rt(s)) : [],
    url: rt(item.url),
  }));
});
</script>

<style scoped>
.certifications-heading {
  text-wrap: balance;
}

.certifications-heading__highlight {
  display: inline-block;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding-bottom: 0.04em;
}

@media (min-width: 768px) {
  .certifications-heading__highlight {
    white-space: nowrap;
  }
}

@media (max-width: 389px) {
  .certifications-heading {
    font-size: 1.75rem;
  }
}
</style>
