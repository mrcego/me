<script setup lang="ts">
import type { TerminalLine } from '~/composables/usePortfolioTerminalSession';

const props = defineProps<{
  lines: TerminalLine[];
}>();

const scrollerRef = ref<HTMLElement | null>(null);

watch(
  () => props.lines.length,
  async () => {
    await nextTick();
    const el = scrollerRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  },
);
</script>

<template>
  <div
    ref="scrollerRef"
    class="portfolio-terminal__transcript"
    role="log"
    aria-live="polite"
    aria-relevant="additions"
    aria-atomic="false"
  >
    <div
      v-for="line in lines"
      :key="line.id"
      class="portfolio-terminal__line"
      :class="`portfolio-terminal__line--${line.kind}`"
    >
      <span
        v-if="line.kind === 'input'"
        class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--glyph"
        aria-hidden="true"
        >❯</span
      >
      <span class="portfolio-terminal__line-text">{{ line.text }}</span>
    </div>
  </div>
</template>
