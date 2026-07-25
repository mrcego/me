<script setup lang="ts">
const localePath = useLocalePath();

type FooterLink =
  { name: string; href: string; to?: never } | { name: string; to: string; href?: never };

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: 'col.nav',
    links: [
      { name: 'nav.home', href: '#' },
      { name: 'about.philosophy', href: '#about' },
      { name: 'nav.certifications', href: '#certifications' },
      { name: 'capabilities.section', href: '#capabilities' },
    ],
  },
  {
    title: 'col.hire',
    links: [
      { name: 'hireProfiles.hireForVue', to: '/vue-frontend-developer' },
      { name: 'hireProfiles.hireForAi', to: '/ai-engineer' },
      { name: 'hireProfiles.hireForNode', to: '/nodejs-backend-developer' },
    ],
  },
  {
    title: 'col.connect',
    links: [
      { name: 'footer.email', href: 'mailto:cesargomezh90@gmail.com' },
      {
        name: 'contact.methods.linkedin',
        href: 'https://linkedin.com/in/mrcego',
      },
      {
        name: 'contact.methods.github',
        href: 'https://github.com/mrcego',
      },
    ],
  },
];

const socials = [
  { icon: 'simple-icons:linkedin', link: 'https://linkedin.com/in/mrcego' },
  { icon: 'simple-icons:github', link: 'https://github.com/mrcego' },
  {
    icon: 'solar:letter-bold-duotone',
    link: 'mailto:cesargomezh90@gmail.com',
  },
];
</script>

<template>
  <footer
    class="py-20 md:py-32 px-6 md:px-12 bg-background relative overflow-hidden border-t border-foreground/5"
  >
    <!-- Cinematic Background -->
    <div class="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none footer-ambient-bg" />

    <div
      class="absolute bottom-0 left-0 right-0 h-75 bg-linear-to-t from-primary/5 to-transparent pointer-events-none opacity-30"
    />

    <div class="container mx-auto space-y-12 md:space-y-14 xl:space-y-16 relative z-10">
      <!--
        Phone/tablet (incl. iPad landscape ~1024): brand on top, then 3 equal link cols.
        xl+ only: brand | links side-by-side — avoids CONNECT orphan under NAVIGATION.
      -->
      <div
        class="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-10 md:gap-12 xl:gap-16"
      >
        <!-- Brand Identity -->
        <div
          class="group cursor-pointer w-full xl:w-auto xl:max-w-sm flex flex-col md:flex-row md:items-end md:justify-between xl:flex-col xl:items-start gap-5 md:gap-8 xl:gap-5"
        >
          <div class="flex items-center gap-4 shrink-0">
            <div
              class="size-12 md:size-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:-rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20 border-foreground/10"
            >
              <Icon name="solar:code-square-bold-duotone" class="size-7 md:size-8" />
            </div>
            <div class="flex flex-col min-w-0">
              <h3
                class="text-xl md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300 uppercase"
              >
                {{ $t('hero.name') }}
              </h3>
              <span
                class="text-xs md:text-sm tracking-[0.12em] md:tracking-[0.16em] text-muted uppercase font-bold group-hover:text-foreground transition-colors delay-75 text-pretty"
              >
                {{ $t('hero.tags.frontArch') }}
              </span>
            </div>
          </div>
          <p
            class="text-muted text-xs md:text-sm font-medium uppercase tracking-[0.14em] md:tracking-[0.18em] max-w-md md:max-w-xs xl:max-w-sm leading-relaxed md:leading-loose md:text-right xl:text-left pl-1 md:pl-0"
          >
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <!-- Navigation Columns — always 3 across from sm (no 2+1 wrap) -->
        <nav
          class="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 md:gap-x-8 xl:gap-x-12 w-full xl:w-auto xl:min-w-0 xl:max-w-2xl xl:grow"
          :aria-label="$t('footer.navLabel')"
        >
          <div v-for="col in footerColumns" :key="col.title" class="space-y-4 md:space-y-5 min-w-0">
            <h3
              class="type-eyebrow tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span class="truncate">{{ $t(col.title) }}</span>
            </h3>
            <ul class="space-y-2.5 md:space-y-3">
              <li v-for="link in col.links" :key="link.name">
                <NuxtLink
                  v-if="link.to"
                  :to="localePath(link.to)"
                  class="text-[11px] sm:text-xs md:text-sm font-medium text-muted hover:text-foreground transition-all hover:translate-x-1 inline-flex items-center gap-1.5 group/link"
                >
                  <span
                    class="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-300 opacity-0 group-hover/link:opacity-100 text-primary shrink-0"
                  >
                    <Icon name="solar:arrow-right-linear" class="size-3.5" />
                  </span>
                  <span class="text-pretty">{{ $t(link.name) }}</span>
                </NuxtLink>
                <a
                  v-else
                  :href="link.href"
                  class="text-[11px] sm:text-xs md:text-sm font-medium text-muted hover:text-foreground transition-all hover:translate-x-1 inline-flex items-center gap-1.5 group/link"
                >
                  <span
                    class="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-300 opacity-0 group-hover/link:opacity-100 text-primary shrink-0"
                  >
                    <Icon name="solar:arrow-right-linear" class="size-3.5" />
                  </span>
                  <span class="text-pretty">{{ $t(link.name) }}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Footer Bottom -->
      <div
        class="pt-10 md:pt-12 border-t border-foreground/5 flex flex-col sm:flex-row justify-between items-center gap-6 md:gap-8"
      >
        <p
          class="text-xs md:text-sm font-bold uppercase tracking-widest text-muted flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left"
        >
          <span>{{ $t('footer.copyrightYear') }} {{ $t('footer.protocol') }}</span>
          <span class="hidden sm:inline text-muted/30">|</span>
          <span class="opacity-50 tracking-[0.2em]">{{ $t('footer.rights') }}</span>
        </p>

        <!-- Socials: fixed hit targets (was w-full + 74px icons — blew up on tablet) -->
        <div class="flex gap-3 md:gap-4">
          <a
            v-for="s in socials"
            :key="s.icon"
            :href="s.link"
            class="size-11 md:size-12 glass rounded-xl md:rounded-2xl border border-foreground/10 hover:border-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,75,92,0.35)] group/social"
            aria-label="Social Link"
          >
            <Icon
              :name="s.icon"
              class="size-5 md:size-6 transition-colors duration-300 text-muted group-hover/social:text-primary"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-ambient-bg {
  background-image: radial-gradient(circle, rgba(255, 75, 92, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to bottom, black, transparent);
}
</style>
