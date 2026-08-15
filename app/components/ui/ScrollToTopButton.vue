<script setup lang="ts">
import { computed } from 'vue';
import { useSmoothedScroll } from '~/composables/ui/useSmoothedScroll';

const { rawY } = useSmoothedScroll(0.14);
const showScrollTop = computed(() => rawY.value > 300);

function scrollToTop() {
  if (!import.meta.client) return;
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
</script>

<template>
  <button
    type="button"
    :aria-label="$t('chat.scrollToTop')"
    :aria-hidden="!showScrollTop"
    :tabindex="showScrollTop ? 0 : -1"
    class="scroll-top-btn glass rounded-2xl md:rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 relative group overflow-hidden transition-[opacity,transform,width,height,margin] duration-300 ease-out shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    :class="
      showScrollTop
        ? 'size-11 sm:size-12 md:size-13 opacity-100 scale-100 pointer-events-auto'
        : 'size-0 opacity-0 scale-75 pointer-events-none border-0 m-0 p-0'
    "
    @click="scrollToTop"
  >
    <span
      class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
      aria-hidden="true"
    />
    <svg
      class="size-5 md:size-6 relative z-10 text-primary transition-transform group-hover:-translate-y-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  </button>
</template>

<style scoped>
.scroll-top-btn {
  background: color-mix(in srgb, var(--secondary) 88%, var(--background));
  box-shadow: 0 4px 20px color-mix(in srgb, var(--primary) 12%, transparent);
}

.scroll-top-btn:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--primary) 28%, transparent);
}
</style>
