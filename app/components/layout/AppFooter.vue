<script setup lang="ts">
import { hireProfileRoutes } from '~/config/routes.manifest';
import { useBrandRoleRotator } from '~/composables/ui/useBrandRoleRotator';

const localePath = useLocalePath();
const { brandRoles } = useBrandRoleRotator();
const currentYear = new Date().getFullYear();

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

const caseStudyLinks: FooterLink[] = [
  { name: 'caseStudies.items.colegium.footerLink', to: '/case-studies/colegium' },
  { name: 'caseStudies.items.lingoquesto.footerLink', to: '/case-studies/lingoquesto' },
  { name: 'caseStudies.items.tissini.footerLink', to: '/case-studies/tissini' },
];

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
    title: 'col.cases',
    links: caseStudyLinks,
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
    class="py-14 sm:py-16 md:py-20 xl:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-background relative overflow-hidden border-t border-foreground/5"
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
        <!-- Brand Identity (Microformats2 h-card) -->
        <div
          class="h-card vcard group w-full xl:w-auto xl:max-w-sm flex flex-col md:flex-row md:items-end md:justify-between xl:flex-col xl:items-start gap-5 md:gap-8 xl:gap-5"
        >
          <div class="flex items-center gap-3.5 sm:gap-4 shrink-0">
            <span
              class="relative size-11 sm:size-12 md:size-14 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105 shrink-0"
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
            <div class="flex flex-col justify-center min-w-0">
              <p
                class="p-name fn text-xl md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300 uppercase leading-tight"
              >
                {{ $t('hero.name') }}
              </p>
              <AppTextRotator
                :items="brandRoles"
                container-class="p-job-title title text-xs md:text-sm tracking-[0.12em] md:tracking-[0.16em] text-muted uppercase font-bold group-hover:text-foreground transition-colors duration-300 h-[1.35em]"
                track-class="footer__brand-subtitle-track"
                line-class="footer__brand-subtitle-line"
              />
            </div>
          </div>
          <p
            class="p-note note text-muted text-xs md:text-sm font-medium uppercase tracking-[0.14em] md:tracking-[0.18em] max-w-md md:max-w-xs xl:max-w-sm leading-relaxed md:leading-loose md:text-right xl:text-left pl-1 md:pl-0"
          >
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <!-- Navigation: 1–2 cols on narrow screens, 2 on sm/md, 4 on lg+ -->
        <nav
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-8 xl:gap-x-10 w-full xl:w-auto xl:min-w-0 xl:max-w-3xl xl:grow"
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
                  :rel="
                    link.href && link.href.startsWith('http') ? 'me noopener noreferrer' : undefined
                  "
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
          <span>{{ currentYear }} {{ $t('footer.protocol') }}</span>
          <span class="hidden sm:inline text-muted/30" aria-hidden="true">|</span>
          <span class="opacity-50 tracking-[0.12em] sm:tracking-[0.16em]">{{
            $t('footer.rights')
          }}</span>
        </p>
        <AppBadge
          :to="localePath('/ai-assisted-craft')"
          variant="primary"
          size="sm"
          icon="logos:nuxt-icon"
          class="cursor-pointer font-semibold text-xs tracking-normal normal-case"
        >
          Built with Nuxt 4 & AI Craft
        </AppBadge>

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
            :rel="s.link.startsWith('mailto:') ? undefined : 'me noopener noreferrer'"
            :class="[
              'footer-social-link size-11 md:size-12 rounded-xl md:rounded-2xl border flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              s.link.startsWith('mailto:') ? 'u-email email' : 'u-url url',
            ]"
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
