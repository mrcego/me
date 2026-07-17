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
          <CertCompactRow
            v-for="cert in previewRestCertifications"
            :key="cert.id"
            :cert="cert"
            :expanded="expandedId === cert.id"
            :panel-id="`cert-panel-${cert.id}`"
            @toggle="toggleExpanded(cert.id)"
          />
        </ul>

        <div
          v-if="extraRestCertifications.length"
          id="cert-show-all-panel"
          class="cert-show-all-panel"
          :class="{ 'cert-show-all-panel--open': showAllRest }"
          :aria-hidden="!showAllRest"
          :inert="!showAllRest"
        >
          <div class="cert-show-all-panel__inner">
            <ul class="divide-y divide-foreground/5 border-t border-foreground/5" role="list">
              <CertCompactRow
                v-for="cert in extraRestCertifications"
                :key="cert.id"
                :cert="cert"
                :expanded="expandedId === cert.id"
                :panel-id="`cert-panel-${cert.id}`"
                @toggle="toggleExpanded(cert.id)"
              />
            </ul>
          </div>
        </div>

        <div
          v-if="extraRestCertifications.length"
          class="px-4 sm:px-6 py-4 border-t border-foreground/5"
        >
          <button
            type="button"
            class="w-full min-h-11 flex items-center justify-center gap-2 py-3 glass rounded-xl text-sm font-black uppercase tracking-[0.2em] text-foreground cursor-pointer hover:bg-primary hover:text-primary-contrast transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            :aria-expanded="showAllRest"
            aria-controls="cert-show-all-panel"
            @click="showAllRest = !showAllRest"
          >
            {{
              showAllRest
                ? $t('certifications.showLess')
                : $t('certifications.showAll', { count: restCertifications.length })
            }}
            <Icon
              name="lucide:chevron-down"
              class="cert-show-all-chevron size-5 shrink-0"
              :class="{ 'cert-show-all-chevron--open': showAllRest }"
              aria-hidden="true"
            />
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

const previewRestCertifications = computed(() =>
  restCertifications.value.slice(0, REST_PREVIEW_COUNT),
);

const extraRestCertifications = computed(() => restCertifications.value.slice(REST_PREVIEW_COUNT));

function toggleExpanded(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

watch(showAllRest, () => {
  if (!showAllRest.value && expandedId.value) {
    const stillVisible = previewRestCertifications.value.some((c) => c.id === expandedId.value);
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

.cert-show-all-chevron {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.cert-show-all-chevron--open {
  transform: rotate(180deg);
}

.cert-show-all-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.cert-show-all-panel__inner {
  overflow: hidden;
  min-height: 0;
}

.cert-show-all-panel--open {
  grid-template-rows: 1fr;
}

@media (prefers-reduced-motion: reduce) {
  .cert-show-all-chevron,
  .cert-show-all-panel {
    transition: none;
  }
}
</style>
