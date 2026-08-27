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
  <AppButton
    :href="href"
    :download="fileName"
    variant="secondary"
    size="lg"
    :loading="downloadState === 'packaging'"
    :icon="
      downloadState === 'ready'
        ? 'solar:check-circle-bold'
        : 'solar:download-minimalistic-bold-duotone'
    "
    :aria-label="$t('hero.downloadCvAria', { file: fileName })"
    class="w-full sm:w-auto sm:shrink-0 overflow-hidden relative"
    @click="onCvClick"
  >
    <span
      v-if="downloadState === 'packaging'"
      class="relative z-10 whitespace-nowrap font-mono text-xs text-primary"
    >
      {{ $t('hero.cvPackaging') }}
    </span>
    <span
      v-else-if="downloadState === 'ready'"
      class="relative z-10 whitespace-nowrap font-mono text-xs text-emerald-400"
    >
      {{ $t('hero.cvReady') }}
    </span>
    <span v-else class="relative z-10 whitespace-nowrap">{{ $t('hero.downloadCv') }}</span>

    <!-- Ambient packaging progress sheen -->
    <div
      v-if="downloadState === 'packaging'"
      class="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent animate-shimmer pointer-events-none"
    />
  </AppButton>
</template>
