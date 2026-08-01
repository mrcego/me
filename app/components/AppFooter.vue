<script setup lang="ts">
import { hireProfileRoutes } from '~/config/routes.manifest';

const localePath = useLocalePath();

type FooterLink =
  { name: string; href: string; to?: never } | { name: string; to: string; href?: never };

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const hireLinks: FooterLink[] = hireProfileRoutes().map((profile) => ({
  name: profile.hireLabelKey,
  to: profile.localePath,
}));

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
    links: hireLinks,
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
  {
    icon: 'simple-icons:linkedin',
    link: 'https://linkedin.com/in/mrcego',
    labelKey: 'footer.socialLinkedIn',
  },
  {
    icon: 'simple-icons:github',
    link: 'https://github.com/mrcego',
    labelKey: 'footer.socialGitHub',
  },
  {
    icon: 'solar:letter-bold-duotone',
    link: 'mailto:cesargomezh90@gmail.com',
    labelKey: 'footer.socialEmail',
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
          class="group w-full xl:w-auto xl:max-w-sm flex flex-col md:flex-row md:items-end md:justify-between xl:flex-col xl:items-start gap-5 md:gap-8 xl:gap-5"
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

        <!-- Navigation: 1–2 cols on narrow screens, 3 from md -->
        <nav
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 xl:gap-x-12 w-full xl:w-auto xl:min-w-0 xl:max-w-2xl xl:grow"
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
                  class="text-sm font-medium text-muted hover:text-foreground transition-[color,transform] hover:translate-x-1 inline-flex items-center gap-1.5 group/link"
                >
                  <span
                    class="w-0 overflow-hidden group-hover/link:w-3 transition-[width,opacity] duration-300 opacity-0 group-hover/link:opacity-100 text-primary shrink-0"
                  >
                    <Icon name="solar:arrow-right-linear" class="size-3.5" />
                  </span>
                  <span class="text-pretty">{{ $t(link.name) }}</span>
                </NuxtLink>
                <a
                  v-else
                  :href="link.href"
                  class="text-sm font-medium text-muted hover:text-foreground transition-[color,transform] hover:translate-x-1 inline-flex items-center gap-1.5 group/link"
                >
                  <span
                    class="w-0 overflow-hidden group-hover/link:w-3 transition-[width,opacity] duration-300 opacity-0 group-hover/link:opacity-100 text-primary shrink-0"
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
        <!--
          min-w-0 + shrink: long copyright (esp. ES + tracking) must not overflow
          and steal hit-testing from the social buttons on the right.
        -->
        <p
          class="min-w-0 shrink text-xs md:text-sm font-bold uppercase tracking-widest text-muted flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left"
        >
          <span>{{ $t('footer.copyrightYear') }} {{ $t('footer.protocol') }}</span>
          <span class="hidden sm:inline text-muted/30" aria-hidden="true">|</span>
          <span class="opacity-50 tracking-[0.12em] sm:tracking-[0.16em]">{{
            $t('footer.rights')
          }}</span>
        </p>

        <!--
          Hover styles live in scoped CSS (not Tailwind hover:) so they still
          fire when Chrome reports any-hover: none on Windows touch laptops.
        -->
        <div class="relative z-20 flex shrink-0 gap-3 md:gap-4 isolate">
          <a
            v-for="s in socials"
            :key="s.icon"
            :href="s.link"
            :target="s.link.startsWith('mailto:') ? undefined : '_blank'"
            :rel="s.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
            class="footer-social-link size-11 md:size-12 rounded-xl md:rounded-2xl border flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            :aria-label="$t(s.labelKey)"
          >
            <Icon :name="s.icon" class="size-5 md:size-6 text-current pointer-events-none" />
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

.footer-social-link {
  color: color-mix(in srgb, var(--foreground) 80%, transparent);
  background: color-mix(in srgb, var(--secondary) 88%, var(--background));
  border-color: color-mix(in srgb, var(--foreground) 10%, transparent);
  box-shadow: 0 8px 20px color-mix(in srgb, #000000 14%, transparent);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.footer-social-link:hover,
.footer-social-link:focus-visible {
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 18%, var(--background));
  border-color: color-mix(in srgb, var(--primary) 55%, transparent);
  box-shadow: 0 0 22px color-mix(in srgb, var(--primary) 40%, transparent);
}
</style>
