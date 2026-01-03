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
              src="/img/logo.png"
              alt="César Gómez"
              width="48"
              height="48"
              class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            />
          </div>
          <div
            class="flex flex-col justify-center"
            :class="{
              'opacity-0 w-0 overflow-hidden hidden md:flex': isScrolled,
            }"
          >
            <span
              class="text-sm md:text-base font-black tracking-tight text-white group-hover:text-primary transition-colors leading-none uppercase"
            >
              {{ $t("hero.name") }}
            </span>
            <span
              class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              {{ $t("hero.tags.frontArch") }}
            </span>
          </div>
        </Motion>

        <!-- Desktop Navigation -->
        <div
          class="hidden lg:flex items-center gap-1 bg-white/3 backdrop-blur-md rounded-full px-2 py-1.5 border transition-all duration-700"
          :class="
            isScrolled
              ? 'opacity-100 scale-100 border-white/5 shadow-inner shadow-white/5'
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
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white',
                ]"
                @click="scrollToSection($event, link.href)"
              >
                <span class="relative z-10">{{ $t(link.name) }}</span>
                <!-- Active Background Pill -->
                <div
                  v-if="isActiveSection(link.id)"
                  class="absolute inset-0 bg-white/10 rounded-full z-0"
                  layoutId="nav-pill"
                  transition="{ type: 'spring', stiffness: 300, damping: 30 }"
                />
                <!-- Hover Glow -->
                <div
                  v-else
                  class="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 z-0"
                />
              </a>
            </Motion>
          </template>
        </div>

        <!-- Right Utilities -->
        <div class="flex items-center gap-2 md:gap-3 pl-2">
          <!-- Language Switcher -->
          <AppLanguageSwitcher />

          <!-- Theme Toggle -->
          <button
            class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            :aria-label="isDark ? 'Switch to light' : 'Switch to dark'"
            @click="toggleTheme"
          >
            <Icon
              :name="
                isDark
                  ? 'solar:moon-stars-bold-duotone'
                  : 'solar:sun-2-bold-duotone'
              "
              class="w-5 h-5 md:w-6 md:h-6"
            />
          </button>

          <!-- Color Picker -->
          <div class="relative">
            <button
              class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
              aria-label="Customize Theme"
              @click="showColorPicker = !showColorPicker"
            >
              <Icon
                name="solar:palette-bold-duotone"
                class="w-5 h-5 md:w-6 md:h-6"
              />
            </button>
            <!-- Color Picker Popover -->
            <Motion
              v-if="showColorPicker"
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{ opacity: 1, scale: 1 }"
            >
              <div
                class="absolute top-full right-0 mt-4 p-5 glass rounded-3xl min-w-64 border border-white/10 shadow-4xl z-50 origin-top-right"
              >
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-black uppercase tracking-widest text-slate-500"
                      >Primary Accent</label
                    >
                    <div class="flex items-center gap-2">
                      <ColorPicker
                        v-model="primaryColor"
                        format="hex"
                        class="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10"
                        @update:model-value="changePrimaryColor"
                      />
                      <span class="text-xs font-mono text-white/60 uppercase">{{
                        primaryColor
                      }}</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-black uppercase tracking-widest text-slate-500"
                      >Surface Tone</label
                    >
                    <div class="flex items-center gap-2">
                      <ColorPicker
                        v-model="surfaceColor"
                        format="hex"
                        class="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10"
                        @update:model-value="changeSurfaceColor"
                      />
                      <span class="text-xs font-mono text-white/60 uppercase">{{
                        surfaceColor
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Motion>
          </div>

          <div class="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

          <!-- CTA Button -->
          <a
            href="#contact"
            class="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,75,92,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group/btn"
            @click="scrollToSection($event, '#contact')"
          >
            <span>{{ $t("nav.getInTouch") }}</span>
            <Icon
              name="solar:arrow-right-up-linear"
              class="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-300"
            />
          </a>

          <!-- Mobile Toggle -->
          <button
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-white bg-white/5 hover:bg-white/10 transition-colors"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <Icon
              :name="
                isMobileMenuOpen
                  ? 'solar:close-square-linear'
                  : 'solar:hamburger-menu-linear'
              "
              class="w-6 h-6"
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
        class="fixed inset-4 z-90 glass rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border border-white/10 shadow-4xl lg:hidden"
      >
        <button
          class="absolute top-6 right-6 p-4 text-white/50 hover:text-white"
          @click="isMobileMenuOpen = false"
        >
          <Icon name="solar:close-circle-linear" class="w-10 h-10" />
        </button>

        <nav class="space-y-6 text-center">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="link.href"
            class="block text-4xl font-black tracking-tighter text-white hover:text-primary transition-colors cursor-pointer"
            @click="scrollToSection($event, link.href)"
          >
            {{ $t(link.name) }}
          </a>
        </nav>
        <div class="mt-12">
          <a
            href="#contact"
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
            @click="scrollToSection($event, '#contact')"
          >
            {{ $t("nav.getInTouch") }}
            <Icon name="solar:arrow-right-up-bold" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { Motion } from "motion-v";
import { ref, onMounted, onUnmounted } from "vue";
import ColorPicker from "primevue/colorpicker";
import { useTheme } from "~/composables/useTheme";
import AppLanguageSwitcher from "~/components/AppLanguageSwitcher.vue";

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const { isDark, toggleTheme, changePrimaryColor, changeSurfaceColor } =
  useTheme();

const showColorPicker = ref(false);
const primaryColor = ref("#ff4b5c");
const surfaceColor = ref("#0f172a");

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
/* Scoped styles if needed, but Tailwind handles most */
</style>
