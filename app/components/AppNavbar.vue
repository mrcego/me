<template>
  <nav
    class="site-nav fixed left-0 right-0 z-100"
    :style="{ top: 'var(--availability-banner-h, 0px)', '--nav-progress': navProgress }"
  >
    <div
      class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pointer-events-none"
    >
      <div
        class="site-nav__shell flex items-center justify-between gap-2 sm:gap-3 rounded-full pointer-events-auto border min-w-0"
      >
        <!-- Logo Area -->
        <Motion
          :initial="
            motionInitial(
              { opacity: 0, x: -20, filter: 'blur(10px)' },
              { opacity: 1, x: 0, filter: 'blur(0px)' },
            )
          "
          :animate="motionAnimate({ opacity: 1, x: 0, filter: 'blur(0px)' })"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          class="flex items-center gap-1.5 sm:gap-2 group cursor-pointer min-w-0 shrink"
          @click="scrollToSection($event, '#hero')"
        >
          <div
            class="relative w-7 h-7 sm:w-8 sm:h-9 md:w-10 md:h-11 lg:w-12 lg:h-12 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
          >
            <div
              class="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500"
            />
            <NuxtImg
              src="/img/logo-final.svg"
              alt="César Gómez"
              width="48"
              height="48"
              class="w-full h-full object-contain scale-110 group-hover:scale-100 transition-transform duration-700 text-primary"
            />
          </div>
          <div class="site-nav__brand flex flex-col justify-center min-w-0">
            <span
              class="text-[11px] sm:text-sm md:text-base font-black tracking-tight text-foreground group-hover:text-primary leading-none uppercase truncate transition-colors duration-300 site-nav__brand-title"
            >
              {{ $t('hero.name') }}
            </span>
            <span
              class="hidden sm:block text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-muted truncate site-nav__brand-subtitle"
            >
              {{ $t('hero.tags.frontArch') }}
            </span>
          </div>
        </Motion>

        <!-- Desktop Navigation -->
        <div
          class="site-nav__links hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full px-1.5 xl:px-2 py-1 border shrink-0"
        >
          <template v-for="(link, i) in navLinks" :key="link.id">
            <Motion
              :initial="motionInitial({ opacity: 0, y: -10 }, { opacity: 1, y: 0 })"
              :animate="motionAnimate({ opacity: 1, y: 0 })"
              :transition="{
                duration: 0.6,
                delay: 0.2 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }"
            >
              <a
                :href="link.href"
                class="relative px-2 lg:px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold uppercase tracking-widest transition-all duration-300 isolate group/link overflow-hidden cursor-pointer"
                :class="[
                  isActiveSection(link.id) ? 'text-foreground' : 'text-muted hover:text-foreground',
                ]"
                @click="scrollToSection($event, link.href)"
              >
                <span class="relative z-10">{{ $t(link.name) }}</span>
                <!-- Active Background Pill -->
                <span
                  v-if="isActiveSection(link.id)"
                  class="absolute inset-0 bg-foreground/10 rounded-full z-0"
                />
                <!-- Hover Glow -->
                <span
                  v-else
                  class="absolute inset-0 bg-foreground/5 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 z-0"
                />
              </a>
            </Motion>
          </template>
        </div>

        <!-- Right Utilities -->
        <div class="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          <!-- Language Switcher -->
          <AppLanguageSwitcher />

          <!-- CV download (desktop) -->
          <a
            :href="cvHref"
            :download="cvFileName"
            class="hidden sm:flex w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] md:w-[50px] md:h-[50px] items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
            :aria-label="$t('hero.downloadCvAria', { file: cvFileName })"
            :title="$t('hero.downloadCv')"
          >
            <Icon
              name="solar:download-minimalistic-bold-duotone"
              class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
            />
          </a>

          <!-- Color Picker -->
          <ClientOnly>
            <div class="relative">
              <button
                type="button"
                class="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
                aria-label="Customize Theme"
                @click="showThemeSelector = !showThemeSelector"
              >
                <Icon
                  name="solar:crown-star-bold"
                  class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
                />
              </button>
              <!-- Theme Preset Selector Popover -->
              <Motion
                v-if="showThemeSelector"
                :initial="
                  motionInitial({ opacity: 0, scale: 0.9, y: 10 }, { opacity: 1, scale: 1, y: 0 })
                "
                :animate="motionAnimate({ opacity: 1, scale: 1, y: 0 })"
                :transition="{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }"
              >
                <div
                  class="absolute top-full right-0 mt-2 sm:mt-3 w-64 sm:w-72 lg:w-80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-4xl z-100 border border-foreground/10 bg-background"
                >
                  <div class="space-y-3 sm:space-y-4">
                    <div
                      class="flex items-center justify-between border-b border-foreground/5 pb-2 sm:pb-3"
                    >
                      <h3
                        class="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground"
                      >
                        {{ $t('nav.themePresets') }}
                      </h3>
                      <span
                        class="text-xs sm:text-sm bg-primary/10 text-primary px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold border border-primary/20"
                        >{{ THEME_PRESETS.length }} {{ $t('nav.modes') }}</span
                      >
                    </div>

                    <div
                      class="grid grid-cols-1 gap-1 sm:gap-1.5 max-h-56 sm:max-h-64 overflow-y-auto pr-1 custom-scrollbar"
                    >
                      <button
                        v-for="preset in THEME_PRESETS"
                        :key="preset.id"
                        type="button"
                        class="flex w-full items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 group/item border"
                        :class="[
                          currentThemeId === preset.id
                            ? 'bg-primary/10 border-primary/20 scale-[1.02]'
                            : 'bg-foreground/3 border-transparent hover:bg-foreground/5',
                        ]"
                        @click="setThemePreset(preset.id)"
                      >
                        <span class="flex items-center gap-2 sm:gap-3 min-w-0 text-left">
                          <span
                            class="inline-flex w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg sm:rounded-xl items-center justify-center relative overflow-hidden ring-2 ring-foreground/5 shadow-sm"
                            :style="{ background: preset.background }"
                            aria-hidden="true"
                          >
                            <span
                              class="absolute top-0 right-0 w-1/2 h-1/2"
                              :style="{ background: preset.primary }"
                            />
                            <span
                              v-if="preset.font === 'Fira Code'"
                              class="absolute inset-0 flex items-center justify-center text-[8px] sm:text-[10px] font-mono text-white/20 select-none"
                            >
                              fc
                            </span>
                          </span>
                          <span class="min-w-0">
                            <span
                              class="block text-xs sm:text-sm font-bold transition-colors"
                              :class="[
                                currentThemeId === preset.id ? 'text-primary' : 'text-foreground',
                              ]"
                            >
                              {{ $t('themes.' + preset.id) }}
                            </span>
                            <span
                              class="block text-xs sm:text-sm text-muted font-black uppercase tracking-widest opacity-60"
                            >
                              {{ preset.font }}
                            </span>
                          </span>
                        </span>
                        <Icon
                          v-if="currentThemeId === preset.id"
                          name="solar:check-circle-bold"
                          class="w-[42px] h-[42px] sm:w-[50px] sm:h-[50px] text-primary shrink-0"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Motion>
            </div>
          </ClientOnly>

          <div class="w-px h-3 sm:h-4 bg-foreground/10 mx-0.5 hidden lg:block" />

          <!-- CTA Button -->
          <a
            href="#contact"
            class="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-primary hover:bg-primary-hover text-primary-contrast px-3 xl:px-4 py-1.5 xl:py-2 rounded-full font-bold text-xs xl:text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,75,92,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group/btn shrink-0"
            @click="scrollToSection($event, '#contact')"
          >
            <span>{{ $t('nav.getInTouch') }}</span>
            <Icon
              name="solar:arrow-right-up-linear"
              class="w-[30px] h-[30px] xl:w-[34px] xl:h-[34px] group-hover/btn:rotate-45 transition-transform duration-300"
            />
          </a>

          <!-- Mobile Toggle -->
          <button
            type="button"
            class="lg:hidden w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-full text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary shrink-0"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isMobileMenuOpen"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <Icon
              :name="isMobileMenuOpen ? 'solar:close-square-linear' : 'solar:hamburger-menu-linear'"
              class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-95"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-2 sm:inset-4 md:inset-6 z-90 glass rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border border-foreground/10 shadow-4xl lg:hidden"
      >
        <button
          class="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 p-2 sm:p-3 text-muted hover:text-foreground"
          @click="isMobileMenuOpen = false"
        >
          <Icon
            name="solar:close-circle-linear"
            class="w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] md:w-[74px] md:h-[74px]"
          />
        </button>

        <nav class="space-y-3 sm:space-y-4 md:space-y-6 text-center px-4">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="link.href"
            class="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-foreground hover:text-primary transition-colors cursor-pointer"
            @click="scrollToSection($event, link.href)"
          >
            {{ $t(link.name) }}
          </a>
        </nav>
        <div class="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-3 sm:gap-4">
          <a
            href="#contact"
            class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-foreground text-background rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform text-xs sm:text-sm md:text-base"
            @click="scrollToSection($event, '#contact')"
          >
            {{ $t('nav.getInTouch') }}
            <Icon
              name="solar:arrow-right-up-bold"
              class="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] md:w-[54px] md:h-[54px]"
            />
          </a>
          <a
            :href="cvHref"
            :download="cvFileName"
            class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border border-foreground/20 text-foreground rounded-full font-black uppercase tracking-widest hover:scale-105 hover:border-primary/40 hover:text-primary transition-all text-xs sm:text-sm md:text-base"
            :aria-label="$t('hero.downloadCvAria', { file: cvFileName })"
            @click="isMobileMenuOpen = false"
          >
            <Icon
              name="solar:download-minimalistic-bold-duotone"
              class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
            />
            {{ $t('hero.downloadCv') }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { Motion } from 'motion-v';
import { ref } from 'vue';
import AppLanguageSwitcher from '~/components/AppLanguageSwitcher.vue';
import { useTheme } from '~/composables/useTheme';

const props = defineProps({
  activeSection: {
    type: String,
    default: 'hero',
  },
});

const { motionInitial, motionAnimate } = useMotionConfig();
const { progress } = useSmoothedScroll(0.14);
const navProgress = progress(120);
const { href: cvHref, fileName: cvFileName } = useCvDownload();

const isMobileMenuOpen = ref(false);
const { currentThemeId, THEME_PRESETS, setThemePreset } = useTheme();

const showThemeSelector = ref(false);

const navLinks = [
  { name: 'nav.home', href: '#hero', id: 'hero' },
  { name: 'nav.about', href: '#about', id: 'about' },
  { name: 'nav.techStack', href: '#tech-stack', id: 'tech-stack' },
  { name: 'nav.certifications', href: '#certifications', id: 'certifications' },
  { name: 'nav.testimonials', href: '#testimonials', id: 'testimonials' },
];

const isActiveSection = (id) => props.activeSection === id;

const scrollToSection = (e, href) => {
  e.preventDefault();
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.site-nav {
  --np: var(--nav-progress, 0);
  padding-block: calc(1rem + (1 - var(--np)) * 0.5rem);
}

@media (min-width: 640px) {
  .site-nav {
    padding-block: calc(0.75rem + (1 - var(--np)) * 0.75rem);
  }
}

.site-nav__shell {
  padding: calc(var(--np) * 0.5rem);
  border-color: color-mix(in srgb, #ffffff calc(var(--np) * 10%), transparent);
  background-color: color-mix(in srgb, var(--secondary) calc(var(--np) * 60%), transparent);
  backdrop-filter: blur(calc(var(--np) * 24px));
  box-shadow: 0 calc(var(--np) * 16px) calc(var(--np) * 40px)
    color-mix(in srgb, #000000 calc(var(--np) * 12%), transparent);
}

.site-nav__brand {
  opacity: calc(1 - var(--np) * 0.1);
}

@media (min-width: 1024px) {
  .site-nav__brand-title {
    font-size: calc(0.875rem + (1 - var(--np)) * 0.125rem);
    letter-spacing: calc(-0.025em + var(--np) * 0.005em);
  }

  .site-nav__brand-subtitle {
    font-size: 0.5625rem;
    letter-spacing: 0.2em;
    color: color-mix(in srgb, var(--muted) calc(100% - var(--np) * 10%), var(--muted));
  }
}

.site-nav__links {
  border-color: color-mix(in srgb, var(--foreground) calc(var(--np) * 5%), transparent);
  background-color: color-mix(in srgb, var(--foreground) calc(var(--np) * 3%), transparent);
  backdrop-filter: blur(calc(var(--np) * 12px));
  box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff calc(var(--np) * 5%), transparent);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-rgb, 255, 75, 92), 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--primary-rgb, 255, 75, 92), 0.4);
}
</style>
