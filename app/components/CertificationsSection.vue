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
        :initial="{ opacity: 0, y: 20 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
        :viewport="{ once: true }"
        class="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 mb-24 md:mb-32"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
          <h2
            class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
          >
            {{ $t("certifications.section") }}
          </h2>
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
        </div>
        <h3
          class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-foreground"
        >
          {{ $t("certifications.title") }}
          <br />
          <span class="text-gradient">{{
            $t("certifications.titleHighlight")
          }}</span>
        </h3>
        <p
          class="text-muted text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto"
        >
          {{ $t("certifications.description") }}
        </p>
      </Motion>

      <!-- Certifications Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <Motion
          v-for="(cert, i) in certifications"
          :key="i"
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="group relative glass p-6 md:p-8 rounded-4xl border-foreground/5 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
        >
          <div class="space-y-6">
            <!-- Icon and Date -->
            <div class="flex justify-between items-start">
              <div
                class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-contrast transition-all duration-500 shadow-xl"
              >
                <Icon name="solar:medal-ribbon-bold" class="w-7 h-7" />
              </div>
              <span
                class="text-[10px] font-black uppercase tracking-widest text-muted"
                >{{ cert.date }}</span
              >
            </div>

            <!-- Title and Issuer -->
            <div class="space-y-2">
              <h4
                class="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-14"
              >
                {{ cert.title }}
              </h4>
              <div
                class="flex items-center gap-2 text-sm font-medium text-muted"
              >
                <Icon name="simple-icons:linkedin" class="w-4 h-4" />
                <span>{{ cert.issuer }}</span>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in cert.skills"
                :key="skill"
                class="text-[9px] font-black uppercase tracking-wider text-muted/80 bg-foreground/5 px-2.5 py-1 rounded-md border border-foreground/5 group-hover:border-primary/20 transition-colors"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mt-8 pt-6 border-t border-foreground/5">
            <NuxtLink
              :to="cert.url"
              target="_blank"
              class="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl text-xs font-black uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-contrast transition-all duration-500 group/btn"
            >
              {{ $t("certifications.viewCredential") }}
              <Icon
                name="solar:arrow-right-up-linear"
                class="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
              />
            </NuxtLink>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";
import { useI18n } from "vue-i18n";

const { tm, rt } = useI18n();

// Acceder directamente a los datos de certificaciones desde i18n
const certifications = computed(() => {
  const data = tm("certifications.data");
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
.line-clamp-2 {
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
