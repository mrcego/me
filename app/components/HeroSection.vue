<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-12 py-24 md:py-32"
  >
    <!-- background glowing particles enhanced -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <template v-if="isMounted">
        <div
          v-for="n in 12"
          :key="n"
          class="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-random"
          :style="particleStyles[n - 1]"
        />
      </template>
    </div>

    <!-- Kinetic Marquee Watermark (Subtler) -->
    <div
      class="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none opacity-[0.03]"
    >
      <div class="flex animate-marquee-slow">
        <span
          v-for="n in 6"
          :key="n"
          class="text-[25vw] font-black text-foreground tracking-tighter leading-none mr-32 select-none uppercase"
        >
          {{ $t('hero.marquee') }}
        </span>
      </div>
    </div>

    <div
      class="container mx-auto grid lg:grid-cols-[1.2fr_1fr] items-center gap-16 md:gap-24 z-10 relative"
    >
      <div
        class="space-y-10 md:space-y-16 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        <div class="space-y-6 md:space-y-10 group">
          <Motion
            :initial="motionInitial({ opacity: 0, scale: 0.9, y: -10 })"
            :animate="motionAnimate({ opacity: 1, scale: 1, y: 0 })"
            :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
            class="surface-card surface-card--soft inline-flex items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-5 py-2 rounded-2xl glass border-primary/20 cursor-alias"
          >
            <span class="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
              />
              <span
                class="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-primary"
              />
            </span>
            <span class="type-overline text-primary tracking-[0.3em] sm:tracking-[0.4em]">{{
              $t('hero.tagline')
            }}</span>
          </Motion>

          <Motion
            :initial="motionInitial({ opacity: 0, y: 20, scale: 0.95 })"
            :animate="motionAnimate({ opacity: 1, y: 0, scale: 1 })"
            :transition="{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }"
          >
            <h1
              class="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[13rem] font-black leading-[0.85] sm:leading-[0.8] md:leading-[0.75] tracking-tighter"
            >
              <span
                class="text-gradient block hover:text-foreground transition-colors duration-700"
                >{{ firstName }}</span
              >
              <span
                class="text-foreground block hover:text-primary transition-colors duration-700"
                >{{ lastName }}</span
              >
            </h1>
          </Motion>

          <Motion
            :initial="motionInitial({ opacity: 0, y: 15 })"
            :animate="motionAnimate({ opacity: 1, y: 0 })"
            :transition="{
              duration: 1,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }"
            class="space-y-4 sm:space-y-6 md:space-y-8 max-w-2xl"
          >
            <p
              class="text-muted text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed md:leading-[1.2] lg:leading-[1.15] font-medium tracking-tight"
            >
              {{ $t('hero.description') }}
            </p>
            <div
              class="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-2 sm:gap-y-3 md:gap-y-4"
            >
              <div
                v-for="tag in heroTags"
                :key="tag"
                class="flex items-center gap-1.5 sm:gap-2 md:gap-3 type-label text-muted hover:text-primary transition-all cursor-default"
              >
                <div class="w-1 h-1 rounded-full bg-primary/40" />
                {{ $t(tag) }}
              </div>
            </div>
          </Motion>
        </div>

        <Motion
          :initial="motionInitial({ opacity: 0, y: 15 })"
          :animate="motionAnimate({ opacity: 1, y: 0 })"
          :transition="{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }"
          class="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center justify-center lg:justify-start w-full lg:w-auto"
        >
          <Button
            class="btn-premium bg-primary text-primary-contrast rounded-3xl! px-8! sm:px-10! md:px-12! py-4! sm:py-5! md:py-6! shadow-3xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all w-full sm:w-auto text-sm sm:text-base border-none!"
            as="a"
            href="#contact"
            aria-label="Contact César Gómez"
          >
            <Icon name="solar:rocket-2-bold-duotone" class="w-6 h-6 sm:w-7 sm:h-7" />
            <span>{{ $t('hero.cta') }}</span>
          </Button>
          <div
            class="hidden sm:block w-px self-stretch bg-foreground/10 shrink-0"
            aria-hidden="true"
          />
          <div
            class="flex gap-3 sm:gap-4 md:gap-6 items-center border-t border-foreground/10 pt-4 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-center lg:justify-start"
          >
            <a
              v-for="social in socials"
              :key="social.icon"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Visit ${social.label} profile`"
              class="surface-card group inline-flex items-center justify-center size-[4.5rem] sm:size-20 glass rounded-xl sm:rounded-2xl text-muted active:scale-90 shrink-0"
            >
              <Icon :name="social.icon" class="surface-card__glyph size-9 sm:size-10 shrink-0" />
            </a>
          </div>
        </Motion>

        <div
          class="grid grid-cols-3 gap-4 sm:gap-8 md:gap-16 pt-8 sm:pt-10 md:pt-12 border-t border-foreground/5 w-full max-w-lg lg:max-w-none mx-auto lg:mx-0"
        >
          <Motion
            v-for="(stat, i) in heroStats"
            :key="stat.label"
            :initial="motionInitial({ opacity: 0, y: 10, scale: 0.9 })"
            :animate="motionAnimate({ opacity: 1, y: 0, scale: 1 })"
            :transition="{
              duration: 0.8,
              delay: 1 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }"
            class="space-y-1 md:space-y-2 group/stat cursor-help"
          >
            <div
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter group-hover/stat:text-primary transition-colors text-gradient"
            >
              {{ stat.value }}
            </div>
            <div
              class="type-stat-label text-muted group-hover/stat:text-foreground transition-colors"
            >
              {{ $t(stat.label) }}
            </div>
          </Motion>
        </div>
      </div>

      <Motion
        :initial="motionInitial({ opacity: 0, scale: 0.95, x: 20 })"
        :animate="motionAnimate({ opacity: 1, scale: 1, x: 0 })"
        :transition="{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }"
        class="relative mt-12 lg:mt-0 px-4 sm:px-6 md:px-0"
      >
        <!-- Photo with Master Frame -->
        <div
          class="surface-card group relative z-20 rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 glass p-3 md:p-5 animate-float max-w-sm lg:max-w-none mx-auto"
        >
          <div
            class="relative aspect-4/5 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-secondary"
          >
            <!-- Card HUD Internal Overlay -->
            <div class="absolute inset-x-0 top-0 h-px bg-primary/20 z-20 pointer-events-none" />
            <div class="absolute inset-y-0 left-0 w-px bg-primary/20 z-20 pointer-events-none" />
            <div
              class="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent z-10"
            />

            <NuxtImg
              src="/img/me.jpg"
              alt="César Gómez - Frontend-focused senior fullstack developer specializing in Vue.js and Nuxt.js"
              width="800"
              height="1000"
              format="webp"
              quality="85"
              loading="eager"
              fetchpriority="high"
              sizes="sm:400px md:500px lg:600px xl:800px"
              class="surface-card__image surface-card__image--zoom w-full h-full object-cover grayscale brightness-90 scale-105"
            />

            <!-- Scanning effect specific to image -->
            <div
              class="surface-card__glow absolute inset-0 z-20 bg-primary/5 pointer-events-none hero-scanline"
            />

            <!-- Floating HUD Elements -->
            <div
              class="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 glass px-4 py-2.5 rounded-full flex items-center gap-3 border border-primary/20 bg-background/60 backdrop-blur-md shadow-lg animate-pulse-slow"
            >
              <span class="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"
                />
                <span
                  class="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500"
                />
              </span>
              <div class="flex flex-col gap-0.5">
                <span class="type-meta text-primary leading-none">
                  {{ $t('hero.hud.status') }}
                </span>
                <span
                  class="text-xs md:text-sm font-mono font-bold text-foreground uppercase leading-none"
                >
                  {{ $t('hero.hud.operational') }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-30"
          />
        </div>

        <!-- Decorative Glows -->
        <div
          class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/10 to-transparent blur-[80px] md:blur-[100px] opacity-0 group-hover:opacity-60 transition-opacity duration-1000"
        />
        <div
          class="absolute -z-10 -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-accent/5 rounded-full blur-[60px] animate-pulse-slow"
        />
      </Motion>
    </div>
  </section>
</template>

<script setup>
import { Motion } from 'motion-v';
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { motionInitial, motionAnimate } = useMotionConfig();
const isMounted = ref(false);
const particleStyles = ref([]);

const firstName = computed(() => t('hero.name').split(' ')[0]);
const lastName = computed(() => t('hero.name').split(' ').slice(1).join(' '));

const socials = [
  {
    icon: 'simple-icons:linkedin',
    link: 'https://linkedin.com/in/mrcego',
    label: 'LinkedIn',
  },
  {
    icon: 'simple-icons:github',
    link: 'https://github.com/mrcego',
    label: 'GitHub',
  },
  {
    icon: 'solar:letter-linear',
    link: 'mailto:cesargomezh90@gmail.com',
    label: 'Email',
  },
];

const heroTags = ['hero.tags.frontArch', 'hero.tags.nuxt', 'hero.tags.ts', 'hero.tags.engineer'];

const heroStats = [
  { value: '13+', label: 'hero.stats.experience' },
  { value: '500+', label: 'hero.stats.projects' },
  { value: '60%', label: 'hero.stats.technologies' },
];

onMounted(() => {
  isMounted.value = true;
  // Generate random particle styles on client side to avoid hydration mismatch
  particleStyles.value = Array.from({ length: 12 }, (_, i) => ({
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    animationDelay: i * 1.5 + 's',
    animationDuration: 15 + Math.random() * 20 + 's',
  }));
});
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee-slow {
  animation: marquee 60s linear infinite;
}

@keyframes float-random {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -50px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}
.animate-float-random {
  animation: float-random linear infinite;
}

.hero-scanline {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.1) 2px
  );
}
</style>
