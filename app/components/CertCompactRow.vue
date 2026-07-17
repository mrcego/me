<template>
  <li class="relative">
    <button
      type="button"
      class="absolute inset-0 w-full h-full cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 hover:bg-foreground/3 transition-colors"
      :aria-expanded="expanded"
      :aria-controls="panelId"
      :aria-label="cert.title"
      @click="$emit('toggle')"
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
        :class="{ 'cert-row-chevron--open': expanded }"
        aria-hidden="true"
      />
    </div>

    <div
      :id="panelId"
      class="cert-expand-panel"
      :class="{ 'cert-expand-panel--open': expanded }"
      :aria-hidden="!expanded"
      :inert="!expanded"
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
</template>

<script setup lang="ts">
export interface CertCompactItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  url: string;
}

defineProps<{
  cert: CertCompactItem;
  expanded: boolean;
  panelId: string;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<style scoped>
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
