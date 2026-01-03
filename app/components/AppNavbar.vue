<template>
  <nav
    class="fixed top-0 left-0 right-0 z-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="[isScrolled ? 'py-4' : 'py-8']"
  >
    <div class="container mx-auto px-6 md:px-12 pointer-events-none">
      <div
        class="flex items-center justify-between rounded-full transition-all duration-700 pointer-events-auto border"
        :class="[
          isScrolled
            ? 'bg-secondary/40 backdrop-blur-3xl border-white/5 shadow-2xl shadow-black/20 p-2 pr-3'
            : 'bg-transparent border-transparent p-0',
        ]"
      >
        <!-- Logo Area -->
        <Motion
          :initial="{ opacity: 0, x: -20, filter: 'blur(10px)' }"
          :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          class="flex items-center gap-3 md:gap-4 group cursor-pointer"
          @click="scrollToSection($event, '#hero')"
        >
          <div
            class="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
          >
            <div
              class="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500"
            />
            <NuxtImg
              src="/img/logo-final.svg"
              alt="CÃ©sar GÃ³mez"
              width="48"
              height="48"
              class="w-full h-full object-contain scale-110 group-hover:scale-100 transition-transform duration-700 text-primary"
            />
          </div>
          <div
            class="flex flex-col justify-center"
            :class="{
              'opacity-0 w-0 overflow-hidden hidden md:flex': isScrolled,
            }"
          >
            <span
              class="text-sm md:text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-none uppercase"
            >
              {{ $t("hero.name") }}
            </span>
            <span
              class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted"
            >
              {{ $t("hero.tags.frontArch") }}
            </span>
          </div>
        </Motion>

        <!-- Desktop Navigation -->
        <div
          class="hidden lg:flex items-center gap-1 bg-foreground/3 backdrop-blur-md rounded-full px-2 py-1.5 border transition-all duration-700"
          :class="
            isScrolled
              ? 'opacity-100 scale-100 border-foreground/5 shadow-inner shadow-white/5'
              : 'opacity-100 bg-transparent border-transparent shadow-none backdrop-blur-none'
          "
        >
          <template v-for="(link, i) in navLinks" :key="link.id">
            <Motion
              :initial="{ opacity: 0, y: -10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{
                duration: 0.6,
                delay: 0.2 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }"
            >
              <a
                :href="link.href"
                class="relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 isolate group/link overflow-hidden cursor-pointer"
                :class="[
                  isActiveSection(link.id)
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground',
                ]"
                @click="scrollToSection($event, link.href)"
              >
                <span class="relative z-10">{{ $t(link.name) }}</span>
                <!-- Active Background Pill -->
                <div
                  v-if="isActiveSection(link.id)"
                  class="absolute inset-0 bg-foreground/10 rounded-full z-0"
                  layoutId="nav-pill"
                  transition="{ type: 'spring', stiffness: 300, damping: 30 }"
                />
                <!-- Hover Glow -->
                <div
                  v-else
                  class="absolute inset-0 bg-foreground/5 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 z-0"
                />
              </a>
            </Motion>
          </template>
        </div>

        <!-- Right Utilities -->
        <div class="flex items-center gap-2 md:gap-3 pl-2">
          <!-- Language Switcher -->
          <AppLanguageSwitcher />

          <!-- Color Picker -->
          <ClientOnly>
            <div class="relative">
              <button
                class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
                aria-label="Customize Theme"
                @click="showThemeSelector = !showThemeSelector"
              >
                <Icon
                  name="solar:palette-bold-duotone"
                  class="w-12 h-12 md:w-14 md:h-14"
                />
              </button>
              <!-- Theme Preset Selector Popover -->
              <Motion
                v-if="showThemeSelector"
                :initial="{ opacity: 0, scale: 0.9, y: 10 }"
                :animate="{ opacity: 1, scale: 1, y: 0 }"
                :transition="{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }"
              >
                <div
                  class="absolute top-full right-0 mt-4 w-72 lg:w-80 rounded-3xl p-6 shadow-4xl z-100 border border-foreground/10 bg-background"
                >
                  <div class="space-y-6">
                    <div
                      class="flex items-center justify-between border-b border-foreground/5 pb-4"
                    >
                      <h4
                        class="text-xs font-black uppercase tracking-widest text-foreground"
                      >
                        {{ $t("nav.themePresets") }}
                      </h4>
                      <span
                        class="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold border border-primary/20"
                        >{{ THEME_PRESETS.length }} {{ $t("nav.modes") }}</span
                      >
                    </div>

                    <div
                      class="grid grid-cols-1 gap-1.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar"
                    >
                      <button
                        v-for="preset in THEME_PRESETS"
                        :key="preset.id"
                        class="flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group/item border"
                        :class="[
                          currentThemeId === preset.id
                            ? 'bg-primary/10 border-primary/20 scale-[1.02]'
                            : 'bg-foreground/3 border-transparent hover:bg-foreground/5',
                        ]"
                        @click="setThemePreset(preset.id)"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden ring-2 ring-foreground/5 shadow-sm"
                            :style="{ background: preset.background }"
                          >
                            <div
                              class="absolute top-0 right-0 w-1/2 h-1/2"
                              :style="{ background: preset.primary }"
                            />
                            <div
                              v-if="preset.font === 'Fira Code'"
                              class="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/20 select-none"
                            >
                              fc
                            </div>
                          </div>
                          <div class="text-left">
                            <p
                              class="text-[11px] font-bold transition-colors"
                              :class="[
                                currentThemeId === preset.id
                                  ? 'text-primary'
                                  : 'text-foreground',
                              ]"
                            >
                              {{ $t("themes." + preset.id) }}
                            </p>
                            <p
                              class="text-[8px] text-muted font-black uppercase tracking-widest opacity-60"
                            >
                              {{ preset.font }}
                            </p>
                          </div>
                        </div>
                        <Icon
                          v-if="currentThemeId === preset.id"
                          name="solar:check-circle-bold"
                          class="w-10 h-10 text-primary"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Motion>
            </div>
          </ClientOnly>

          <div class="w-px h-6 bg-foreground/10 mx-1 hidden sm:block" />

          <!-- CTA Button -->
          <a
            href="#contact"
            class="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-contrast px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,75,92,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group/btn"
            @click="scrollToSection($event, '#contact')"
          >
            <span>{{ $t("nav.getInTouch") }}</span>
            <Icon
              name="solar:arrow-right-up-linear"
              class="w-9 h-9 group-hover/btn:rotate-45 transition-transform duration-300"
            />
          </a>

          <!-- Mobile Toggle -->
          <button
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <Icon
              :name="
                isMobileMenuOpen
                  ? 'solar:close-square-linear'
                  : 'solar:hamburger-menu-linear'
              "
              class="w-11 h-11"
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
        class="fixed inset-4 z-90 glass rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border border-foreground/10 shadow-4xl lg:hidden"
      >
        <button
          class="absolute top-6 right-6 p-4 text-muted hover:text-foreground"
          @click="isMobileMenuOpen = false"
        >
          <Icon name="solar:close-circle-linear" class="w-16 h-16" />
        </button>

        <nav class="space-y-6 text-center">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="link.href"
            class="block text-4xl font-black tracking-tighter text-foreground hover:text-primary transition-colors cursor-pointer"
            @click="scrollToSection($event, link.href)"
          >
            {{ $t(link.name) }}
          </a>
        </nav>
        <div class="mt-12">
          <a
            href="#contact"
            class="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
            @click="scrollToSection($event, '#contact')"
          >
            {{ $t("nav.getInTouch") }}
            <Icon name="solar:arrow-right-up-bold" class="w-10 h-10" />
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { Motion } from "motion-v";
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "~/composables/useTheme";
import AppLanguageSwitcher from "~/components/AppLanguageSwitcher.vue";

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const { currentThemeId, THEME_PRESETS, setThemePreset } = useTheme();

const showThemeSelector = ref(false);

const navLinks = [
  { name: "nav.home", href: "#hero", id: "hero" },
  { name: "nav.about", href: "#about", id: "about" },
  { name: "nav.techStack", href: "#tech-stack", id: "tech-stack" },
  { name: "nav.projects", href: "#portfolio", id: "portfolio" },
  { name: "nav.contact", href: "#contact", id: "contact" },
];

const activeSection = ref("hero");

const isActiveSection = (id) => activeSection.value === id;

const scrollToSection = (e, href) => {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: "smooth",
    });
    activeSection.value = targetId;
  }
  isMobileMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;

  // Simple active section detection
  const sections = navLinks.map((l) => l.id);
  const scrollPos = window.scrollY + 200;

  for (const id of sections) {
    const el = document.getElementById(id);
    if (
      el &&
      el.offsetTop <= scrollPos &&
      el.offsetTop + el.offsetHeight > scrollPos
    ) {
      activeSection.value = id;
      break;
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
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
