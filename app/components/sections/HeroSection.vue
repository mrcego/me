<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { activeRoleIndex, currentRole } = useBrandRoleRotator();
const { openVibeCodingModal, vibeCodingModalMounted } = useVibeCodingModal();
const { armGate, unlockDirect } = usePortfolioTerminalArmGate();
const { goToSection, sectionHref } = useSectionNavigation();
const { trackEvent } = useAnalytics();
const prefersReducedMotion = usePrefersReducedMotion();
const isMobileDevice = useMatchMedia('(max-width: 1023px), (pointer: coarse)');

function onPrimaryCtaClick(event: MouseEvent) {
  trackEvent('primary_cta_click', { location: 'hero' });
  goToSection(event, '#contact');
}

function onSecondaryCtaClick(event: MouseEvent) {
  trackEvent('view_case_study', { location: 'hero' });
  goToSection(event, '#case-studies');
}

function onTerminalPromptClick() {
  trackEvent('terminal_shortcut_click', { location: 'hero' });
  if (isMobileDevice.value) {
    unlockDirect({ preferReducedMotion: prefersReducedMotion.value });
  } else {
    armGate();
  }
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
  { value: '13+', labelKey: 'hero.stats.experience', icon: 'solar:calendar-date-bold-duotone' },
  { value: '40+', labelKey: 'hero.stats.projects', icon: 'solar:rocket-2-bold-duotone' },
  {
    value: '5',
    labelKey: 'hero.stats.technologies',
    icon: 'solar:layers-minimalistic-bold-duotone',
  },
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
    class="h-card vcard relative min-h-svh flex items-center justify-center overflow-hidden px-5 md:px-10 pt-[calc(var(--availability-banner-h,0px)+4.75rem)] sm:pt-[calc(var(--availability-banner-h,0px)+5.25rem)] lg:pt-[calc(var(--availability-banner-h,0px)+5.5rem)] xl:pt-[calc(var(--availability-banner-h,0px)+5.75rem)] 2xl:pt-[calc(var(--availability-banner-h,0px)+6.25rem)] pb-6 md:pb-8 lg:pb-10"
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
      class="container mx-auto grid xl:grid-cols-[1.22fr_0.78fr] 2xl:grid-cols-[1.18fr_0.82fr] items-center gap-6 lg:gap-8 xl:gap-10 2xl:gap-14 3xl:gap-20 z-10 relative w-full"
    >
      <!-- Left Column: Header + CTAs + Tags -->
      <div
        class="order-1 xl:col-start-1 flex flex-col items-center xl:items-start text-center xl:text-left space-y-4 sm:space-y-5 lg:space-y-5 xl:space-y-6 2xl:space-y-7 3xl:space-y-8 w-full max-w-2xl xl:max-w-none mx-auto"
      >
        <!-- Headline: H1 + name + differentiator -->
        <header
          class="space-y-2 sm:space-y-2.5 md:space-y-3 flex flex-col items-center xl:items-start text-center xl:text-left w-full"
        >
          <h1 class="space-y-1.5 sm:space-y-2 font-black tracking-tighter text-balance w-full">
            <span
              class="p-name fn block text-xl sm:text-2xl md:text-3xl 2xl:text-4xl text-gradient tracking-tight"
            >
              {{ nameParts.first }} {{ nameParts.last }}
            </span>
            <span
              class="block text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] 2xl:text-[3.75rem] 3xl:text-[4.25rem] leading-[1.08] text-foreground text-pretty"
            >
              {{ $t('hero.h1') }}
            </span>
          </h1>

          <!-- Rotator & Interactive Terminal Trigger Strip -->
          <div
            class="flex flex-wrap items-center justify-center xl:justify-start gap-2.5 sm:gap-3 pt-0.5 w-full"
          >
            <!-- Rotator pill badge for specialized sub-roles -->
            <p class="type-meta text-muted flex items-center justify-center xl:justify-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <Transition name="hero-role-fade" mode="out-in">
                <span :key="activeRoleIndex" class="p-job-title title font-bold text-foreground">
                  {{ currentRole }}
                </span>
              </Transition>
            </p>

            <span class="text-muted/40 hidden sm:inline" aria-hidden="true">•</span>

            <!-- Interactive Terminal Trigger Chip (Direct unlock on mobile, Arms Flight Gate on desktop) -->
            <button
              type="button"
              class="group/term inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 hover:bg-secondary border border-primary/20 hover:border-primary/50 text-muted hover:text-foreground transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              :aria-label="
                isMobileDevice ? $t('hero.terminalChipAriaMobile') : $t('hero.terminalChipAria')
              "
              :title="
                isMobileDevice
                  ? $t('hero.terminalChipTooltipMobile')
                  : $t('hero.terminalChipTooltip')
              "
              @click="onTerminalPromptClick"
            >
              <Icon
                name="solar:code-file-bold-duotone"
                class="size-3.5 text-primary group-hover/term:rotate-12 transition-transform"
                aria-hidden="true"
              />
              <span class="font-mono text-xs hidden sm:inline">{{
                $t('hero.terminalPrompt')
              }}</span>
              <span class="font-mono text-xs sm:hidden">{{ $t('hero.terminalPromptMobile') }}</span>
              <span
                class="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold"
                >/</span
              >
              <span
                class="sm:hidden inline-flex items-center font-mono text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold"
                >CMD</span
              >
            </button>
          </div>

          <p
            class="p-note note hero-reveal hero-reveal--d35 w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl text-sm sm:text-base lg:text-base xl:text-[1.0625rem] 2xl:text-lg 3xl:text-xl text-muted text-center xl:text-left text-pretty font-medium leading-relaxed"
          >
            {{ $t('hero.description') }}
          </p>
          <!-- Hidden Microformat GEO Attributes -->
          <span class="p-locality hidden" aria-hidden="true">Cartagena</span>
          <span class="p-country-name hidden" aria-hidden="true">Colombia</span>
        </header>

        <!-- CTA Action Cluster -->
        <div
          class="relative z-20 hero-reveal hero-reveal--d80 flex flex-col items-center xl:items-start gap-3.5 sm:gap-4 w-full"
        >
          <!-- Primary & Secondary Action CTAs -->
          <div
            class="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-3.5 2xl:gap-4 w-full sm:w-auto"
          >
            <a
              class="hero-cta-btn hero-cta-btn--primary bg-primary text-primary-contrast rounded-xl sm:rounded-2xl px-5 sm:px-6 2xl:px-7 3xl:px-8 py-3 2xl:py-3.5 3xl:py-4 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base 2xl:text-lg border border-primary/50 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full sm:w-auto"
              :href="sectionHref('#contact')"
              @click="onPrimaryCtaClick"
            >
              <Icon name="solar:chat-round-dots-bold-duotone" class="size-5 2xl:size-6 shrink-0" />
              <span class="whitespace-nowrap">{{ $t('hero.cta') }}</span>
            </a>
            <a
              class="hero-cta-btn hero-cta-btn--secondary rounded-xl sm:rounded-2xl px-4.5 sm:px-5.5 2xl:px-6.5 3xl:px-7.5 py-3 2xl:py-3.5 3xl:py-4 text-sm sm:text-base 2xl:text-lg font-bold text-foreground border border-foreground/15 hover:border-primary/40 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2.5 text-center whitespace-nowrap bg-secondary/60 backdrop-blur-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full sm:w-auto"
              :href="sectionHref('#case-studies')"
              @click="onSecondaryCtaClick"
            >
              <Icon
                name="solar:bag-2-bold-duotone"
                class="size-5 2xl:size-6 shrink-0 text-primary"
              />
              <span class="whitespace-nowrap">{{ $t('hero.secondaryCta') }}</span>
            </a>
          </div>

          <!-- Credentials & Direct Channels (Download CV + Social Profiles) -->
          <div
            class="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-center xl:justify-start"
          >
            <CvDownloadButton />

            <div class="h-6 w-px bg-foreground/15 shrink-0" aria-hidden="true" />

            <div class="flex items-center gap-2 shrink-0">
              <a
                href="https://linkedin.com/in/mrcego"
                target="_blank"
                rel="me noopener noreferrer"
                :aria-label="$t('footer.socialLinkedIn')"
                class="u-url url hero-social-link inline-flex items-center justify-center size-10 sm:size-10.5 2xl:size-11.5 rounded-xl border cursor-pointer active:scale-95 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="simple-icons:linkedin"
                  class="size-4 sm:size-4.5 2xl:size-5 shrink-0 pointer-events-none text-current"
                />
              </a>
              <a
                href="https://github.com/mrcego"
                target="_blank"
                rel="me noopener noreferrer"
                :aria-label="$t('footer.socialGitHub')"
                class="u-url url hero-social-link inline-flex items-center justify-center size-10 sm:size-10.5 2xl:size-11.5 rounded-xl border cursor-pointer active:scale-95 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="simple-icons:github"
                  class="size-4 sm:size-4.5 2xl:size-5 shrink-0 pointer-events-none text-current"
                />
              </a>
              <a
                href="mailto:cesargomezh90@gmail.com"
                :aria-label="$t('footer.socialEmail')"
                class="u-email email hero-social-link inline-flex items-center justify-center size-10 sm:size-10.5 2xl:size-11.5 rounded-xl border cursor-pointer active:scale-95 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Icon
                  name="solar:letter-linear"
                  class="size-4 sm:size-4.5 2xl:size-5 shrink-0 pointer-events-none text-current"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div class="hero-reveal hero-reveal--d60 w-full max-w-2xl 2xl:max-w-3xl">
          <div
            class="flex flex-wrap justify-center xl:justify-start gap-x-3.5 sm:gap-x-4 2xl:gap-x-5 gap-y-1.5 2xl:gap-y-2"
          >
            <div
              v-for="tag in heroTags"
              :key="tag"
              class="flex items-center gap-1.5 sm:gap-2 type-label text-muted text-xs sm:text-sm 2xl:text-base"
            >
              <div class="w-1 h-1 2xl:w-1.5 2xl:h-1.5 rounded-full bg-primary/40" />
              {{ $t(tag) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Photo + Vibe Badge + Stats HUD Card -->
      <div
        class="order-2 xl:col-start-2 flex flex-col items-center gap-3 sm:gap-3.5 2xl:gap-4.5 3xl:gap-5 w-full max-w-68 sm:max-w-sm md:max-w-md xl:max-w-md 2xl:max-w-md 3xl:max-w-[32rem] mx-auto xl:self-center"
      >
        <!-- Photo & Tilt Card -->
        <div
          ref="photoHitRef"
          class="group hero-photo-wrap relative perspective-[1000px] w-full"
          @pointermove="onPhotoPointerMove"
          @pointerleave="onPhotoPointerLeave"
        >
          <div
            class="relative z-0 flex w-full flex-col items-center gap-2 sm:gap-2.5 2xl:gap-3 pointer-events-none"
            :style="photoTiltStyle"
          >
            <div
              class="surface-card relative w-full rounded-2xl sm:rounded-3xl xl:rounded-4xl overflow-hidden border border-primary/25 glass p-1 md:p-1.5 2xl:p-2 shadow-2xl"
            >
              <div
                class="relative aspect-4/5 max-h-[min(13rem,28svh)] sm:max-h-[min(16rem,30svh)] md:max-h-[min(18.5rem,34svh)] xl:max-h-[min(22rem,38svh)] 2xl:max-h-[min(27rem,46svh)] 3xl:max-h-[min(31rem,50svh)] mx-auto rounded-xl sm:rounded-2xl xl:rounded-3xl overflow-hidden bg-secondary"
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
                  sizes="154px sm:205px md:256px lg:392px xl:448px 2xl:512px 3xl:576px"
                  class="u-photo photo surface-card__image hero-photo-image w-full h-full object-cover"
                />

                <div class="surface-card__glow absolute inset-0 z-20 bg-primary/5 hero-scanline" />

                <div
                  class="absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 z-20 glass px-2 py-1 md:px-2.5 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 border border-primary/20 bg-background/60 backdrop-blur-md shadow-lg"
                >
                  <span
                    class="inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500 shrink-0 animate-pulse"
                    aria-hidden="true"
                  />
                  <div class="flex flex-col gap-0.5">
                    <span class="type-meta text-primary leading-none text-[10px] md:text-xs">
                      {{ $t('hero.hud.status') }}
                    </span>
                    <span
                      class="text-[11px] md:text-xs font-mono font-bold text-foreground uppercase leading-none"
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
              class="pointer-events-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 2xl:px-4 2xl:py-2 rounded-full border border-primary/25 bg-primary/8 text-primary type-label hover:bg-primary/12 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 touch-manipulation min-h-9 cursor-pointer text-xs 2xl:text-sm"
              aria-haspopup="dialog"
              @click="onVibeBadgeClick"
              @pointerenter="prefetchVibeModal"
              @focus="prefetchVibeModal"
            >
              <Icon
                name="solar:magic-stick-3-bold-duotone"
                class="size-3.5 sm:size-4 2xl:size-4.5 shrink-0"
                aria-hidden="true"
              />
              <span class="text-xs 2xl:text-sm tracking-[0.12em]">{{
                $t('hero.expertiseBadge')
              }}</span>
              <span class="sr-only">{{ $t('about.vibeCodingOpen') }}</span>
            </button>
          </div>

          <div
            class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/15 via-primary/5 to-transparent blur-[60px] md:blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none"
          />
        </div>

        <!-- Stats HUD Dock under photo -->
        <div
          class="w-full grid grid-cols-3 gap-1.5 sm:gap-2 2xl:gap-2.5 3xl:gap-3.5 p-2 sm:p-2.5 2xl:p-3 3xl:p-4 rounded-2xl sm:rounded-3xl border border-primary/20 bg-secondary/60 backdrop-blur-md shadow-xl"
        >
          <div
            v-for="(stat, i) in heroStats"
            :key="stat.labelKey"
            class="hero-reveal text-center p-1.5 sm:p-2.5 2xl:p-3 rounded-xl bg-background/50 border border-foreground/5 group/stat hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0"
            :style="{ animationDelay: `${0.4 + i * 0.1}s` }"
          >
            <Icon
              :name="stat.icon"
              class="size-3.5 sm:size-4 2xl:size-5 text-primary/70 group-hover/stat:text-primary transition-colors shrink-0"
              aria-hidden="true"
            />
            <div
              class="text-base sm:text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl font-black text-foreground tracking-tighter group-hover/stat:text-primary transition-colors text-gradient"
            >
              {{ stat.value }}
            </div>
            <div
              class="text-[10px] sm:text-[11px] 2xl:text-xs 3xl:text-sm text-muted group-hover/stat:text-foreground transition-colors font-medium leading-tight text-center text-balance break-normal hyphens-none"
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
