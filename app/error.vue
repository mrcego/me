<script setup lang="ts">
import type { NuxtError } from '#app';
import { computed, watch } from 'vue';

const props = defineProps<{
  error: NuxtError;
}>();

/** Palette tokens — error.vue replaces app.vue, so theme must boot here. */
useTheme();

const { t, locale, setLocale } = useI18n();
const localePath = useLocalePath();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();

const isNotFound = computed(() => props.error?.statusCode === 404);

const statusCode = computed(() => props.error?.statusCode ?? 500);

const title = computed(() =>
  isNotFound.value ? t('error.notFound.title') : t('error.generic.title'),
);

const lead = computed(() =>
  isNotFound.value ? t('error.notFound.lead') : t('error.generic.lead'),
);

const eyebrow = computed(() =>
  isNotFound.value ? t('error.notFound.eyebrow') : t('error.generic.eyebrow'),
);

useSeoMeta({
  title: () =>
    isNotFound.value
      ? t('error.notFound.metaTitle')
      : t('error.generic.metaTitle', { code: statusCode.value }),
  description: () => lead.value,
  robots: 'noindex, follow',
});

/** Netlify serves a single 404.html — sync locale from the requested path. */
function localeFromPath(pathname: string): 'en' | 'es' {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
}

function currentPathname(): string {
  if (import.meta.client) return window.location.pathname;
  try {
    return useRequestURL().pathname;
  } catch {
    return '/';
  }
}

watch(
  () => currentPathname(),
  async (pathname) => {
    const next = localeFromPath(pathname);
    if (locale.value !== next) {
      await setLocale(next);
    }
  },
  { immediate: true },
);

async function goHome() {
  await clearError({ redirect: localePath('/') });
}

async function goContact() {
  const home = localePath('/');
  await clearError({ redirect: home.endsWith('/') ? `${home}#contact` : `${home}/#contact` });
}
</script>

<template>
  <div class="error-shell bg-background text-foreground min-h-dvh relative overflow-hidden">
    <!-- Atmospheric plane — CSS only (SSR-safe, no canvas) -->
    <div class="error-shell__atmosphere" aria-hidden="true" />
    <div class="error-shell__grid" aria-hidden="true" />

    <!-- Same chrome language as AppNavbar: full-width inset shell, not a corner chip -->
    <header class="error-shell__nav">
      <div
        class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pointer-events-none"
      >
        <div class="error-shell__shell pointer-events-auto flex items-center justify-between gap-3">
          <button
            type="button"
            class="flex items-center gap-2 sm:gap-3 min-w-0 appearance-none bg-transparent border-0 p-0 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
            @click="goHome"
          >
            <span
              class="relative size-9 sm:size-10 md:size-11 overflow-hidden rounded-full bg-primary/10 shrink-0"
            >
              <img
                src="/img/logo-final.svg?v=cg2"
                alt=""
                width="44"
                height="44"
                decoding="async"
                class="w-full h-full object-contain scale-110"
              />
            </span>
            <span class="flex flex-col min-w-0">
              <span
                class="text-xs sm:text-sm md:text-base font-black uppercase tracking-tight leading-none text-foreground group-hover:text-primary transition-colors truncate"
              >
                {{ $t('hero.name') }}
              </span>
              <span
                class="hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mt-1"
              >
                {{ $t('nav.brandRole') }}
              </span>
            </span>
          </button>

          <button
            type="button"
            class="shrink-0 inline-flex items-center justify-center gap-2 min-h-11 px-4 sm:px-5 rounded-full bg-primary text-primary-contrast text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            @click="goContact"
          >
            <Icon name="solar:letter-bold" class="size-4 sm:size-5 shrink-0" aria-hidden="true" />
            <span>{{ $t('nav.cta') }}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="relative z-10 flex min-h-dvh flex-col">
      <main
        id="main-content"
        class="error-page flex flex-1 flex-col items-center justify-center px-6 md:px-12 pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24"
        tabindex="-1"
      >
        <Motion
          class="w-full max-w-2xl text-center space-y-8 md:space-y-10"
          :initial="motionInitial({ opacity: 1, y: 12 }, { opacity: 1, y: 0 })"
          :animate="motionInView({ opacity: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.42 })"
        >
          <div class="flex items-center justify-center gap-4">
            <div class="h-0.5 w-8 bg-primary/35" aria-hidden="true" />
            <p class="type-eyebrow tracking-[0.35em]">{{ eyebrow }}</p>
            <div class="h-0.5 w-8 bg-primary/35" aria-hidden="true" />
          </div>

          <p
            class="error-page__code font-black tracking-tighter leading-none text-gradient select-none"
            aria-hidden="true"
          >
            {{ statusCode }}
          </p>

          <div class="space-y-4">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] text-balance"
            >
              {{ title }}
            </h1>
            <p
              class="text-base sm:text-lg md:text-xl text-muted font-medium leading-relaxed text-pretty max-w-xl mx-auto"
            >
              {{ lead }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              class="btn-premium bg-primary text-primary-contrast rounded-2xl! px-8! py-4! border-none! inline-flex items-center justify-center gap-3 min-h-12 w-full sm:w-auto"
              @click="goHome"
            >
              <!-- arrow-left is already bundled; home-2-duotone was missing from the icon scan -->
              <Icon name="solar:arrow-left-linear" class="size-5 shrink-0" aria-hidden="true" />
              {{ isNotFound ? $t('error.notFound.home') : $t('error.generic.home') }}
            </button>
            <button
              type="button"
              class="btn-premium glass rounded-2xl! px-8! py-4! border border-foreground/10! inline-flex items-center justify-center gap-3 font-black uppercase tracking-widest min-h-12 w-full sm:w-auto"
              @click="goContact"
            >
              <Icon name="solar:letter-bold" class="size-5 shrink-0" aria-hidden="true" />
              {{ $t('nav.cta') }}
            </button>
          </div>

          <p v-if="!isNotFound && error?.message" class="text-xs text-muted/70 font-mono break-all">
            {{ error.message }}
          </p>
        </Motion>
      </main>
    </div>
  </div>
</template>

<style scoped>
.error-shell__nav {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 40;
  padding-block: 1rem;
}

@media (min-width: 640px) {
  .error-shell__nav {
    padding-block: 1.25rem;
  }
}

.error-shell__shell {
  min-height: 3.5rem;
  padding: 0.4rem 0.45rem 0.4rem 0.55rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--foreground) 10%, transparent);
  background-color: color-mix(in srgb, var(--background) 86%, transparent);
  backdrop-filter: blur(14px) saturate(1.25);
  -webkit-backdrop-filter: blur(14px) saturate(1.25);
  box-shadow: 0 10px 28px color-mix(in srgb, #000000 16%, transparent);
}

@media (min-width: 640px) {
  .error-shell__shell {
    min-height: 3.75rem;
    padding: 0.45rem 0.5rem 0.45rem 0.65rem;
  }
}

.error-shell__atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 70% 55% at 50% 0%,
      color-mix(in srgb, var(--primary) 22%, transparent),
      transparent 70%
    ),
    radial-gradient(
      ellipse 50% 40% at 80% 80%,
      color-mix(in srgb, var(--primary) 10%, transparent),
      transparent 65%
    );
}

.error-shell__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.28;
  background-image:
    linear-gradient(color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--foreground) 6%, transparent) 1px,
      transparent 1px
    );
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 75% 60% at 50% 40%, #000 20%, transparent 75%);
}

.error-page__code {
  font-size: clamp(5.5rem, 18vw, 10rem);
  letter-spacing: -0.06em;
}

@media (prefers-reduced-motion: reduce) {
  .error-shell__atmosphere,
  .error-shell__grid {
    opacity: 0.5;
  }
}
</style>
