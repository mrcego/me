<template>
  <section
    id="hero"
    class="relative min-h-svh flex items-center justify-center overflow-hidden px-5 md:px-10 pt-[calc(var(--availability-banner-h,0px)+5rem)] pb-10 md:pb-12 lg:pt-[calc(var(--availability-banner-h,0px)+5.5rem)] lg:pb-14"
  >
    <!-- Interactive background particles -->
    <LazyHeroParticles :hydrate-on-idle="1800" />

    <!-- Decorative watermark — deferred + opacity 0 until idle so it cannot steal LCP -->
    <div
      v-if="showMarquee"
      class="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap z-0 pointer-events-none transition-opacity duration-1000"
      :class="marqueeReady ? 'opacity-[0.03]' : 'opacity-0'"
      aria-hidden="true"
    >
      <div class="flex animate-marquee-slow">
        <span
          v-for="n in 4"
          :key="n"
          class="text-[18vw] md:text-[14vw] font-black text-foreground tracking-tighter leading-none mr-24 select-none uppercase"
        >
          {{ $t('hero.marquee') }}
        </span>
      </div>
    </div>

    <div
      class="container mx-auto grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 z-10 relative w-full"
    >
      <!--
        Mobile/tablet (<lg): photo (+ vibe banner) → name/copy via CSS order
        Desktop (lg+): text column left, photo right
      -->
      <div
        class="order-3 lg:order-1 space-y-6 md:space-y-7 xl:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        <div class="space-y-3 sm:space-y-4 md:space-y-5 group w-full">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black leading-[0.9] sm:leading-[0.88] tracking-tighter"
          >
            <span
              class="text-gradient block hover:text-foreground transition-colors duration-700"
              >{{ firstName }}</span
            >
            <span class="text-foreground block hover:text-primary transition-colors duration-700">{{
              lastName
            }}</span>
          </h1>

          <div
            class="hero-reveal hero-reveal--d35 w-full max-w-2xl mx-auto lg:mx-0 space-y-2 sm:space-y-2.5"
          >
            <p
              class="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-black tracking-tight text-foreground text-balance text-center lg:text-left"
            >
              {{ $t('hero.title') }}
            </p>
            <p
              class="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 type-meta text-muted"
            >
              <span class="inline-flex items-center gap-1.5">
                <Icon
                  name="lucide:map-pin"
                  class="size-3.5 shrink-0 text-primary/70"
                  aria-hidden="true"
                />
                {{ $t('hero.location') }}
              </span>
              <span class="text-foreground/20" aria-hidden="true">·</span>
              <span class="inline-flex items-center gap-1.5">
                <Icon
                  name="lucide:globe"
                  class="size-3.5 shrink-0 text-primary/70"
                  aria-hidden="true"
                />
                {{ $t('hero.workPreference') }}
              </span>
            </p>
          </div>

          <div
            class="hero-reveal hero-reveal--d60 space-y-3 sm:space-y-4 w-full max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <p
              class="text-muted text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl leading-relaxed font-medium tracking-tight text-pretty"
            >
              {{ $t('hero.description') }}
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2">
              <div
                v-for="tag in heroTags"
                :key="tag"
                class="flex items-center gap-1.5 sm:gap-2 md:gap-3 type-label text-muted hover:text-primary transition-all cursor-default"
              >
                <div class="w-1 h-1 rounded-full bg-primary/40" />
                {{ $t(tag) }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="hero-reveal hero-reveal--d80 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center lg:justify-start w-full lg:w-auto"
        >
          <a
            class="btn-premium bg-primary text-primary-contrast rounded-2xl sm:rounded-3xl px-7 sm:px-9 py-3.5 sm:py-4 shadow-3xl shadow-primary/20 hover:scale-[1.03] active:scale-95 w-full sm:w-auto text-sm sm:text-base border-none"
            href="#contact"
          >
            <Icon
              name="solar:rocket-2-bold-duotone"
              class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
            />
            <span>{{ $t('hero.cta') }}</span>
          </a>
          <CvDownloadButton />
          <div
            class="hidden sm:block w-px self-stretch bg-foreground/10 shrink-0"
            aria-hidden="true"
          />
          <div
            class="flex gap-2.5 sm:gap-3 items-center border-t border-foreground/10 pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-center lg:justify-start"
          >
            <a
              v-for="social in socials"
              :key="social.icon"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Visit ${social.label} profile`"
              class="surface-card group inline-flex items-center justify-center size-[66px] sm:size-[74px] glass rounded-xl text-muted active:scale-90 shrink-0"
            >
              <Icon
                :name="social.icon"
                class="surface-card__glyph size-[38px] sm:size-[42px] shrink-0"
              />
            </a>
          </div>
        </div>

        <div
          class="grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 pt-5 sm:pt-6 border-t border-foreground/5 w-full max-w-lg lg:max-w-none mx-auto lg:mx-0"
        >
          <div
            v-for="(stat, i) in heroStats"
            :key="stat.label"
            class="hero-reveal space-y-0.5 md:space-y-1 group/stat cursor-help"
            :style="{ animationDelay: `${1 + i * 0.15}s` }"
          >
            <div
              class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter group-hover/stat:text-primary transition-colors text-gradient"
            >
              {{ stat.value }}
            </div>
            <div
              class="type-stat-label text-muted group-hover/stat:text-foreground transition-colors"
            >
              {{ $t(stat.label) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Photo + vibe banner: share float + tilt as one composition -->
      <div
        class="hero-reveal hero-reveal--photo relative order-2 lg:order-2 px-2 sm:px-4 md:px-0 w-full max-w-md lg:max-w-none mx-auto"
      >
        <div
          ref="photoHitRef"
          class="group hero-photo-trigger relative mt-2.5 max-w-[14rem] sm:max-w-[16rem] lg:max-w-[min(100%,24.5rem)] xl:max-w-[min(100%,28.5rem)] mx-auto perspective-[1000px]"
        >
          <!--
            Stable hit shell + overlay button (no transform) so click survives.
            Float (translate) and tilt (rotate) must stay on separate layers —
            both use `transform`, so sharing one node kills the float animation.
          -->
          <button
            type="button"
            class="absolute inset-0 z-30 rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] cursor-pointer touch-manipulation appearance-none bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
            :aria-label="$t('about.vibeCodingOpen')"
            aria-haspopup="dialog"
            @click.stop="openVibeCodingModal"
            @pointermove="onPhotoPointerMove"
            @pointerleave="onPhotoPointerLeave"
            @pointerdown="onHeroPointerDown"
            @pointerup="onPhotoPointerUp"
            @pointercancel="onPhotoPointerCancel"
          />

          <div class="relative z-10 pointer-events-none animate-float" aria-hidden="true">
            <div class="flex w-full flex-col gap-2.5 sm:gap-3" :style="photoTiltStyle">
              <span
                class="inline-flex w-full items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-primary text-primary-contrast shadow-lg shadow-primary/20 transition-[filter,box-shadow] duration-300 group-hover:brightness-110"
              >
                <Icon
                  name="solar:magic-stick-3-bold-duotone"
                  class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] shrink-0"
                />
                <span class="type-overline tracking-[0.14em] sm:tracking-[0.18em] text-center">{{
                  $t('hero.expertiseBadge')
                }}</span>
              </span>

              <div
                class="surface-card surface-card--soft relative rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden border border-white/10 glass p-2.5 md:p-3.5"
              >
                <div
                  class="relative aspect-4/5 max-h-[min(22rem,42svh)] lg:max-h-[min(30.5rem,62svh)] xl:max-h-[min(34.5rem,66svh)] mx-auto rounded-[1.6rem] md:rounded-[2rem] lg:rounded-[2.4rem] overflow-hidden bg-secondary"
                >
                  <div class="absolute inset-x-0 top-0 h-px bg-primary/20 z-20" />
                  <div class="absolute inset-y-0 left-0 w-px bg-primary/20 z-20" />
                  <div
                    class="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent z-10"
                  />

                  <NuxtImg
                    src="/img/me.jpg"
                    alt=""
                    width="448"
                    height="560"
                    fit="cover"
                    format="webp"
                    quality="85"
                    loading="eager"
                    fetchpriority="high"
                    densities="x1"
                    sizes="224px sm:256px lg:392px xl:448px"
                    class="surface-card__image hero-photo-image w-full h-full object-cover grayscale brightness-90 scale-105"
                  />

                  <div
                    class="surface-card__glow absolute inset-0 z-20 bg-primary/5 hero-scanline"
                  />

                  <div
                    class="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 glass px-3 py-2 rounded-full flex items-center gap-2.5 border border-primary/20 bg-background/60 backdrop-blur-md shadow-lg animate-pulse-slow"
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
                  class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left z-30"
                />
              </div>
            </div>
          </div>

          <!-- Decorative Glows -->
          <div
            class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/10 to-transparent blur-[80px] md:blur-[100px] opacity-0 group-hover:opacity-60 transition-opacity duration-1000"
          />
          <div
            class="absolute -z-10 -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-accent/5 rounded-full blur-[60px] animate-pulse-slow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { openVibeCodingModal, vibeCodingModalMounted } = useVibeCodingModal();

const {
  hitRef: photoHitRef,
  style: photoTiltStyle,
  onPointerMove: onPhotoPointerMove,
  onPointerLeave: onPhotoPointerLeave,
  onPointerDown: onPhotoPointerDown,
  onPointerUp: onPhotoPointerUp,
  onPointerCancel: onPhotoPointerCancel,
} = useCardTilt({ maxDeg: 6, followMs: 340, settleMs: 780 });

function prefetchVibeModal() {
  vibeCodingModalMounted.value = true;
}

function onHeroPointerDown(event: PointerEvent) {
  prefetchVibeModal();
  onPhotoPointerDown(event);
}

const showMarquee = ref(false);
const marqueeReady = ref(false);

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

const heroTags = ['hero.tags.ai', 'hero.tags.nlp', 'hero.tags.vibeCoding', 'hero.tags.frontArch'];

const heroStats = [
  { value: '13+', label: 'hero.stats.experience' },
  { value: '500+', label: 'hero.stats.projects' },
  { value: '60%', label: 'hero.stats.technologies' },
];

onMounted(() => {
  // Watermark must not paint at opacity > 0 until after user interaction —
  // otherwise it can replace the hero photo as LCP (seen at ~12s with 25vw text).
  const scheduleMarquee = () => {
    showMarquee.value = true;
  };

  const revealMarquee = () => {
    if (marqueeReady.value) return;
    marqueeReady.value = true;
  };

  const start = () => {
    const requestIdle = Reflect.get(window, 'requestIdleCallback') as
      Window['requestIdleCallback'] | undefined;
    if (requestIdle) {
      requestIdle.call(window, scheduleMarquee, { timeout: 4000 });
    } else {
      window.setTimeout(scheduleMarquee, 2000);
    }
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  window.addEventListener('scroll', revealMarquee, { once: true, passive: true });
  window.addEventListener('pointerdown', revealMarquee, { once: true, passive: true });
  window.addEventListener('keydown', revealMarquee, { once: true });
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

.hero-scanline {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.1) 2px
  );
}

.hero-photo-trigger {
  -webkit-tap-highlight-color: transparent;
}

.hero-photo-image {
  transition:
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1.05s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-photo-trigger:focus-within .hero-photo-image {
  filter: grayscale(0.22) brightness(1.02);
  transform: scale(1.07);
}

@media (hover: hover) and (pointer: fine) {
  .hero-photo-trigger:hover .hero-photo-image {
    filter: grayscale(0.22) brightness(1.02);
    transform: scale(1.07);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-photo-image {
    transition-duration: 0.01ms;
  }

  .hero-photo-trigger:focus-within .hero-photo-image {
    transform: none;
    filter: grayscale(0.22) brightness(1.02);
  }

  @media (hover: hover) and (pointer: fine) {
    .hero-photo-trigger:hover .hero-photo-image {
      transform: none;
      filter: grayscale(0.22) brightness(1.02);
    }
  }
}

.hero-reveal {
  animation: hero-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-reveal--d35 {
  animation-delay: 0.35s;
}

.hero-reveal--d60 {
  animation-delay: 0.6s;
}

.hero-reveal--d80 {
  animation-delay: 0.8s;
}

.hero-reveal--photo {
  animation-name: hero-reveal-photo;
  animation-duration: 1.1s;
  animation-delay: 0.15s;
}

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes hero-reveal-photo {
  from {
    opacity: 0;
    transform: translateX(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-reveal,
  .hero-reveal--photo {
    animation: none;
  }
}
</style>
