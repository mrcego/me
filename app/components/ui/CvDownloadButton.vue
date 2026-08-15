<script setup lang="ts">
import { ref } from 'vue';

const { href, fileName } = useCvDownload();
const { trackEvent } = useAnalytics();
const downloadState = ref<'idle' | 'packaging' | 'ready'>('idle');

function onCvClick() {
  trackEvent('cv_download', { file: fileName.value });

  if (downloadState.value !== 'idle') return;
  downloadState.value = 'packaging';

  setTimeout(() => {
    downloadState.value = 'ready';
    setTimeout(() => {
      downloadState.value = 'idle';
    }, 2400);
  }, 450);
}
</script>

<template>
  <a
    :href="href"
    :download="fileName"
    class="cv-download-btn group inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-3.5 text-sm sm:text-base font-bold text-foreground transition-all duration-200 hover:scale-[1.02] hover:text-primary active:scale-[0.98] w-full sm:w-auto sm:shrink-0 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
    :class="{ 'cv-download-btn--active': downloadState !== 'idle' }"
    :aria-label="$t('hero.downloadCvAria', { file: fileName })"
    @click="onCvClick"
  >
    <Icon
      v-if="downloadState === 'ready'"
      name="solar:check-circle-bold"
      class="size-5 shrink-0 relative z-10 text-emerald-400 animate-in zoom-in duration-200"
    />
    <Icon
      v-else
      name="solar:download-minimalistic-bold-duotone"
      class="size-5 shrink-0 relative z-10 text-primary/80 transition-transform group-hover:-translate-y-0.5"
      :class="{ 'animate-bounce text-primary': downloadState === 'packaging' }"
    />
    <span
      v-if="downloadState === 'packaging'"
      class="relative z-10 whitespace-nowrap font-mono text-xs text-primary"
    >
      [PACKAGING ARTIFACT...]
    </span>
    <span
      v-else-if="downloadState === 'ready'"
      class="relative z-10 whitespace-nowrap font-mono text-xs text-emerald-400"
    >
      [VERIFIED & READY ✓]
    </span>
    <span v-else class="relative z-10 whitespace-nowrap">{{ $t('hero.downloadCv') }}</span>

    <!-- Ambient packaging progress sheen -->
    <div
      v-if="downloadState === 'packaging'"
      class="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent animate-shimmer pointer-events-none"
    />
  </a>
</template>

<style scoped>
.cv-download-btn {
  position: relative;
  isolation: isolate;
  border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
  background: color-mix(in srgb, var(--secondary) 92%, var(--background));
  box-shadow: 0 0 16px color-mix(in srgb, var(--primary) 12%, transparent);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    color 0.25s ease;
}

.cv-download-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--foreground) 5%, transparent);
  transition: background-color 0.3s ease;
}

.cv-download-btn:hover {
  border-color: var(--primary);
  box-shadow: 0 0 22px color-mix(in srgb, var(--primary) 28%, transparent);
}

.cv-download-btn:hover::before {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .cv-download-btn {
    border-color: color-mix(in srgb, var(--foreground) 15%, transparent);
    background: color-mix(in srgb, var(--foreground) 5%, transparent);
    box-shadow: none;
  }

  .cv-download-btn:hover {
    border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
  }
}
</style>
