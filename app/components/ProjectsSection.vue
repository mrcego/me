<template>
  <section
    id="portfolio"
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- Architecture Background -->
    <div
      class="absolute inset-0 opacity-[0.03] z-0 pointer-events-none overflow-hidden"
    >
      <div class="absolute top-0 left-0 w-full h-full project-grid-bg" />
    </div>

    <div class="container mx-auto space-y-20 md:space-y-32 relative z-10">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-end gap-12 lg:gap-24"
      >
        <Motion
          :initial="{ opacity: 0, x: -50 }"
          :in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="space-y-8 md:space-y-10 group"
        >
          <div class="flex items-center gap-4 md:gap-6">
            <div
              class="h-px w-12 md:w-16 bg-primary shadow-[0_0_10px_rgba(255,75,92,0.5)]"
            />
            <h2
              class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
            >
              {{ ("portfolio.section_tag") }}
            </h2>
          </div>
          <h3
            class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-white"
          >
            {{ ("portfolio.title_top") }}<br>
            <span class="text-gradient">{{
              ("portfolio.title_bottom")
            }}</span>
          </h3>
        </Motion>

        <!-- Filter Tabs with Motion -->
        <Motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :in-view="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.8, delay: 0.2 }"
          :viewport="{ once: true }"
          class="flex flex-wrap gap-2 md:gap-4 p-2 md:p-3 glass rounded-[2.5rem] border-white/5 w-fit shadow-xl"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-6 md:px-10 py-3 md:py-4 rounded-[1.8rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 shrink-0 select-none"
            :class="[
              activeCategory === cat
                ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105'
                : 'text-slate-500 hover:text-white hover:bg-white/5',
            ]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </Motion>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <Motion
          v-for="(project, i) in filteredProjects"
          :key="project.title"
          :initial="{ opacity: 0, y: 30 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.8,
            delay: i * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="group relative glass p-6 md:p-10 rounded-[3rem] md:rounded-[5rem] border-white/5 hover:border-primary/40 transition-all duration-700 flex flex-col cursor-pointer overflow-hidden"
        >
          <!-- holographic sweep -->
          <div
            class="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
          />

          <div
            class="relative aspect-video rounded-4xl overflow-hidden bg-slate-900 mb-8 md:mb-12 shrink-0 border border-white/5"
          >
            <img
              :src="project.image"
              class="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              alt="Project Showcase"
            >

            <!-- Scanline Overlay on Project Image -->
            <div
              class="absolute inset-0 z-20 opacity-0 group-hover:opacity-30 pointer-events-none project-scanline"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />

            <div
              class="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-wrap gap-2 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-100 px-2 opacity-0 group-hover:opacity-100"
            >
              <div
                v-for="tag in project.tags"
                :key="tag"
                class="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-4 md:px-5 py-1.5 md:py-2 rounded-xl shadow-2xl shrink-0 hover:bg-primary transition-colors cursor-default"
              >
                {{ tag }}
              </div>
            </div>
          </div>

          <div
            class="space-y-6 md:space-y-8 px-2 md:px-4 flex-1 flex flex-col justify-between relative z-10"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="space-y-1">
                <h4
                  class="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors"
                >
                  {{ (portfolio.projects..title) }}
                </h4>
                <p
                  class="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest"
                >
                  {{ project.category }}
                </p>
              </div>
              <a
                href="#"
                class="w-12 h-12 md:w-16 md:h-16 glass rounded-full flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:scale-110 active:scale-90 transition-all duration-500 shrink-0 shadow-lg"
              >
                <Icon name="solar:arrow-right-up-linear" class="w-6 h-6" />
              </a>
            </div>

            <p
              class="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg line-clamp-3 group-hover:line-clamp-none transition-all duration-700 font-medium"
            >
              {{ (portfolio.projects..desc) }}
            </p>
          </div>
        </Motion>
      </div>

      <Motion
        :initial="{ opacity: 0, y: 5 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }"
        :viewport="{ once: true }"
        class="text-center pt-8 md:pt-16"
      >
        <button
          class="btn-premium px-12 md:px-16 py-6 md:py-8 border-white/10 text-white rounded-[3rem] hover:border-primary hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto mx-auto flex items-center justify-center"
        >
          <span class="flex items-center gap-4 md:gap-6">
            <Icon
              name="solar:case-round-minimalistic-bold-duotone"
              class="w-5 h-5 md:w-6 md:h-6"
            />
            <span
              class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]"
              >{{ ("portfolio.nexus") }}</span
            >
          </span>
        </button>
      </Motion>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";
import { ref, computed } from "vue";

const activeCategory = ref("All");
const categories = ["All", "Systems", "Fullstack", "Frontend"];

const projects = [
  {
    title: "Colegium Cloud Architecture",
    category: "Fullstack",
    tags: ["Vue 3", "Node.js"],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    desc: "Leading the technical evolution of a massive educational platform. Refactored legacy systems into modern Vue 3 architectures with 100k+ users.",
  },
  {
    title: "LingoQuesto Interface",
    category: "Frontend",
    tags: ["Nuxt 4", "Motion"],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    desc: "Boutique frontend engineering focused on high-performance learning interfaces and seamless motion orchestration.",
  },
];

const filteredProjects = computed(() => {
  if (activeCategory.value === "All") return projects;
  return projects.filter((p) => p.category === activeCategory.value);
});
</script>

<style scoped>
.project-scanline {
  background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 75, 92, 0.2) 2px);
}

.project-grid-bg {
  background-image: linear-gradient(0deg, #ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px);
  background-size: 100px 100px;
}
</style>
