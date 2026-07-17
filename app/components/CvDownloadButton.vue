<template>
  <a
    :href="href"
    :download="fileName"
    class="cv-download-btn inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-3xl px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-foreground transition-transform hover:scale-[1.03] hover:text-primary active:scale-95 w-full sm:w-auto sm:shrink-0 whitespace-nowrap"
    :aria-label="$t('hero.downloadCvAria', { file: fileName })"
  >
    <Icon
      name="solar:download-minimalistic-bold-duotone"
      class="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] shrink-0 relative z-10"
    />
    <span class="relative z-10 whitespace-nowrap">{{ $t('hero.downloadCv') }}</span>
  </a>
</template>

<script setup lang="ts">
const { href, fileName } = useCvDownload();
</script>

<style scoped>
@property --cv-border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.cv-download-btn {
  --cv-border-angle: 0deg;
  position: relative;
  isolation: isolate;
  border: 1px solid transparent;
  background:
    linear-gradient(
        color-mix(in srgb, var(--secondary) 92%, var(--background)),
        color-mix(in srgb, var(--secondary) 92%, var(--background))
      )
      padding-box,
    conic-gradient(
        from var(--cv-border-angle),
        transparent 0%,
        transparent 35%,
        color-mix(in srgb, var(--primary) 35%, transparent) 42%,
        var(--primary) 50%,
        color-mix(in srgb, var(--primary) 35%, transparent) 58%,
        transparent 65%,
        transparent 100%
      )
      border-box;
  animation: cv-border-spin 2.8s linear infinite;
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

.cv-download-btn:hover::before {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.cv-download-btn:hover {
  background:
    linear-gradient(
        color-mix(in srgb, var(--secondary) 92%, var(--background)),
        color-mix(in srgb, var(--secondary) 92%, var(--background))
      )
      padding-box,
    conic-gradient(
        from var(--cv-border-angle),
        transparent 0%,
        transparent 28%,
        color-mix(in srgb, var(--primary) 55%, transparent) 38%,
        var(--primary) 50%,
        color-mix(in srgb, var(--primary) 55%, transparent) 62%,
        transparent 72%,
        transparent 100%
      )
      border-box;
}

@keyframes cv-border-spin {
  to {
    --cv-border-angle: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cv-download-btn {
    animation: none;
    border-color: color-mix(in srgb, var(--foreground) 15%, transparent);
    background: color-mix(in srgb, var(--foreground) 5%, transparent);
  }

  .cv-download-btn:hover {
    border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
  }
}
</style>
