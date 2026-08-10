<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { onClickOutside, onKeyStroke, useEventListener } from '@vueuse/core';
import AppLanguageSwitcher from '~/components/layout/AppLanguageSwitcher.vue';
import { hireProfileRoutes } from '~/config/routes.manifest';
import { useMatchMedia, usePrefersReducedMotion } from '~/composables/ui/useMatchMedia';
import { usePortfolioTerminalLogoUnlock } from '~/composables/terminal/usePortfolioTerminalShortcut';
import { useTheme } from '~/composables/ui/useTheme';
import { createLogoLongPressController } from '~/utils/logoLongPress';

const { activeSection } = usePortfolio();
const { brandRoles } = useBrandRoleRotator();

// Keeps the shared scroll RAF alive for --nav-progress / --page-progress on :root.
useSmoothedScroll(0.14);
const { href: cvHref, fileName: cvFileName } = useCvDownload();
const localePath = useLocalePath();
const { goToSection, sectionHref } = useSectionNavigation();
const { unlockFromLogoLongPress } = usePortfolioTerminalLogoUnlock();
const prefersReducedMotion = usePrefersReducedMotion();
/** Same mobile/coarse budget as motion + HUD — logo long-press only here. */
const isMobileUnlockTarget = useMatchMedia('(max-width: 1023px), (pointer: coarse)');

const logoLongPress = createLogoLongPressController({
  isEnabled: () => isMobileUnlockTarget.value,
  onLongPress: () => {
    unlockFromLogoLongPress({ preferReducedMotion: prefersReducedMotion.value });
  },
});

const hireProfileLinks = hireProfileRoutes().map((profile) => ({
  name: profile.hireLabelKey,
  to: profile.localePath,
  icon: profile.hireIcon,
}));

const isMobileMenuOpen = ref(false);
useBodyScrollLock(isMobileMenuOpen);
const mobileMenuRef = ref(null);
const mobileMenuToggleRef = ref(null);
const mobileMenuCloseRef = ref(null);
const { currentThemeId, THEME_PRESETS, setThemePreset, previewTheme, cancelThemePreview } =
  useTheme();

const showHireMenu = ref(false);
const hireMenuRef = ref(null);
const hireTriggerRef = ref(null);
const focusedHireIndex = ref(0);
const restoreHireTriggerFocus = ref(false);

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

function hireMenuItemCount() {
  return hireProfileLinks.length + 1;
}

function closeHireMenu({ restoreFocus = true } = {}) {
  if (!showHireMenu.value) return;
  restoreHireTriggerFocus.value = restoreFocus;
  showHireMenu.value = false;
}

function onHireMenuAfterLeave() {
  if (restoreHireTriggerFocus.value) {
    hireTriggerRef.value?.focus();
    restoreHireTriggerFocus.value = false;
  }
}

function getHireMenuItems() {
  const root = hireMenuRef.value;
  if (!root) return [];
  return [...root.querySelectorAll('[role="menuitem"]')].filter((el) => el instanceof HTMLElement);
}

function focusHireMenuItem(index) {
  const items = getHireMenuItems();
  if (!items.length) return;
  const next = ((index % items.length) + items.length) % items.length;
  focusedHireIndex.value = next;
  items[next]?.focus();
}

function openHireMenu() {
  closeThemeSelector({ restoreFocus: false });
  focusedHireIndex.value = 0;
  showHireMenu.value = true;
  // Wait two frames so Transition + v-if have committed menuitems before focus.
  nextTick(() => {
    requestAnimationFrame(() => focusHireMenuItem(0));
  });
}

function toggleHireMenu() {
  if (showHireMenu.value) {
    closeHireMenu();
    return;
  }
  openHireMenu();
}

function onHireTriggerKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    if (!showHireMenu.value) {
      event.preventDefault();
      openHireMenu();
    }
  } else if (event.key === 'Escape' && showHireMenu.value) {
    event.preventDefault();
    closeHireMenu();
  }
}

function onHireMenuKeydown(event) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusHireMenuItem(focusedHireIndex.value + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusHireMenuItem(focusedHireIndex.value - 1);
      break;
    case 'Home':
      event.preventDefault();
      focusHireMenuItem(0);
      break;
    case 'End':
      event.preventDefault();
      focusHireMenuItem(hireMenuItemCount() - 1);
      break;
    case 'Escape':
      event.preventDefault();
      closeHireMenu();
      break;
    case 'Tab':
      closeHireMenu({ restoreFocus: false });
      break;
    default:
      break;
  }
}

async function goToHireSection(event) {
  closeHireMenu({ restoreFocus: false });
  closeMobileMenu({ restoreFocus: false });
  await goToSection(event, '#hire-profiles');
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getMobileMenuFocusable() {
  const root = mobileMenuRef.value;
  if (!root) return [];
  return [...root.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (el) => el instanceof HTMLElement && !el.hasAttribute('disabled') && el.offsetParent !== null,
  );
}

function setBackgroundInert(inert) {
  if (!import.meta.client) return;
  const targets = [
    document.getElementById('main-content'),
    document.querySelector('.availability-banner'),
    document.querySelector('.page-scroll-progress'),
  ];
  for (const el of targets) {
    if (!(el instanceof HTMLElement)) continue;
    if (inert) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }
}

function closeMobileMenu({ restoreFocus = true } = {}) {
  if (!isMobileMenuOpen.value) return;
  isMobileMenuOpen.value = false;
  if (restoreFocus) {
    nextTick(() => mobileMenuToggleRef.value?.focus());
  }
}

function openMobileMenu() {
  isMobileMenuOpen.value = true;
}

function toggleMobileMenu() {
  if (isMobileMenuOpen.value) closeMobileMenu();
  else openMobileMenu();
}

function onMobileMenuKeydown(event) {
  if (event.key !== 'Tab' || !isMobileMenuOpen.value) return;
  const focusable = getMobileMenuFocusable();
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(isMobileMenuOpen, async (open) => {
  setBackgroundInert(open);
  if (!open) return;
  await nextTick();
  requestAnimationFrame(() => {
    mobileMenuCloseRef.value?.focus();
  });
});

onKeyStroke('Escape', (event) => {
  if (!isMobileMenuOpen.value) return;
  event.preventDefault();
  closeMobileMenu();
});

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
  closeHireMenu({ restoreFocus: false });
});

useEventListener(
  'keydown',
  (event) => {
    if (event.key !== 'Escape') return;
    if (showThemeSelector.value) {
      closeThemeSelector();
    }
    if (showHireMenu.value) {
      closeHireMenu();
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
  { name: 'nav.caseStudies', href: '#case-studies', id: 'case-studies' },
  { name: 'nav.techStack', href: '#tech-stack', id: 'tech-stack' },
  { name: 'nav.certifications', href: '#certifications', id: 'certifications' },
  { name: 'nav.testimonials', href: '#testimonials', id: 'testimonials' },
];

const isActiveSection = (id) => activeSection.value === id;

async function onNavSectionClick(event, href) {
  // Unlock body first — measuring while position:fixed yields wrong targets
  // and unlock's restore would cancel an in-flight scroll.
  closeMobileMenu({ restoreFocus: false });
  await nextTick();
  await goToSection(event, href);
}

async function onLogoClick(event) {
  if (logoLongPress.onClick(event)) return;
  await onNavSectionClick(event, '#hero');
}

onBeforeUnmount(() => {
  logoLongPress.dispose();
  setBackgroundInert(false);
});
</script>

<template>
  <nav
    class="site-nav fixed left-0 right-0 z-130"
    :style="{ top: 'var(--availability-banner-h, 0px)' }"
  >
    <div
      class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pointer-events-none"
    >
      <div
        class="site-nav__shell flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-2 xl:gap-3 rounded-full pointer-events-auto border min-w-0"
      >
        <!-- Logo Area — spans only (no div) so the control stays a valid <button> -->
        <button
          type="button"
          class="nav-reveal nav-logo-unlock flex items-center gap-1.5 sm:gap-2 group cursor-pointer min-w-0 shrink appearance-none bg-transparent border-0 p-0 text-left"
          @pointerdown="logoLongPress.onPointerDown"
          @pointermove="logoLongPress.onPointerMove"
          @pointerup="logoLongPress.onPointerUp"
          @pointercancel="logoLongPress.onPointerCancel"
          @click="onLogoClick"
          @contextmenu="isMobileUnlockTarget && $event.preventDefault()"
        >
          <span
            class="relative w-7 h-7 sm:w-8 sm:h-9 md:w-10 md:h-11 lg:w-12 lg:h-12 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
          >
            <span
              class="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500"
              aria-hidden="true"
            />
            <svg
              data-theme-logo
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              class="w-full h-full scale-110 group-hover:scale-100 text-primary transition-[color,transform] duration-500 motion-reduce:transition-none"
            >
              <path
                d="M 27.43 23.13 A 11.25 11.25 0 1 0 27.43 40.87"
                stroke="currentColor"
                stroke-width="5.75"
                stroke-linecap="butt"
              />
              <path
                d="M 51.03 23.64 A 11.25 11.25 0 1 0 49.46 41.54"
                stroke="currentColor"
                stroke-width="5.75"
                stroke-linecap="butt"
              />
              <path
                d="M 43.00 32 H 55.10 V 38.40"
                stroke="currentColor"
                stroke-width="5.75"
                stroke-linecap="butt"
                stroke-linejoin="miter"
              />
            </svg>
          </span>
          <span class="site-nav__brand flex flex-col justify-center min-w-0">
            <span
              class="text-[11px] sm:text-sm md:text-base font-black tracking-tight text-foreground group-hover:text-primary leading-none uppercase truncate transition-colors duration-300 site-nav__brand-title"
            >
              {{ $t('hero.name') }}
            </span>
            <AppTextRotator
              :items="brandRoles"
              container-class="hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-muted site-nav__brand-subtitle h-[1.25em]"
              track-class="site-nav__brand-subtitle-track"
              line-class="site-nav__brand-subtitle-line"
            />
          </span>
        </button>

        <!-- Desktop Navigation -->
        <div
          class="site-nav__links hidden lg:flex items-center gap-0.5 xl:gap-0.5 rounded-full px-1 xl:px-1.5 py-1 border min-w-0 shrink"
        >
          <template v-for="(link, i) in navLinks" :key="link.id">
            <a
              :href="sectionHref(link.href)"
              class="nav-reveal relative px-1.5 lg:px-2 xl:px-2.5 py-1.5 rounded-full text-[0.65rem] xl:text-xs font-bold uppercase tracking-wide xl:tracking-wider transition-colors duration-300 isolate group/link overflow-hidden cursor-pointer whitespace-nowrap"
              :class="[
                isActiveSection(link.id) ? 'text-foreground' : 'text-muted hover:text-foreground',
              ]"
              :style="{ animationDelay: `${0.2 + i * 0.05}s` }"
              @click="onNavSectionClick($event, link.href)"
            >
              <span class="relative z-10">{{ $t(link.name) }}</span>
              <span
                v-if="isActiveSection(link.id)"
                class="absolute inset-0 bg-foreground/10 rounded-full z-0"
              />
              <span
                v-else
                class="absolute inset-0 bg-foreground/5 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 z-0"
              />
            </a>
          </template>
        </div>

        <!-- Right Utilities -->
        <div class="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <AppLanguageSwitcher />

          <!-- Mobile contact — persistent before theme -->
          <a
            :href="sectionHref('#contact')"
            class="lg:hidden inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-2.5 sm:px-3 rounded-full text-primary bg-primary/10 border border-primary/25 hover:bg-primary/15 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            @click="onNavSectionClick($event, '#contact')"
          >
            <Icon name="solar:letter-bold" class="size-5 shrink-0" aria-hidden="true" />
            <span class="text-[10px] sm:text-xs font-black uppercase tracking-widest">{{
              $t('nav.contactShort')
            }}</span>
          </a>

          <!-- CV download (desktop) -->
          <a
            :href="cvHref"
            :download="cvFileName"
            class="hidden sm:flex w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-colors active:scale-95"
            :aria-label="$t('hero.downloadCvAria', { file: cvFileName })"
            :title="$t('hero.downloadCv')"
          >
            <Icon
              name="solar:download-minimalistic-bold-duotone"
              class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
            />
          </a>

          <!-- Theme presets — fallback keeps the crown visible before ClientOnly hydrates -->
          <ClientOnly>
            <div ref="themeSelectorRef" class="relative">
              <button
                ref="themeTriggerRef"
                type="button"
                class="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                :aria-label="$t('nav.themePresets')"
                :aria-expanded="showThemeSelector"
                aria-haspopup="listbox"
                :aria-controls="showThemeSelector ? 'theme-preset-listbox' : undefined"
                @click="toggleThemeSelector"
                @keydown="onThemeTriggerKeydown"
              >
                <Icon
                  name="solar:crown-star-bold"
                  class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
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
                        class="flex w-full items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-[background-color,border-color,transform,color] duration-300 group/item border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
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
            <template #fallback>
              <button
                type="button"
                class="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] flex items-center justify-center rounded-full text-muted"
                :aria-label="$t('nav.themePresets')"
                disabled
              >
                <Icon
                  name="solar:crown-star-bold"
                  class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                />
              </button>
            </template>
          </ClientOnly>

          <div class="w-px h-5 bg-foreground/10 mx-1 hidden lg:block shrink-0" aria-hidden="true" />

          <!-- Hire + Contact share one action cluster (matched size, intentional gap) -->
          <div class="site-nav__actions relative hidden lg:flex items-center gap-3 shrink-0">
            <div ref="hireMenuRef" class="relative shrink-0">
              <button
                ref="hireTriggerRef"
                type="button"
                class="hire-menu-trigger site-nav__action site-nav__action--hire inline-flex items-center justify-center gap-1.5 rounded-full transition-[color,background-color,border-color,box-shadow,transform] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group/hire"
                :class="{ 'hire-menu-trigger--open': showHireMenu }"
                :aria-label="`${$t('nav.hire')} — ${$t('nav.hireMenu')}`"
                :aria-expanded="showHireMenu"
                aria-haspopup="menu"
                :aria-controls="showHireMenu ? 'hire-profile-menu' : undefined"
                @click="toggleHireMenu"
                @keydown="onHireTriggerKeydown"
              >
                <span>{{ $t('nav.hire') }}</span>
                <Icon
                  name="lucide:chevron-down"
                  class="size-4 shrink-0 transition-transform duration-300 group-hover/hire:translate-y-px"
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
                @after-leave="onHireMenuAfterLeave"
              >
                <div
                  v-if="showHireMenu"
                  id="hire-profile-menu"
                  role="menu"
                  class="absolute top-full right-0 mt-2 sm:mt-3 w-64 rounded-2xl p-2 shadow-4xl z-100 border border-foreground/10 bg-background origin-top-right"
                  @keydown="onHireMenuKeydown"
                >
                  <p
                    id="hire-profile-menu-label"
                    class="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted"
                  >
                    {{ $t('nav.hireMenu') }}
                  </p>
                  <NuxtLink
                    v-for="profile in hireProfileLinks"
                    :key="profile.to"
                    :to="localePath(profile.to)"
                    role="menuitem"
                    tabindex="-1"
                    class="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-primary/8 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 group/ditem"
                    @click="closeHireMenu({ restoreFocus: false })"
                  >
                    <div
                      class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/ditem:bg-primary group-hover/ditem:text-primary-contrast transition-colors shrink-0"
                    >
                      <Icon :name="profile.icon" class="size-5 shrink-0" />
                    </div>
                    <span>{{ $t(profile.name) }}</span>
                  </NuxtLink>
                  <div class="my-1 border-t border-foreground/5" />
                  <a
                    :href="sectionHref('#hire-profiles')"
                    role="menuitem"
                    tabindex="-1"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest text-muted hover:text-foreground hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                    @click="goToHireSection($event)"
                  >
                    <Icon name="solar:widget-2-bold-duotone" class="size-6 shrink-0 text-primary" />
                    <span>{{ $t('nav.hireSection') }}</span>
                  </a>
                </div>
              </Transition>
            </div>

            <a
              :href="sectionHref('#contact')"
              class="site-nav__cta site-nav__action site-nav__action--contact inline-flex items-center justify-center gap-1.5 rounded-full transition-[color,background-color,border-color,box-shadow,transform] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              @click="onNavSectionClick($event, '#contact')"
            >
              <span>{{ $t('nav.cta') }}</span>
              <Icon
                name="solar:arrow-right-up-linear"
                class="size-4 shrink-0 group-hover/btn:rotate-45 transition-transform duration-300"
              />
            </a>
          </div>

          <!-- Mobile Navigation Trigger (Hamburger) -->
          <button
            ref="mobileMenuToggleRef"
            type="button"
            class="site-nav__action lg:hidden inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
            :aria-label="$t('a11y.openMenu')"
            :aria-expanded="isMobileMenuOpen"
            :aria-controls="isMobileMenuOpen ? 'mobile-nav-dialog' : undefined"
            @click="toggleMobileMenu"
          >
            <Icon name="solar:hamburger-menu-linear" class="size-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-95"
    >
      <div
        v-if="isMobileMenuOpen"
        id="mobile-nav-dialog"
        ref="mobileMenuRef"
        class="mobile-nav-dialog fixed inset-2 sm:inset-4 md:inset-6 z-140 rounded-3xl md:rounded-[2.5rem] overflow-y-auto border border-foreground/15 glass shadow-4xl lg:hidden overscroll-contain bg-background/95 backdrop-blur-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        @keydown="onMobileMenuKeydown"
      >
        <h2 id="mobile-nav-title" class="sr-only">
          {{ $t('a11y.mobileMenu') }}
        </h2>
        <button
          ref="mobileMenuCloseRef"
          type="button"
          class="sticky top-0 ml-auto z-10 flex size-12 items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
          :aria-label="$t('a11y.closeMenu')"
          @click="closeMobileMenu()"
        >
          <Icon name="lucide:x" class="size-6" />
        </button>

        <div
          class="flex min-h-[calc(100%-3rem)] flex-col items-center justify-between gap-8 max-w-lg mx-auto py-4"
        >
          <nav class="space-y-3 text-center w-full" :aria-label="$t('a11y.mobileMenu')">
            <a
              v-for="link in navLinks"
              :key="link.id"
              :href="sectionHref(link.href)"
              class="block text-2xl sm:text-3xl font-black tracking-tight text-foreground hover:text-primary transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              @click="onNavSectionClick($event, link.href)"
            >
              {{ $t(link.name) }}
            </a>
          </nav>

          <div class="w-full space-y-4 text-center border-t border-foreground/10 pt-6">
            <p class="text-xs font-black uppercase tracking-[0.3em] text-muted">
              {{ $t('nav.hireMenu') }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              <NuxtLink
                v-for="profile in hireProfileLinks"
                :key="profile.to"
                :to="localePath(profile.to)"
                class="flex items-center gap-3 p-3 rounded-2xl glass border border-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all group/mitem"
                @click="closeMobileMenu({ restoreFocus: false })"
              >
                <div
                  class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover/mitem:bg-primary group-hover/mitem:text-primary-contrast transition-colors shrink-0"
                >
                  <Icon :name="profile.icon" class="size-6 shrink-0" />
                </div>
                <span
                  class="text-sm font-bold text-foreground group-hover/mitem:text-primary transition-colors flex-1 line-clamp-1"
                >
                  {{ $t(profile.name) }}
                </span>
                <Icon
                  name="solar:arrow-right-linear"
                  class="size-4 text-primary opacity-0 group-hover/mitem:opacity-100 transition-all -translate-x-1 group-hover/mitem:translate-x-0 shrink-0"
                />
              </NuxtLink>
            </div>
            <a
              :href="sectionHref('#hire-profiles')"
              class="inline-flex items-center justify-center gap-2 pt-2 text-xs font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors"
              @click="goToHireSection($event)"
            >
              {{ $t('nav.hireSection') }}
              <Icon name="solar:arrow-right-linear" class="size-4" />
            </a>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full border-t border-foreground/10 pt-6">
            <a
              :href="sectionHref('#contact')"
              class="btn-premium bg-primary text-primary-contrast rounded-2xl py-3.5 px-6 flex-1 inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider text-sm shadow-xl shadow-primary/20"
              @click="onNavSectionClick($event, '#contact')"
            >
              {{ $t('nav.getInTouch') }}
              <Icon name="solar:arrow-right-up-bold" class="size-5" />
            </a>
            <a
              :href="cvHref"
              :download="cvFileName"
              class="btn-premium glass border border-foreground/15 text-foreground rounded-2xl py-3.5 px-6 flex-1 inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider text-sm hover:border-primary/40 hover:text-primary transition-colors"
              :aria-label="$t('hero.downloadCvAria', { file: cvFileName })"
              @click="closeMobileMenu({ restoreFocus: false })"
            >
              <Icon name="solar:download-minimalistic-bold-duotone" class="size-5" />
              {{ $t('hero.downloadCv') }}
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.site-nav {
  /* --nav-progress published on :root by useSmoothedScroll (direct DOM). */
  --np: var(--nav-progress, 0);
  padding-block: calc(1rem + (1 - var(--np)) * 0.5rem);
}

@media (min-width: 640px) {
  .site-nav {
    padding-block: calc(0.75rem + (1 - var(--np)) * 0.75rem);
  }
}

.site-nav__shell {
  /* Keep a real inset so the CTA never sits on the pill’s curved end-cap. */
  padding-block: max(0.35rem, calc(var(--np) * 0.5rem));
  padding-inline: max(0.4rem, calc(var(--np) * 0.55rem));
  border-color: color-mix(in srgb, #ffffff calc(var(--np) * 12%), transparent);
  /* Frosted glass: opaque enough that page copy never reads through the bar. */
  background-color: color-mix(in srgb, var(--background) calc(var(--np) * 82%), transparent);
  backdrop-filter: blur(calc(var(--np) * 20px)) saturate(calc(1 + var(--np) * 0.35));
  -webkit-backdrop-filter: blur(calc(var(--np) * 20px)) saturate(calc(1 + var(--np) * 0.35));
  box-shadow: 0 calc(var(--np) * 16px) calc(var(--np) * 40px)
    color-mix(in srgb, #000000 calc(var(--np) * 18%), transparent);
}

/* Mobile: static blur + solid-enough fill — avoid animating blur radius / padding every RAF. */
@media (max-width: 1023px) {
  .site-nav {
    padding-block: 0.75rem;
  }

  .site-nav__shell {
    padding: 0.35rem;
    backdrop-filter: blur(8px) saturate(1.25);
    -webkit-backdrop-filter: blur(8px) saturate(1.25);
    background-color: color-mix(in srgb, var(--background) 82%, transparent);
    box-shadow: 0 8px 24px color-mix(in srgb, #000000 14%, transparent);
  }

  .site-nav__links {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

.site-nav__brand {
  opacity: calc(1 - var(--np) * 0.1);
}

.site-nav__icon-btn {
  width: 2.75rem;
  height: 2.75rem;
}

@media (min-width: 1024px) {
  .site-nav__brand-title {
    font-size: calc(0.875rem + (1 - var(--np)) * 0.125rem);
    letter-spacing: calc(-0.025em + var(--np) * 0.005em);
  }

  .site-nav__brand-subtitle {
    font-size: 0.5625rem;
    letter-spacing: 0.18em;
  }

  .site-nav__icon-btn {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.site-nav__links {
  border-color: color-mix(in srgb, var(--foreground) calc(var(--np) * 5%), transparent);
  background-color: color-mix(in srgb, var(--foreground) calc(var(--np) * 6%), transparent);
  backdrop-filter: blur(calc(var(--np) * 12px));
  -webkit-backdrop-filter: blur(calc(var(--np) * 12px));
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

/* Matched Hire / Contact chrome — same shell, same composition (label + trailing icon). */
.site-nav__action {
  box-sizing: border-box;
  height: 2.5rem;
  min-height: 2.5rem;
  padding-inline: 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-width: 1px;
  border-style: solid;
}

.site-nav__action--hire {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 14%, var(--color-background));
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
}

.site-nav__action--hire:hover,
.site-nav__action--hire:focus-visible {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.hire-menu-trigger--open {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.site-nav__action--contact {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.site-nav__action--contact:hover,
.site-nav__action--contact:focus-visible {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

/* Mobile menu panel: opaque enough that page content doesn't read through. */
.mobile-nav-dialog {
  background-color: color-mix(in srgb, var(--background) 88%, transparent);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  box-shadow: 0 24px 64px color-mix(in srgb, #000000 28%, transparent);
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

  .mobile-nav-dialog {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: color-mix(in srgb, var(--background) 96%, transparent);
  }
}

/* Avoid iOS callout / text selection fighting the intentional logo long-press. */
@media (max-width: 1023px), (pointer: coarse) {
  .nav-logo-unlock {
    -webkit-touch-callout: none;
    user-select: none;
    touch-action: manipulation;
  }
}

.site-nav__brand-subtitle-track {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.site-nav__brand-subtitle-line {
  display: flex;
  align-items: center;
  flex: 0 0 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (prefers-reduced-motion: reduce) {
  .site-nav__brand-subtitle-track {
    transition: none;
  }
}
</style>
