<template>
  <nav
    class="site-nav fixed left-0 right-0 z-130"
    :style="{ top: 'var(--availability-banner-h, 0px)', '--nav-progress': navProgress }"
  >
    <div
      class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pointer-events-none"
    >
      <div
        class="site-nav__shell flex items-center justify-between gap-2 sm:gap-3 rounded-full pointer-events-auto border min-w-0"
      >
        <!-- Logo Area -->
        <button
          type="button"
          class="nav-reveal flex items-center gap-1.5 sm:gap-2 group cursor-pointer min-w-0 shrink appearance-none bg-transparent border-0 p-0 text-left"
          @click="scrollToSection($event, '#hero')"
        >
          <div
            class="relative w-7 h-7 sm:w-8 sm:h-9 md:w-10 md:h-11 lg:w-12 lg:h-12 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
          >
            <div
              class="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500"
            />
            <img
              src="/img/logo-final.svg?v=cg1"
              alt="César Gómez"
              width="48"
              height="48"
              decoding="async"
              class="w-full h-full object-contain scale-110 group-hover:scale-100 transition-transform duration-700"
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
        </button>

        <!-- Desktop Navigation -->
        <div
          class="site-nav__links hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full px-1.5 xl:px-2 py-1 border shrink-0"
        >
          <template v-for="(link, i) in navLinks" :key="link.id">
            <a
              :href="link.href"
              class="nav-reveal relative px-2 lg:px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold uppercase tracking-widest transition-all duration-300 isolate group/link overflow-hidden cursor-pointer"
              :class="[
                isActiveSection(link.id) ? 'text-foreground' : 'text-muted hover:text-foreground',
              ]"
              :style="{ animationDelay: `${0.2 + i * 0.05}s` }"
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
            <div ref="themeSelectorRef" class="relative">
              <button
                ref="themeTriggerRef"
                type="button"
                class="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                :aria-label="$t('nav.themePresets')"
                :aria-expanded="showThemeSelector"
                aria-haspopup="listbox"
                aria-controls="theme-preset-listbox"
                @click="toggleThemeSelector"
                @keydown="onThemeTriggerKeydown"
              >
                <Icon
                  name="solar:crown-star-bold"
                  class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]"
                />
              </button>
              <!-- Theme Preset Selector Popover -->
              <Transition
                enter-active-class="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                enter-from-class="opacity-0 scale-95 translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-2"
                @after-leave="onThemeMenuAfterLeave"
              >
                <div
                  v-if="showThemeSelector"
                  class="absolute top-full right-0 mt-2 sm:mt-3 w-64 sm:w-72 lg:w-80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-4xl z-100 border border-foreground/10 bg-background origin-top-right"
                >
                  <div class="space-y-3 sm:space-y-4">
                    <div
                      class="flex items-center justify-between border-b border-foreground/5 pb-2 sm:pb-3"
                    >
                      <h3
                        id="theme-preset-heading"
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
                      id="theme-preset-listbox"
                      ref="themeListboxRef"
                      role="listbox"
                      tabindex="-1"
                      aria-labelledby="theme-preset-heading"
                      class="grid grid-cols-1 gap-1 sm:gap-1.5 max-h-56 sm:max-h-64 overflow-y-auto pr-1 custom-scrollbar focus:outline-none"
                      @keydown="onThemeListKeydown"
                    >
                      <button
                        v-for="(preset, index) in THEME_PRESETS"
                        :id="`theme-option-${preset.id}`"
                        :key="preset.id"
                        type="button"
                        role="option"
                        :aria-selected="currentThemeId === preset.id"
                        :tabindex="focusedThemeIndex === index ? 0 : -1"
                        class="flex w-full items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 group/item border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                        :class="[
                          currentThemeId === preset.id
                            ? 'bg-primary/10 border-primary/20 scale-[1.02]'
                            : 'bg-foreground/3 border-transparent hover:bg-foreground/5',
                          focusedThemeIndex === index && currentThemeId !== preset.id
                            ? 'bg-foreground/5'
                            : '',
                        ]"
                        @click="selectTheme(preset.id)"
                        @focus="focusedThemeIndex = index"
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
              </Transition>
            </div>
          </ClientOnly>

          <div class="w-px h-3 sm:h-4 bg-foreground/10 mx-0.5 hidden lg:block" />

          <div ref="hireMenuRef" class="relative hidden lg:block shrink-0">
            <button
              type="button"
              class="hire-menu-trigger inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-black uppercase tracking-widest text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              :class="{ 'hire-menu-trigger--open': showHireMenu }"
              :aria-label="`${$t('nav.hire')} — ${$t('nav.hireMenu')}`"
              :aria-expanded="showHireMenu"
              aria-haspopup="menu"
              aria-controls="hire-profile-menu"
              @click="toggleHireMenu"
            >
              <span class="relative z-10">{{ $t('nav.hire') }}</span>
              <Icon
                name="lucide:chevron-down"
                class="relative z-10 size-3.5 transition-transform duration-300"
                :class="{ 'rotate-180': showHireMenu }"
              />
            </button>
            <Transition
              enter-active-class="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
            >
              <div
                v-if="showHireMenu"
                id="hire-profile-menu"
                role="menu"
                class="absolute top-full right-0 mt-2 sm:mt-3 w-64 rounded-2xl p-2 shadow-4xl z-100 border border-foreground/10 bg-background origin-top-right"
              >
                <p
                  class="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted"
                >
                  {{ $t('nav.hireMenu') }}
                </p>
                <NuxtLink
                  v-for="profile in hireProfileLinks"
                  :key="profile.to"
                  :to="localePath(profile.to)"
                  role="menuitem"
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5 hover:text-primary transition-colors"
                  @click="showHireMenu = false"
                >
                  <Icon :name="profile.icon" class="size-5 shrink-0 text-primary" />
                  <span>{{ $t(profile.name) }}</span>
                </NuxtLink>
                <div class="my-1 border-t border-foreground/5" />
                <a
                  href="#hire-profiles"
                  role="menuitem"
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
                  @click="goToHireSection($event)"
                >
                  <Icon name="solar:widget-2-bold-duotone" class="size-5 shrink-0" />
                  <span>{{ $t('nav.hireSection') }}</span>
                </a>
              </div>
            </Transition>
          </div>

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
            :aria-label="isMobileMenuOpen ? $t('a11y.closeMenu') : $t('a11y.openMenu')"
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
        class="fixed inset-2 sm:inset-4 md:inset-6 z-140 glass rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-y-auto border border-foreground/10 shadow-4xl lg:hidden overscroll-contain"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          class="sticky top-3 sm:top-4 ml-auto mr-3 sm:mr-4 mt-3 sm:mt-4 z-10 flex size-11 sm:size-12 items-center justify-center rounded-full border border-foreground/10 bg-background/80 text-muted shadow-2xl backdrop-blur-xl transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          :aria-label="$t('a11y.closeMenu')"
          @click="isMobileMenuOpen = false"
        >
          <Icon name="lucide:x" class="size-5 sm:size-6" />
        </button>

        <div
          class="flex min-h-[calc(100%-4.75rem)] flex-col items-center justify-center px-4 py-8 sm:py-10"
        >
          <nav class="space-y-3 sm:space-y-4 md:space-y-6 text-center">
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
          <div class="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-center">
            <p class="text-xs font-black uppercase tracking-[0.3em] text-muted">
              {{ $t('nav.hireMenu') }}
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <NuxtLink
                v-for="profile in hireProfileLinks"
                :key="profile.to"
                :to="localePath(profile.to)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/15 text-xs sm:text-sm font-black uppercase tracking-widest text-muted hover:text-primary hover:border-primary/40 transition-colors"
                @click="isMobileMenuOpen = false"
              >
                <Icon :name="profile.icon" class="size-4" />
                {{ $t(profile.name) }}
              </NuxtLink>
            </div>
            <a
              href="#hire-profiles"
              class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors"
              @click="goToHireSection($event)"
            >
              {{ $t('nav.hireSection') }}
              <Icon name="solar:arrow-right-linear" class="size-4" />
            </a>
          </div>
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
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { onClickOutside, useEventListener } from '@vueuse/core';
import AppLanguageSwitcher from '~/components/AppLanguageSwitcher.vue';
import { useTheme } from '~/composables/useTheme';

const props = defineProps({
  activeSection: {
    type: String,
    default: 'hero',
  },
});

const { progress } = useSmoothedScroll(0.14);
const navProgress = progress(120);
const { href: cvHref, fileName: cvFileName } = useCvDownload();
const localePath = useLocalePath();

const hireProfileLinks = [
  {
    name: 'hireProfiles.hireForVue',
    to: '/vue-frontend-developer',
    icon: 'logos:vue',
  },
  {
    name: 'hireProfiles.hireForNode',
    to: '/nodejs-backend-developer',
    icon: 'logos:nodejs-icon',
  },
  {
    name: 'hireProfiles.hireForAi',
    to: '/ai-engineer',
    icon: 'solar:cpu-bolt-bold-duotone',
  },
];

const isMobileMenuOpen = ref(false);
useBodyScrollLock(isMobileMenuOpen);
const { currentThemeId, THEME_PRESETS, setThemePreset, previewTheme, cancelThemePreview } =
  useTheme();

const showHireMenu = ref(false);
const hireMenuRef = ref(null);

const showThemeSelector = ref(false);
const themeSelectorRef = ref(null);
const themeTriggerRef = ref(null);
const themeListboxRef = ref(null);
const focusedThemeIndex = ref(0);
const restoreThemeTriggerFocus = ref(false);
/** True when keyboard focus has previewed a theme that isn't the persisted selection. */
const isThemePreviewActive = ref(false);

function currentThemeIndex() {
  const idx = THEME_PRESETS.findIndex((p) => p.id === currentThemeId.value);
  return idx >= 0 ? idx : 0;
}

function closeThemeSelector({ restoreFocus = true, revertPreview = true } = {}) {
  if (!showThemeSelector.value) return;
  if (revertPreview && isThemePreviewActive.value) {
    cancelThemePreview();
    isThemePreviewActive.value = false;
  }
  restoreThemeTriggerFocus.value = restoreFocus;
  showThemeSelector.value = false;
}

function onThemeMenuAfterLeave() {
  if (restoreThemeTriggerFocus.value) {
    themeTriggerRef.value?.focus();
    restoreThemeTriggerFocus.value = false;
  }
}

function openThemeSelector() {
  showHireMenu.value = false;
  isThemePreviewActive.value = false;
  focusedThemeIndex.value = currentThemeIndex();
  showThemeSelector.value = true;
  scrollFocusedThemeIntoView({ focus: true });
}

function toggleThemeSelector() {
  if (showThemeSelector.value) {
    closeThemeSelector();
  } else {
    openThemeSelector();
  }
}

function toggleHireMenu() {
  if (showHireMenu.value) {
    showHireMenu.value = false;
    return;
  }
  closeThemeSelector({ restoreFocus: false });
  showHireMenu.value = true;
}

const route = useRoute();
const router = useRouter();

async function goToHireSection(event) {
  event.preventDefault();
  showHireMenu.value = false;
  isMobileMenuOpen.value = false;

  const homePath = localePath('/');
  if (route.path === homePath) {
    scrollToSection(event, '#hire-profiles');
    return;
  }

  await router.push({ path: homePath, hash: '#hire-profiles' });
}

/** Commit selection (click / Enter / Space). */
function selectTheme(id) {
  setThemePreset(id);
  isThemePreviewActive.value = false;
  focusedThemeIndex.value = THEME_PRESETS.findIndex((p) => p.id === id);
  scrollFocusedThemeIntoView({ focus: false });
}

/** Live preview while moving focus with the keyboard — does not persist. */
function previewFocusedTheme() {
  const preset = THEME_PRESETS[focusedThemeIndex.value];
  if (!preset) return;
  previewTheme(preset.id);
  isThemePreviewActive.value = preset.id !== currentThemeId.value;
}

/** Scroll the listbox so the focused/selected option is visible (not stuck at top). */
function scrollFocusedThemeIntoView({ focus = false } = {}) {
  const run = () => {
    const listbox = themeListboxRef.value;
    if (!listbox) return false;

    const index = focusedThemeIndex.value;
    const options = listbox.querySelectorAll('[role="option"]');
    const option = options[index];
    if (!option) return false;

    const listRect = listbox.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    const offsetWithinList = optionRect.top - listRect.top + listbox.scrollTop;
    listbox.scrollTop = Math.max(
      0,
      offsetWithinList - listbox.clientHeight / 2 + optionRect.height / 2,
    );

    if (focus) {
      option.focus({ preventScroll: true });
    }
    return true;
  };

  nextTick(() => {
    if (run()) return;
    requestAnimationFrame(() => {
      if (run()) return;
      requestAnimationFrame(run);
    });
  });
}

function focusThemeOption(index, { preview = true } = {}) {
  focusedThemeIndex.value = index;
  scrollFocusedThemeIntoView({ focus: true });
  if (preview) previewFocusedTheme();
}

function moveThemeFocus(delta) {
  const count = THEME_PRESETS.length;
  if (!count) return;
  focusedThemeIndex.value = (focusedThemeIndex.value + delta + count) % count;
  focusThemeOption(focusedThemeIndex.value, { preview: true });
}

function onThemeTriggerKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    if (!showThemeSelector.value) {
      event.preventDefault();
      openThemeSelector();
    }
  } else if (event.key === 'Escape' && showThemeSelector.value) {
    event.preventDefault();
    closeThemeSelector();
  }
}

function onThemeListKeydown(event) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveThemeFocus(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveThemeFocus(-1);
      break;
    case 'Home':
      event.preventDefault();
      focusThemeOption(0, { preview: true });
      break;
    case 'End':
      event.preventDefault();
      focusThemeOption(THEME_PRESETS.length - 1, { preview: true });
      break;
    case 'Enter':
    case ' ': {
      event.preventDefault();
      const preset = THEME_PRESETS[focusedThemeIndex.value];
      if (preset) selectTheme(preset.id);
      break;
    }
    case 'Escape':
      event.preventDefault();
      closeThemeSelector();
      break;
    case 'Tab':
      // Cancel preview and leave.
      closeThemeSelector({ restoreFocus: false });
      break;
    default:
      break;
  }
}

onClickOutside(themeSelectorRef, () => {
  closeThemeSelector({ restoreFocus: false });
});

onClickOutside(hireMenuRef, () => {
  showHireMenu.value = false;
});

useEventListener(
  'keydown',
  (event) => {
    if (event.key !== 'Escape') return;
    if (showThemeSelector.value) {
      closeThemeSelector();
    }
    if (showHireMenu.value) {
      showHireMenu.value = false;
    }
  },
  { passive: true },
);

watch(showThemeSelector, (open) => {
  if (open) {
    isThemePreviewActive.value = false;
    focusedThemeIndex.value = currentThemeIndex();
    scrollFocusedThemeIntoView({ focus: true });
  }
});

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

  // Unlock body first — measuring while position:fixed yields wrong targets
  // and unlock's restore would cancel an in-flight scrollTo.
  isMobileMenuOpen.value = false;

  nextTick(() => {
    requestAnimationFrame(() => {
      const element = document.getElementById(targetId);
      if (!element) return;

      // content-visibility: auto under-reports offscreen section heights, so
      // scroll destinations land short until real layout is forced.
      document.querySelectorAll('.portfolio-content > [id]').forEach((section) => {
        if (section instanceof HTMLElement) {
          section.style.contentVisibility = 'visible';
        }
      });

      // Uses html scroll-padding-top for the fixed nav + availability banner.
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
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

.hire-menu-trigger {
  position: relative;
  isolation: isolate;
  border: 1.5px solid color-mix(in srgb, var(--primary) 45%, transparent);
  background: color-mix(in srgb, var(--secondary) 88%, var(--background));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent),
    0 0 18px color-mix(in srgb, var(--primary) 22%, transparent);
  transition:
    color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease,
    border-color 0.25s ease;
}

.hire-menu-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  transition: background-color 0.25s ease;
}

.hire-menu-trigger:hover,
.hire-menu-trigger--open {
  color: var(--primary);
  border-color: var(--primary);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--primary) 28%, transparent),
    0 0 26px color-mix(in srgb, var(--primary) 38%, transparent);
}

.hire-menu-trigger:hover::before,
.hire-menu-trigger--open::before {
  background: color-mix(in srgb, var(--primary) 16%, transparent);
}

.hire-menu-trigger:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .hire-menu-trigger {
    border-color: color-mix(in srgb, var(--primary) 55%, transparent);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    box-shadow: 0 0 14px color-mix(in srgb, var(--primary) 20%, transparent);
  }

  .hire-menu-trigger:hover,
  .hire-menu-trigger--open {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 16%, transparent);
  }
}

.nav-reveal {
  animation: nav-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes nav-reveal {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-reveal {
    animation: none;
  }
}
</style>
