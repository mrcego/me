<template>
  <section id="about" class="py-24 md:py-32 px-6 md:px-12 relative bg-secondary/5 overflow-hidden">
    <!-- Background Decorative Element -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

    <div class="container mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
        <!-- Sidebar Card with Motion (Spans 5 cols) -->
        <Motion
          :initial="motionInitial({ opacity: 0, x: -50 })"
          :in-view="motionInView({ opacity: 1, x: 0 })"
          :viewport="{ once: true }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          class="lg:col-span-5 lg:sticky lg:top-32 w-full mx-auto -mt-32 sm:-mt-16 lg:-mt-6 xl:mt-0"
        >
          <div
            class="glass border-white/5 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-1000 hover:border-primary/40 shadow-2xl relative group bg-background/20 backdrop-blur-3xl"
          >
            <!-- Gamified Energy Border -->
            <div
              class="absolute inset-0 border border-primary/20 rounded-[2.5rem] md:rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />

            <div
              class="relative aspect-3/4 rounded-3xl overflow-hidden mb-8 md:mb-10 border border-white/10 mx-auto transition-all duration-1000 group-hover:scale-[1.02] shadow-2xl group/photo hidden lg:block"
            >
              <!-- Cinematic HUD Overlay for Photo -->
              <div
                class="absolute inset-0 z-20 pointer-events-none border-8 md:border-12 border-white/5 rounded-3xl"
              />
              <div
                class="absolute inset-0 z-20 pointer-events-none bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60"
              />

              <NuxtImg
                src="/img/me.jpg"
                alt="César Gómez - Senior Fullstack Developer and Frontend Architect"
                width="600"
                height="800"
                format="webp"
                quality="85"
                loading="lazy"
                sizes="sm:300px md:400px lg:500px xl:600px"
                class="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000 scale-105 group-hover:scale-100"
              />

              <div
                class="absolute inset-x-0 top-0 h-1 bg-primary/40 blur-sm animate-scanline z-30 opacity-0 group-hover:opacity-100"
              />
            </div>

            <!-- Content inside card -->
            <h3
              class="text-xl md:text-2xl font-black tracking-tight text-foreground mb-3 sm:mb-4 px-2 text-center lg:text-left"
            >
              {{ $t('about.philosophy') }}
            </h3>

            <p
              class="mb-6 sm:mb-8 md:mb-10 text-sm md:text-base font-medium text-muted leading-relaxed px-2 text-center lg:text-left"
            >
              "{{ $t('about.philosophyQuote') }}"
            </p>

            <div class="space-y-4 sm:space-y-5">
              <div
                v-for="point in aboutPoints"
                :key="point.label"
                class="flex gap-3 sm:gap-4 group/p cursor-default"
              >
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 glass rounded-lg sm:rounded-xl flex items-center justify-center text-primary group-hover/p:bg-primary group-hover/p:text-primary-contrast transition-all duration-500 shrink-0 shadow-lg"
                >
                  <Icon :name="point.icon" class="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13" />
                </div>
                <div
                  class="transition-transform duration-300 group-hover/p:translate-x-1 flex flex-col justify-center"
                >
                  <h5
                    class="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-foreground"
                  >
                    {{ $t(point.label) }}
                  </h5>
                  <p
                    class="text-[8px] sm:text-[9px] md:text-[10px] text-muted font-bold uppercase tracking-widest pt-0.5"
                  >
                    {{ $t(point.descKey) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Main Content Area (Spans 7 cols) -->
        <div class="lg:col-span-7 space-y-16 md:space-y-24 pt-2 sm:pt-4 lg:pt-0">
          <Motion
            :initial="motionInitial({ opacity: 0, y: 30 })"
            :in-view="motionInView({ opacity: 1, y: 0 })"
            :viewport="{ once: true }"
            :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
            class="space-y-6 md:space-y-10"
          >
            <div class="flex items-center gap-4 justify-center lg:justify-start">
              <div class="h-px w-12 bg-foreground/10" />
              <div class="flex items-center gap-3 shrink-0">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2
                  class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
                >
                  {{ $t('about.section') }}
                </h2>
              </div>
            </div>

            <h3
              class="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground text-center lg:text-left"
            >
              {{ $t('about.title') }}<br />
              <span class="text-gradient">{{ $t('about.titleHighlight') }}</span>
            </h3>

            <div
              class="prose prose-invert prose-lg md:prose-xl max-w-none text-muted font-medium leading-relaxed space-y-6 text-center lg:text-left mx-auto lg:mx-0"
            >
              <p>
                {{ $t('about.description1') }}
              </p>
              <p>
                {{ $t('about.description2') }}
              </p>
            </div>
          </Motion>

          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Motion
              v-for="(role, i) in roles"
              :key="role.key"
              :initial="motionInitial({ opacity: 0, y: 20 })"
              :in-view="motionInView({ opacity: 1, y: 0 })"
              :viewport="{ once: true }"
              :transition="{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }"
              class="glass p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl md:rounded-4xl border-foreground/5 hover:border-primary/30 transition-all duration-700 group hover:-translate-y-2 flex flex-col justify-between min-h-56 sm:min-h-64 relative overflow-hidden"
            >
              <div
                class="absolute inset-x-0 bottom-0 h-px bg-primary/20 z-20 pointer-events-none"
              />
              <div
                class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div class="space-y-3 sm:space-y-4 md:space-y-6 relative z-10 h-full flex flex-col">
                <div class="flex justify-between items-start">
                  <div
                    class="px-3 py-1 sm:px-4 sm:py-1.5 glass rounded-lg sm:rounded-xl text-[7px] sm:text-[8px] font-black uppercase tracking-[0.25em] text-primary group-hover:bg-primary group-hover:text-primary-contrast transition-all shadow-sm"
                  >
                    {{ $t(`about.roles.${role.key}.years`) }}
                  </div>
                  <Icon
                    :name="role.icon"
                    class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-muted group-hover:text-primary transition-colors"
                  />
                </div>

                <div class="space-y-1.5 sm:space-y-2">
                  <h4
                    class="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors"
                  >
                    {{ $t(`about.roles.${role.key}.title`) }}
                  </h4>
                  <p
                    class="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted"
                  >
                    {{ $t(`about.roles.${role.key}.company`) }}
                  </p>
                </div>

                <p
                  class="text-xs sm:text-sm text-muted leading-relaxed pt-2 sm:pt-3 md:pt-4 border-t border-foreground/5 group-hover:border-foreground/10 transition-colors"
                >
                  {{ $t(`about.roles.${role.key}.desc`) }}
                </p>
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from 'motion-v';

const { motionInitial, motionInView } = useMotionConfig();

const aboutPoints = [
  {
    label: 'about.expertise',
    descKey: 'techStack.levels.architect',
    icon: 'logos:vue',
  },
  {
    label: 'about.logic',
    descKey: 'techStack.levels.senior',
    icon: 'logos:nodejs-icon',
  },
  {
    label: 'about.userCentric',
    descKey: 'techStack.levels.founding',
    icon: 'logos:figma',
  },
];

const roles = [
  {
    key: 'lingoquesto',
    icon: 'logos:nuxt-icon',
  },
  {
    key: 'colegium',
    icon: 'logos:vue',
  },
  {
    key: 'tissini',
    icon: 'logos:vue',
  },
  {
    key: 'cuartopixel',
    icon: 'logos:angular-icon',
  },
  {
    key: 'zabud',
    icon: 'logos:angular-icon',
  },
];
</script>

<style scoped>
@keyframes scanline-subtle {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(300%);
  }
}
.animate-scanline {
  animation: scanline-subtle 3s linear infinite;
}
</style>
