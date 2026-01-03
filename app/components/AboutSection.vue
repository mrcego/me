<template>
  <section
    id="about"
    class="py-24 md:py-32 px-6 md:px-12 relative bg-secondary/5 overflow-hidden"
  >
    <!-- Background Decorative Element -->
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10"
    />

    <div class="container mx-auto">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <!-- Sidebar Card with Motion (Spans 5 cols) -->
        <Motion
          :initial="{ opacity: 0, x: -50 }"
          :in-view="{ opacity: 1, x: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          class="lg:col-span-5 lg:sticky lg:top-32 w-full mx-auto"
        >
          <div
            class="glass border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-8 md:p-12 transition-all duration-1000 hover:border-primary/40 shadow-2xl relative group bg-background/20 backdrop-blur-3xl"
          >
            <!-- Gamified Energy Border -->
            <div
              class="absolute inset-0 border border-primary/20 rounded-[2.5rem] md:rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />

            <div
              class="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8 md:mb-10 border border-white/10 mx-auto transition-all duration-1000 group-hover:scale-[1.02] shadow-2xl group/photo"
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
                alt="CÃ©sar GÃ³mez - Senior Fullstack Developer and Frontend Architect"
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
              class="text-xl md:text-2xl font-black tracking-tight text-white mb-4 px-2"
            >
              {{ $t("about.philosophy") }}
            </h3>

            <p
              class="mb-8 md:mb-10 text-sm md:text-base font-medium text-slate-300 leading-relaxed px-2"
            >
              "{{ $t("about.philosophyQuote") }}"
            </p>

            <div class="space-y-5">
              <div
                v-for="point in aboutPoints"
                :key="point.label"
                class="flex gap-4 group/p cursor-default"
              >
                <div
                  class="w-10 h-10 md:w-12 md:h-12 glass rounded-xl flex items-center justify-center text-primary group-hover/p:bg-primary group-hover/p:text-white transition-all duration-500 shrink-0 shadow-lg"
                >
                  <Icon :name="point.icon" class="w-5 h-5" />
                </div>
                <div
                  class="transition-transform duration-300 group-hover/p:translate-x-1 flex flex-col justify-center"
                >
                  <h5
                    class="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white"
                  >
                    {{ $t(point.label) }}
                  </h5>
                  <p
                    class="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-0.5"
                  >
                    {{ point.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Main Content Area (Spans 7 cols) -->
        <div class="lg:col-span-7 space-y-16 md:space-y-24 pt-8 lg:pt-0">
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
            class="space-y-6 md:space-y-10"
          >
            <div class="flex items-center gap-4">
              <div class="h-px w-12 bg-white/10" />
              <div class="flex items-center gap-3 shrink-0">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2
                  class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
                >
                  {{ $t("about.section") }}
                </h2>
              </div>
            </div>

            <h3
              class="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white"
            >
              {{ $t("about.title") }}<br>
              <span class="text-gradient">{{
                $t("about.titleHighlight")
              }}</span>
            </h3>

            <div
              class="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-400 font-medium leading-relaxed space-y-6"
            >
              <p>
                {{ $t("about.description1") }}
              </p>
              <p>
                {{ $t("about.description2") }}
              </p>
            </div>
          </Motion>

          <div class="grid sm:grid-cols-2 gap-6 md:gap-8">
            <Motion
              v-for="(role, i) in roles"
              :key="role.company"
              :initial="{ opacity: 0, y: 20 }"
              :in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }"
              class="glass p-6 md:p-10 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all duration-700 group hover:-translate-y-2 flex flex-col justify-between min-h-64 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div class="space-y-6 relative z-10 h-full flex flex-col">
                <div class="flex justify-between items-start">
                  <div
                    class="px-4 py-1.5 glass rounded-xl text-[8px] font-black uppercase tracking-[0.25em] text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                  >
                    {{ role.years }}
                  </div>
                  <Icon
                    :name="role.icon"
                    class="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors"
                  />
                </div>

                <div class="space-y-2">
                  <h4
                    class="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors"
                  >
                    {{ role.title }}
                  </h4>
                  <p
                    class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
                  >
                    {{ role.company }}
                  </p>
                </div>

                <p
                  class="text-xs md:text-sm text-slate-400 leading-relaxed mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors"
                >
                  {{ role.desc }}
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
import { Motion } from "motion-v";

const aboutPoints = [
  {
    label: "about.expertise",
    desc: "Vue & Nuxt Specialist",
    icon: "logos:vue",
  },
  {
    label: "about.logic",
    desc: "Node.js & Systems",
    icon: "logos:nodejs-icon",
  },
  {
    label: "about.userCentric",
    desc: "Interface DX Focus",
    icon: "logos:figma",
  },
];

const roles = [
  {
    title: "Founding Member | Senior Fullstack",
    company: "LingoQuesto",
    years: "2024 - Present",
    icon: "logos:nuxt-icon",
    desc: "Defining product vision and fullstack roadmap, ensuring the frontend reflects high-end craftsmanship.",
  },
  {
    title: "Interim CTO",
    company: "AnceLab",
    years: "Feb '25 - Jul '25",
    icon: "logos:typescript-icon",
    desc: "Technical leadership and strategic definition for high-impact projects during transitional phases.",
  },
  {
    title: "Senior Frontend Developer",
    company: "Colegium",
    years: "2021 - 2025",
    icon: "logos:vue",
    desc: "Orchestrating complex ecosystems and micro-frontend architectures for 100k+ students.",
  },
  {
    title: "Senior Frontend Developer",
    company: "TISSINI",
    years: "2019 - 2021",
    icon: "logos:vue",
    desc: "Developed mobile-first solutions with Vue 3. Reduced deployment times by 60% via CI/CD.",
  },
  {
    title: "Freelance Software Developer",
    company: "Independiente",
    years: "2017 - 2018",
    icon: "logos:javascript",
    desc: "Web and mobile application development focusing on cross-platform versatility.",
  },
  {
    title: "Web Frontend Developer",
    company: "4to Pixel",
    years: "2018",
    icon: "logos:angular-icon",
    desc: "Crafted high-performance UX/UI web experiences using Angular 6+ for modern ecosystems.",
  },
  {
    title: "Frontend Developer",
    company: "Que Hay Pa' Hacer",
    years: "2017",
    icon: "logos:javascript",
    desc: "Planned and developed digital marketing technologies and mobile-first web apps.",
  },
  {
    title: "Junior Frontend Developer",
    company: "ZABUD Technologies",
    years: "2016",
    icon: "logos:angular-icon",
    desc: "Visual development using AngularJS, HTML5, CSS3, and jQuery for tailored modular solutions.",
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

