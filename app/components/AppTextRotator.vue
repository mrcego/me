<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: string[];
    intervalMs?: number;
    enabled?: boolean;
    containerClass?: string;
    trackClass?: string;
    lineClass?: string;
  }>(),
  {
    intervalMs: 3000,
    enabled: true,
    containerClass: '',
    trackClass: '',
    lineClass: '',
  },
);

const { activeIndex } = useTextRotator(() => props.items, {
  intervalMs: props.intervalMs,
  enabled: () => props.enabled,
});
</script>

<template>
  <span :class="['overflow-hidden relative', containerClass]" aria-live="polite">
    <span
      :class="[
        'flex flex-col h-full transition-transform duration-550 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
        trackClass,
      ]"
      :style="{ transform: `translate3d(0, -${activeIndex * 100}%, 0)` }"
    >
      <span
        v-for="(item, index) in items"
        :key="`${items.length}-${index}`"
        :class="['flex items-center h-full shrink-0 whitespace-nowrap truncate', lineClass]"
      >
        <slot :item="item" :index="index">{{ item }}</slot>
      </span>
    </span>
  </span>
</template>
