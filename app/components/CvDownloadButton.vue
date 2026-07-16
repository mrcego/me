<template>
  <a
    :href="href"
    :download="fileName"
    class="inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-3xl border border-foreground/15 bg-foreground/5 px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:scale-[1.03] active:scale-95 w-full sm:w-auto"
    :aria-label="$t('hero.downloadCvAria', { file: fileName })"
  >
    <Icon
      name="solar:download-minimalistic-bold-duotone"
      class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] shrink-0"
    />
    <span>{{ $t('hero.downloadCv') }}</span>
  </a>
</template>

<script setup lang="ts">
const { href, fileName } = useCvDownload();
</script>
