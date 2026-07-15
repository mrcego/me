<template>
  <footer
    class="py-20 md:py-32 px-6 md:px-12 bg-background relative overflow-hidden border-t border-foreground/5"
  >
    <!-- Cinematic Background -->
    <div class="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none footer-ambient-bg" />

    <div
      class="absolute bottom-0 left-0 right-0 h-75 bg-linear-to-t from-primary/5 to-transparent pointer-events-none opacity-30"
    />

    <div class="container mx-auto space-y-16 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <!-- Brand Identity -->
        <div class="space-y-6 group cursor-pointer">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary group-hover:-rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20 border-foreground/10"
            >
              <Icon name="solar:code-square-bold-duotone" class="w-14 h-14" />
            </div>
            <div class="flex flex-col">
              <h3
                class="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300 uppercase"
              >
                {{ $t('hero.name') }}
              </h3>
              <span
                class="text-xs sm:text-sm tracking-[0.2em] text-muted uppercase font-bold group-hover:text-foreground transition-colors delay-75"
              >
                {{ $t('hero.tags.frontArch') }}
              </span>
            </div>
          </div>
          <p
            class="text-muted text-sm font-medium uppercase tracking-[0.2em] max-w-xs leading-loose pl-1"
          >
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <!-- Navigation Columns -->
        <div class="flex flex-wrap gap-12 md:gap-24">
          <div v-for="col in footerLinks" :key="col.title" class="space-y-6">
            <h3 class="type-eyebrow tracking-[0.4em] flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {{ $t(col.title) }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in col.links" :key="link.name">
                <a
                  :href="link.href"
                  class="text-xs md:text-sm font-medium text-muted hover:text-foreground transition-all hover:translate-x-2 inline-flex items-center gap-2 group/link"
                >
                  <span
                    class="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-300 opacity-0 group-hover/link:opacity-100 text-primary"
                  >
                    <Icon name="solar:arrow-right-linear" class="w-6 h-6" />
                  </span>
                  {{ $t(link.name) }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div
        class="pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8"
      >
        <p
          class="text-xs md:text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2"
        >
          <span>{{ new Date().getFullYear() }} {{ $t('footer.protocol') }}</span>
          <span class="hidden md:inline text-muted/30">|</span>
          <span class="opacity-50 tracking-[0.2em]">{{ $t('footer.rights') }}</span>
        </p>

        <!-- Socials -->
        <div class="flex gap-4">
          <a
            v-for="s in socials"
            :key="s.icon"
            :href="s.link"
            class="aspect-3/4 w-full h-full bg-foreground/5 rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,75,92,0.4)] border-foreground/10 hover:border-primary flex items-center justify-center p-0 group/social"
            aria-label="Social Link"
          >
            <Icon
              :name="s.icon"
              class="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] transition-colors duration-300 text-muted group-hover/social:text-primary-contrast"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const footerLinks = [
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
    title: 'col.connect',
    links: [
      { name: 'nav.getInTouch', href: 'mailto:cesargomezh90@gmail.com' },
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

<style scoped>
.footer-ambient-bg {
  background-image: radial-gradient(circle, rgba(255, 75, 92, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to bottom, black, transparent);
}
</style>
