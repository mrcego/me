<template>
  <section
    id="certifications"
    class="py-24 md:py-48 px-6 md:px-12 bg-background relative overflow-hidden"
  >
    <!-- Background Accents -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"
    />
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"
    />

    <div class="container mx-auto">
      <!-- Section Header -->
      <Motion
        :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
        :viewport="{ once: true }"
        class="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center space-y-6 md:space-y-10 mb-12 md:mb-24 px-2 sm:px-0"
      >
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
          <h2 class="type-eyebrow tracking-[0.4em]">
            {{ $t('certifications.section') }}
          </h2>
          <div class="h-0.5 w-12 md:w-16 bg-primary/20" />
        </div>
        <h3
          class="certifications-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] text-foreground"
        >
          <span class="block">{{ $t('certifications.title') }}</span>
          <span class="text-gradient certifications-heading__highlight block">
            {{ $t('certifications.titleHighlight') }}
          </span>
        </h3>
        <p
          class="text-muted text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-relaxed max-w-2xl mx-auto"
        >
          {{ $t('certifications.description') }}
        </p>
      </Motion>

      <!-- Featured credentials -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mb-10 md:mb-14">
        <Motion
          v-for="(cert, i) in featuredCertifications"
          :key="cert.id"
          :initial="motionInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })"
          :while-in-view="motionInView({ opacity: 1, y: 0 })"
          :transition="{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }"
          :viewport="{ once: true }"
          class="surface-card group relative glass p-5 sm:p-6 md:p-8 rounded-4xl border-foreground/5 flex flex-col justify-between h-full overflow-hidden min-w-0"
        >
          <div class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none" />

          <div class="space-y-5 sm:space-y-6 relative z-10">
            <div class="flex justify-between items-start gap-3">
              <div
                class="surface-card__icon w-[58px] h-[58px] glass rounded-2xl flex items-center justify-center text-primary shadow-xl shrink-0"
              >
                <Icon name="solar:medal-ribbon-bold" class="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <span class="surface-card__meta type-meta text-muted">{{ cert.date }}</span>
            </div>

            <div class="space-y-2 min-w-0">
              <h4
                class="surface-card__title text-lg sm:text-xl font-bold tracking-tight text-foreground text-balance wrap-break-word line-clamp-2 sm:line-clamp-3"
              >
                {{ cert.title }}
              </h4>
              <div class="flex items-center gap-2 text-sm font-medium text-muted">
                <Icon name="simple-icons:linkedin" class="size-5 shrink-0" />
                <span>{{ cert.issuer }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in cert.skills"
                :key="skill"
                class="surface-card__tag type-label text-muted bg-foreground/5 px-2.5 py-1 rounded-md border border-foreground/5"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="surface-card__footer mt-8 pt-6 border-t border-foreground/5 relative z-10">
            <NuxtLink
              :to="cert.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl text-sm font-black uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-contrast transition-all duration-500 group/btn"
            >
              {{ $t('certifications.viewCredential') }}
              <Icon
                name="solar:arrow-right-up-linear"
                class="size-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
              />
            </NuxtLink>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>

      <!-- Compact rest list -->
      <Motion
        v-if="restCertifications.length"
        :initial="motionInitial({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
        :viewport="{ once: true }"
        class="glass rounded-3xl md:rounded-4xl border border-foreground/5 overflow-hidden"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-foreground/5"
        >
          <h4 class="type-eyebrow tracking-[0.3em] text-muted">
            {{ $t('certifications.allCredentials') }}
          </h4>
          <p class="text-sm font-medium text-muted" aria-live="polite">
            {{ $t('certifications.moreCredentials', { count: restCertifications.length }) }}
          </p>
        </div>

        <ul class="divide-y divide-foreground/5" role="list">
          <li v-for="cert in visibleRestCertifications" :key="cert.id" class="relative">
            <!-- Full-row disclosure toggle (covers the row for a large tap target) -->
            <button
              type="button"
              class="absolute inset-0 w-full h-full cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 hover:bg-foreground/3 transition-colors"
              :aria-expanded="expandedId === cert.id"
              :aria-controls="`cert-panel-${cert.id}`"
              :aria-label="cert.title"
              @click="toggleExpanded(cert.id)"
            />

            <div
              class="pointer-events-none relative flex items-start sm:items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 min-h-11"
            >
              <div class="min-w-0 flex-1 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                <span
                  class="block text-sm sm:text-base font-bold text-foreground tracking-tight line-clamp-2 sm:line-clamp-1 text-pretty"
                >
                  {{ cert.title }}
                </span>
                <span
                  class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted shrink-0"
                >
                  <span class="type-meta">{{ cert.date }}</span>
                  <span class="text-foreground/20" aria-hidden="true">·</span>
                  <span class="inline-flex items-center gap-1.5">
                    <Icon name="simple-icons:linkedin" class="size-3.5 shrink-0" />
                    {{ cert.issuer }}
                  </span>
                </span>
              </div>

              <!-- View Credential: icon-only pill on mobile, labelled on sm+ -->
              <NuxtLink
                :to="cert.url"
                target="_blank"
                rel="noopener noreferrer"
                class="pointer-events-auto relative z-10 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 glass text-xs font-black uppercase tracking-[0.15em] text-foreground hover:bg-primary hover:text-primary-contrast transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group/btn"
                :aria-label="`${$t('certifications.viewCredential')}: ${cert.title}`"
              >
                <span class="hidden sm:inline">{{ $t('certifications.viewCredential') }}</span>
                <Icon
                  name="solar:arrow-right-up-linear"
                  class="size-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                />
              </NuxtLink>

              <Icon
                name="lucide:chevron-down"
                class="cert-row-chevron size-5 text-muted shrink-0 mt-2.5 sm:mt-0"
                :class="{ 'cert-row-chevron--open': expandedId === cert.id }"
                aria-hidden="true"
              />
            </div>

            <div
              :id="`cert-panel-${cert.id}`"
              class="cert-expand-panel"
              :class="{ 'cert-expand-panel--open': expandedId === cert.id }"
              :aria-hidden="expandedId !== cert.id"
              :inert="expandedId !== cert.id"
            >
              <div class="cert-expand-panel__inner">
                <div class="px-4 sm:px-6 pb-4 pt-0">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in cert.skills"
                      :key="skill"
                      class="type-label text-muted bg-foreground/5 px-2.5 py-1 rounded-md border border-foreground/5"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div
          v-if="restCertifications.length > REST_PREVIEW_COUNT"
          class="px-4 sm:px-6 py-4 border-t border-foreground/5"
        >
          <button
            type="button"
            class="w-full min-h-11 flex items-center justify-center gap-2 py-3 glass rounded-xl text-sm font-black uppercase tracking-[0.2em] text-foreground cursor-pointer hover:bg-primary hover:text-primary-contrast transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            @click="showAllRest = !showAllRest"
          >
            {{
              showAllRest
                ? $t('certifications.showLess')
                : $t('certifications.showAll', { count: restCertifications.length })
            }}
          </button>
        </div>
      </Motion>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import { useI18n } from 'vue-i18n';

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  url: string;
  featured: boolean;
}

const REST_PREVIEW_COUNT = 8;

const { tm, rt } = useI18n();
const { motionInitial, motionInView } = useMotionConfig();

const expandedId = ref<string | null>(null);
const showAllRest = ref(false);

function isFeaturedFlag(value: unknown): boolean {
  return value === true || value === 'true';
}

const certifications = computed<CertificationItem[]>(() => {
  const data = tm('certifications.data') as unknown;
  if (!Array.isArray(data)) return [];

  return data.map((item: unknown, index: number) => {
    const record = item as {
      title: string;
      issuer: string;
      date: string;
      skills?: string[];
      url: string;
      featured?: boolean | string;
    };

    return {
      id: `cert-${index}`,
      title: rt(record.title),
      issuer: rt(record.issuer),
      date: rt(record.date),
      skills: Array.isArray(record.skills) ? record.skills.map((s) => rt(s)) : [],
      url: rt(record.url),
      featured: isFeaturedFlag(record.featured),
    };
  });
});

const featuredCertifications = computed(() =>
  certifications.value.filter((cert) => cert.featured).slice(0, 4),
);

const restCertifications = computed(() => certifications.value.filter((cert) => !cert.featured));

const visibleRestCertifications = computed(() => {
  if (showAllRest.value) return restCertifications.value;
  return restCertifications.value.slice(0, REST_PREVIEW_COUNT);
});

function toggleExpanded(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

watch(showAllRest, () => {
  if (!showAllRest.value && expandedId.value) {
    const stillVisible = visibleRestCertifications.value.some((c) => c.id === expandedId.value);
    if (!stillVisible) expandedId.value = null;
  }
});
</script>

<style scoped>
.certifications-heading {
  text-wrap: balance;
}

.certifications-heading__highlight {
  display: inline-block;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding-bottom: 0.04em;
}

@media (min-width: 768px) {
  .certifications-heading__highlight {
    white-space: nowrap;
  }
}

@media (max-width: 389px) {
  .certifications-heading {
    font-size: 1.75rem;
  }
}

.cert-row-chevron {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cert-row-chevron--open {
  transform: rotate(180deg);
}

.cert-expand-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cert-expand-panel__inner {
  overflow: hidden;
  min-height: 0;
}

.cert-expand-panel--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .cert-row-chevron,
  .cert-expand-panel {
    transition: none;
  }

  .cert-expand-panel:not(.cert-expand-panel--open) {
    opacity: 1;
  }
}
</style>
