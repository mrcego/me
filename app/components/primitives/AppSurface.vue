<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  as?: string | Component;
  variant?: 'evidence' | 'narrative' | 'glass' | 'glass-lite' | 'utility';
  interactive?: boolean;
  glow?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'evidence',
  interactive: false,
  glow: false,
  rounded: '2xl',
});

const roundedClasses: Record<NonNullable<Props['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  evidence: 'surface-evidence',
  narrative: 'surface-narrative',
  glass: 'glass',
  'glass-lite': 'glass-lite',
  utility: 'surface-utility',
};
</script>

<template>
  <component
    :is="props.as"
    class="app-surface relative transition-all duration-300"
    :class="[
      variantClasses[props.variant],
      roundedClasses[props.rounded],
      {
        'hover:border-primary/40 hover:shadow-primary/10 hover:-translate-y-0.5 cursor-pointer':
          props.interactive,
        'ring-1 ring-primary/20 shadow-[0_0_24px_rgba(var(--primary-rgb,88,166,255),0.12)]':
          props.glow,
      },
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-surface {
  isolation: isolate;
}
</style>
