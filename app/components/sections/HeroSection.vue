<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { activeRoleIndex, currentRole } = useBrandRoleRotator();
const { openVibeCodingModal, vibeCodingModalMounted } = useVibeCodingModal();
const { goToSection, sectionHref } = useSectionNavigation();
const { trackEvent } = useAnalytics();

function onPrimaryCtaClick(event: MouseEvent) {
  trackEvent('primary_cta_click', { location: 'hero' });
  goToSection(event, '#contact');
}

function onSecondaryCtaClick(event: MouseEvent) {
  trackEvent('view_case_study', { location: 'hero' });
  goToSection(event, '#case-studies');
}

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
  { value: '13+', labelKey: 'hero.stats.experience' },
  { value: '40+', labelKey: 'hero.stats.projects' },
  { value: '5', labelKey: 'hero.stats.technologies' },
];

onMounted(() => {
  showMarquee.value = true;
  requestAnimationFrame(() => {
    marqueeReady.value = true;
  });
});
</script>

<template>
  <section
    id="hero"
    class="relative min-h-svh flex items-start justify-center overflow-hidden px-5 md:px-10 pt-[calc(var(--availability-banner-h,0px)+6.25rem)] sm:pt-[calc(var(--availability-banner-h,0px)+6.75rem)] lg:pt-[calc(var(--availability-banner-h,0px)+7.25rem)] pb-8 md:pb-12 lg:pb-14"
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
      class="container mx-auto grid lg:grid-cols-[1.15fr_0.85fr] items-start gap-6 sm:gap-8 lg:gap-12 xl:gap-16 z-10 relative w-full"
    >
      <!-- Left Column: Header + CTAs + Tags -->
      <div
        class="order-1 lg:col-start-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7 lg:space-y-8 w-full"
      >
        <!-- Headline: H1 + name + differentiator -->
        <header
          class="space-y-3 sm:space-y-4 md:space-y-5 flex flex-col items-center lg:items-start text-center lg:text-left w-full"
        >
          <h1 class="space-y-2 sm:space-y-3 font-black tracking-tighter text-balance w-full">
            <span class="block text-2xl sm:text-3xl md:text-4xl text-gradient tracking-tight">
              {{ nameParts.first }} {{ nameParts.last }}
            </span>
            <span
              class="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] text-foreground text-pretty"
            >
              {{ $t('hero.h1') }}
            </span>
          </h1>

          <!-- Rotator pill badge for specialized sub-roles -->
          <p
            class="type-meta text-muted flex items-center justify-center lg:justify-start gap-2 pt-1"
          >
            <span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <Transition name="hero-role-fade" mode="out-in">
              <span :key="activeRoleIndex" class="font-bold text-foreground">
                {{ currentRole }}
              </span>
            </Transition>
          </p>

          <p
            class="hero-reveal hero-reveal--d35 w-full max-w-2xl text-base sm:text-lg text-muted text-center lg:text-left text-pretty font-medium leading-relaxed"
          >
            {{ $t('hero.description') }}
          </p>
        </header>

        <!-- CTA Action Cluster -->
        <div
          class="relative z-20 hero-reveal hero-reveal--d80 flex flex-col items-center lg:items-start gap-4 sm:gap-4.5 w-full"
        >
          <!-- Primary & Secondary Action CTAs -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
            <a
              class="hero-cta-btn hero-cta-btn--primary bg-primary text-primary-contrast rounded-xl sm:rounded-2xl px-6 sm:px-7 py-3.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base border border-primary/50 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full sm:w-auto"
              :href="sectionHref('#contact')"
              @click="onPrimaryCtaClick"
            >
              <Icon name="solar:chat-round-dots-bold-duotone" class="size-5 shrink-0" />
              <span class="whitespace-nowrap">{{ $t('hero.cta') }}</span>
            </a>
            <a
              class="hero-cta-btn hero-cta-btn--secondary rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 text-sm sm:text-base font-bold text-foreground border border-foreground/15 hover:border-primary/40 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2.5 text-center whitespace-nowrap bg-secondary/60 backdrop-blur-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full sm:w-auto"
              :href="sectionHref('#case-studies')"
              @click="onSecondaryCtaClick"
            >
              <Icon name="solar:bag-2-bold-duotone" class="size-5 shrink-0 text-primary" />
              <span class="whitespace-nowrap">{{ $t('hero.secondaryCta') }}</span>
            </a>
          </div>

          <!-- Credentials & Direct Channels (Download CV + Social Profiles) -->
          <div
            class="flex items-center gap-3 sm:gap-3.5 w-full sm:w-auto justify-center lg:justify-start"
          >
            <CvDownloadButton />

            <div class="h-6 w-px bg-foreground/15 shrink-0" aria-hidden="true" />

            <div class="flex items-center gap-2 shrink-0">
              <a
                href="https://linkedin.com/in/mrcego"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="$t('footer.socialLinkedIn')"
                class="hero-social-link inline-flex items-center justify-center size-10.5 sm:size-11 rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="simple-icons:linkedin"
                  class="size-4.5 shrink-0 pointer-events-none text-current"
                />
              </a>
              <a
                href="https://github.com/mrcego"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="$t('footer.socialGitHub')"
                class="hero-social-link inline-flex items-center justify-center size-10.5 sm:size-11 rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="simple-icons:github"
                  class="size-4.5 shrink-0 pointer-events-none text-current"
                />
              </a>
              <a
                href="mailto:cesargomezh90@gmail.com"
                :aria-label="$t('footer.socialEmail')"
                class="hero-social-link inline-flex items-center justify-center size-10.5 sm:size-11 rounded-xl border cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="solar:letter-linear"
                  class="size-4.5 shrink-0 pointer-events-none text-current"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div class="hero-reveal hero-reveal--d60 w-full max-w-2xl">
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
      </div>

      <!-- Right Column: Photo + Vibe Badge + Stats HUD Card -->
      <div
        class="order-2 lg:col-start-2 flex flex-col items-center gap-4 sm:gap-5 w-full max-w-[15rem] sm:max-w-md lg:max-w-none mx-auto lg:self-start"
      >
        <!-- Photo & Tilt Card -->
        <div
          ref="photoHitRef"
          class="group hero-photo-wrap relative perspective-[1000px] w-full"
          @pointermove="onPhotoPointerMove"
          @pointerleave="onPhotoPointerLeave"
        >
          <div
            class="relative z-0 flex w-full flex-col items-center gap-2.5 sm:gap-3 pointer-events-none"
            :style="photoTiltStyle"
          >
            <div
              class="surface-card relative w-full rounded-[1.8rem] md:rounded-[2.2rem] lg:rounded-[2.6rem] overflow-hidden border border-primary/25 glass p-1 md:p-1.5 shadow-2xl"
            >
              <div
                class="relative aspect-4/5 max-h-[min(12rem,26svh)] sm:max-h-[min(16rem,32svh)] md:max-h-[min(20rem,38svh)] lg:max-h-[min(26rem,52svh)] xl:max-h-[min(30rem,58svh)] mx-auto rounded-[1.5rem] md:rounded-[1.9rem] lg:rounded-[2.3rem] overflow-hidden bg-secondary"
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
                      class="text-xs font-mono font-bold text-foreground uppercase leading-none"
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
              class="pointer-events-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-full border border-primary/25 bg-primary/8 text-primary type-label hover:bg-primary/12 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 touch-manipulation min-h-11 cursor-pointer"
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
              <span class="text-xs tracking-[0.12em]">{{ $t('hero.expertiseBadge') }}</span>
              <span class="sr-only">{{ $t('about.vibeCodingOpen') }}</span>
            </button>
          </div>

          <div
            class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/10 to-transparent blur-[60px] md:blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"
          />
        </div>

        <!-- Stats HUD Card under photo -->
        <div
          class="w-full grid grid-cols-3 gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-foreground/10 bg-secondary/50 backdrop-blur-md shadow-xl"
        >
          <div
            v-for="(stat, i) in heroStats"
            :key="stat.labelKey"
            class="hero-reveal text-center space-y-0.5 sm:space-y-1 group/stat"
            :style="{ animationDelay: `${0.4 + i * 0.1}s` }"
          >
            <div
              class="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tighter group-hover/stat:text-primary transition-colors text-gradient"
            >
              {{ stat.value }}
            </div>
            <div
              class="text-xs text-muted group-hover/stat:text-foreground transition-colors font-medium leading-tight"
            >
              {{ $t(stat.labelKey) }}
            </div>
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
  box-shadow: 0 8px 20px color-mix(in srgb, var(--background) 14%, transparent);
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
