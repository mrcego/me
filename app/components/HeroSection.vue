<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { activeRoleIndex, currentRole } = useBrandRoleRotator();
const { openVibeCodingModal, vibeCodingModalMounted } = useVibeCodingModal();
const { goToSection, sectionHref } = useSectionNavigation();

const {
  hitRef: photoHitRef,
  style: photoTiltStyle,
  onPointerMove: onPhotoPointerMove,
  onPointerLeave: onPhotoPointerLeave,
} = useCardTilt({ maxDeg: 4, followMs: 340, settleMs: 780 });

function prefetchVibeModal() {
  vibeCodingModalMounted.value = true;
}

function onVibeBadgeClick() {
  prefetchVibeModal();
  openVibeCodingModal();
}

const showMarquee = ref(false);
const marqueeReady = ref(false);

const nameParts = computed(() => {
  const parts = t('hero.name').trim().split(/\s+/);
  if (parts.length < 2) return { first: parts[0] ?? '', last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
});

const heroTags = [
  'hero.tags.vue3',
  'hero.tags.nuxt4',
  'hero.tags.ts',
  'hero.tags.nodejs',
  'hero.tags.html',
  'hero.tags.css',
  'hero.tags.js',
];

const heroStats = [
  { value: '13+', label: 'hero.stats.experience' },
  { value: '18+', label: 'hero.stats.projects' },
  { value: '20+', label: 'hero.stats.technologies' },
];

onMounted(() => {
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

<template>
  <section
    id="hero"
    class="relative min-h-svh flex items-start lg:items-center justify-center overflow-hidden px-5 md:px-10 pt-[calc(var(--availability-banner-h,0px)+6.5rem)] sm:pt-[calc(var(--availability-banner-h,0px)+7rem)] lg:pt-[calc(var(--availability-banner-h,0px)+8rem)] pb-8 md:pb-12 lg:pb-14"
  >
    <LazyHeroParticles :hydrate-after="5200" />

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
      class="container mx-auto grid lg:grid-cols-[1.15fr_0.85fr] items-start gap-4 sm:gap-6 lg:gap-12 xl:gap-16 z-10 relative w-full"
    >
      <!-- Headline: H1 + name + differentiator -->
      <header
        class="order-1 lg:col-start-1 space-y-3 sm:space-y-4 md:space-y-5 flex flex-col items-center lg:items-start text-center lg:text-left w-full"
      >
        <h1
          class="space-y-3 sm:space-y-4 md:space-y-5 font-black tracking-tighter text-balance w-full"
        >
          <span
            class="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-[1.05] min-h-[2.1em] sm:min-h-[2.0em] flex items-center justify-center lg:justify-start"
          >
            <Transition name="hero-role-fade" mode="out-in">
              <span
                :key="activeRoleIndex"
                class="block text-gradient hover:text-foreground transition-colors duration-700 text-pretty"
              >
                {{ currentRole }}
              </span>
            </Transition>
          </span>
          <span
            class="flex flex-wrap items-baseline justify-center lg:justify-start gap-x-3 sm:gap-x-4 md:gap-x-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-snug text-foreground/85"
          >
            <span class="text-gradient">{{ nameParts.first }}</span>
            <span v-if="nameParts.last" class="text-foreground">{{ nameParts.last }}</span>
          </span>
        </h1>

        <p
          class="hero-reveal hero-reveal--d35 w-full max-w-2xl type-meta text-muted text-center lg:text-left text-balance"
        >
          {{ $t('hero.differentiator') }}
        </p>
      </header>

      <!-- CTA row — above photo on mobile -->
      <div
        class="relative z-20 order-2 lg:col-start-1 hero-reveal hero-reveal--d80 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center lg:justify-start w-full lg:w-auto"
      >
        <a
          class="btn-premium bg-primary text-primary-contrast rounded-2xl sm:rounded-3xl px-7 sm:px-9 py-3.5 sm:py-4 shadow-3xl shadow-primary/20 hover:scale-[1.03] active:scale-95 w-full sm:w-auto text-sm sm:text-base border-none"
          :href="sectionHref('#contact')"
          @click="goToSection($event, '#contact')"
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
          class="relative z-20 flex gap-2.5 sm:gap-3 items-center border-t border-foreground/10 pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-center lg:justify-start"
        >
          <a
            href="https://linkedin.com/in/mrcego"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="$t('footer.socialLinkedIn')"
            class="hero-social-link inline-flex items-center justify-center size-[66px] sm:size-[74px] rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Icon
              name="simple-icons:linkedin"
              class="size-[38px] sm:size-[42px] shrink-0 pointer-events-none text-current"
            />
          </a>
          <a
            href="https://github.com/mrcego"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="$t('footer.socialGitHub')"
            class="hero-social-link inline-flex items-center justify-center size-[66px] sm:size-[74px] rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Icon
              name="simple-icons:github"
              class="size-[38px] sm:size-[42px] shrink-0 pointer-events-none text-current"
            />
          </a>
          <a
            href="mailto:cesargomezh90@gmail.com"
            :aria-label="$t('footer.socialEmail')"
            class="hero-social-link inline-flex items-center justify-center size-[66px] sm:size-[74px] rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Icon
              name="solar:letter-linear"
              class="size-[38px] sm:size-[42px] shrink-0 pointer-events-none text-current"
            />
          </a>
        </div>
      </div>

      <!-- Photo — identity visual, vibe badge is secondary control -->
      <div
        class="relative order-3 lg:col-start-2 lg:row-start-1 lg:row-span-4 px-2 sm:px-4 md:px-0 w-full max-w-[13rem] sm:max-w-md lg:max-w-none mx-auto lg:self-start"
      >
        <div
          ref="photoHitRef"
          class="group hero-photo-wrap relative perspective-[1000px]"
          @pointermove="onPhotoPointerMove"
          @pointerleave="onPhotoPointerLeave"
        >
          <div
            class="relative z-0 flex w-full flex-col items-center gap-2.5 sm:gap-3 pointer-events-none"
            :style="photoTiltStyle"
          >
            <div
              class="surface-card surface-card--soft relative w-full rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden border border-white/10 glass p-2.5 md:p-3.5"
            >
              <div
                class="relative aspect-4/5 max-h-[min(12rem,26svh)] sm:max-h-[min(16rem,32svh)] md:max-h-[min(20rem,38svh)] lg:max-h-[min(30.5rem,62svh)] xl:max-h-[min(34.5rem,66svh)] mx-auto rounded-[1.6rem] md:rounded-[2rem] lg:rounded-[2.4rem] overflow-hidden bg-secondary"
              >
                <div class="absolute inset-x-0 top-0 h-px bg-primary/20 z-20" />
                <div class="absolute inset-y-0 left-0 w-px bg-primary/20 z-20" />
                <div
                  class="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent z-10"
                />

                <NuxtImg
                  src="/img/me.jpg"
                  :alt="$t('hero.name')"
                  width="448"
                  height="560"
                  fit="cover"
                  format="webp"
                  quality="85"
                  loading="eager"
                  fetchpriority="high"
                  densities="x1"
                  sizes="154px sm:205px md:256px lg:392px xl:448px"
                  class="surface-card__image hero-photo-image w-full h-full object-cover"
                />

                <div class="surface-card__glow absolute inset-0 z-20 bg-primary/5 hero-scanline" />

                <div
                  class="absolute bottom-3 right-3 md:bottom-5 md:right-5 z-20 glass px-2.5 py-1.5 md:px-3 md:py-2 rounded-full flex items-center gap-2 border border-primary/20 bg-background/60 backdrop-blur-md shadow-lg"
                >
                  <span
                    class="inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500 shrink-0"
                    aria-hidden="true"
                  />
                  <div class="flex flex-col gap-0.5">
                    <span class="type-meta text-primary leading-none">
                      {{ $t('hero.hud.status') }}
                    </span>
                    <span
                      class="text-[10px] md:text-xs font-mono font-bold text-foreground uppercase leading-none"
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

            <button
              type="button"
              class="pointer-events-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-primary/25 bg-primary/8 text-primary type-label hover:bg-primary/12 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 touch-manipulation min-h-11 cursor-pointer"
              aria-haspopup="dialog"
              @click="onVibeBadgeClick"
              @pointerenter="prefetchVibeModal"
              @focus="prefetchVibeModal"
            >
              <Icon
                name="solar:magic-stick-3-bold-duotone"
                class="size-4 sm:size-[18px] shrink-0"
                aria-hidden="true"
              />
              <span class="text-[10px] sm:text-xs tracking-[0.12em]">{{
                $t('hero.expertiseBadge')
              }}</span>
              <span class="sr-only">{{ $t('about.vibeCodingOpen') }}</span>
            </button>
          </div>

          <div
            class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/10 to-transparent blur-[60px] md:blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"
          />
        </div>
      </div>

      <!-- Description + tags -->
      <div
        class="order-4 lg:col-start-1 hero-reveal hero-reveal--d60 space-y-3 sm:space-y-4 w-full max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
      >
        <p
          class="text-muted text-sm sm:text-base md:text-lg leading-relaxed font-medium tracking-tight text-pretty"
        >
          {{ $t('hero.description') }}
        </p>
        <div class="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-5 gap-y-2">
          <div
            v-for="tag in heroTags"
            :key="tag"
            class="flex items-center gap-1.5 sm:gap-2 type-label text-muted"
          >
            <div class="w-1 h-1 rounded-full bg-primary/40" />
            {{ $t(tag) }}
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="order-5 lg:col-start-1 grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 pt-4 sm:pt-5 border-t border-foreground/5 w-full max-w-lg lg:max-w-none mx-auto lg:mx-0"
      >
        <div
          v-for="(stat, i) in heroStats"
          :key="stat.label"
          class="hero-reveal space-y-0.5 md:space-y-1 group/stat"
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
  </section>
</template>

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
    rgba(255, 75, 92, 0.06) 2px
  );
}

.hero-photo-wrap {
  -webkit-tap-highlight-color: transparent;
}

.hero-photo-image {
  transition:
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1.05s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (any-hover: hover) {
  .hero-photo-wrap:hover .hero-photo-image {
    filter: brightness(1.03);
    transform: scale(1.02);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-photo-image {
    transition-duration: 0.01ms;
  }

  @media (any-hover: hover) {
    .hero-photo-wrap:hover .hero-photo-image {
      transform: none;
      filter: none;
    }
  }
}

.hero-reveal {
  animation: hero-reveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-reveal--d35 {
  animation-delay: 0.05s;
}

.hero-reveal--d60 {
  animation-delay: 0.1s;
}

.hero-reveal--d80 {
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

@media (prefers-reduced-motion: reduce) {
  .hero-reveal {
    animation: none;
  }
}

.hero-social-link {
  color: color-mix(in srgb, var(--foreground) 80%, transparent);
  background: color-mix(in srgb, var(--secondary) 88%, var(--background));
  border-color: color-mix(in srgb, var(--foreground) 10%, transparent);
  box-shadow: 0 8px 20px color-mix(in srgb, #000000 14%, transparent);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.hero-social-link:hover,
.hero-social-link:focus-visible {
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 18%, var(--background));
  border-color: color-mix(in srgb, var(--primary) 55%, transparent);
  box-shadow: 0 0 22px color-mix(in srgb, var(--primary) 40%, transparent);
}

.hero-role-fade-enter-active,
.hero-role-fade-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-role-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.hero-role-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

@media (prefers-reduced-motion: reduce) {
  .hero-role-fade-enter-active,
  .hero-role-fade-leave-active {
    transition: none;
  }
  .hero-role-fade-enter-from,
  .hero-role-fade-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
