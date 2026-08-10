<script setup lang="ts">
interface Props {
  to?: string;
  href?: string;
  icon?: string;
  external?: boolean;
}

withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  icon: 'solar:arrow-right-linear',
  external: false,
});
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="inline-flex items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm group/cta"
  >
    <slot />
    <Icon
      :name="icon"
      class="size-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1"
    />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm group/cta"
  >
    <slot />
    <Icon
      :name="icon"
      class="size-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1"
    />
  </a>
</template>
