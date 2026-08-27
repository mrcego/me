<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'muted' | 'accent' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md';
  icon?: string;
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'muted',
  size: 'md',
  icon: undefined,
  interactive: false,
});

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-2.5 py-0.5 text-[10px] sm:text-xs tracking-[0.15em] gap-1',
  md: 'px-3 py-1 text-xs tracking-[0.2em] gap-1.5',
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-primary bg-primary/10 border-primary/30 shadow-[0_0_12px_rgba(var(--primary-rgb,88,166,255),0.1)]',
  muted: 'text-muted bg-foreground/5 border-foreground/10',
  accent: 'text-accent bg-accent/10 border-accent/30',
  outline: 'text-foreground bg-transparent border-foreground/20',
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
};
</script>

<template>
  <span
    class="app-badge inline-flex items-center font-bold uppercase rounded-full border transition-all duration-200 select-none whitespace-nowrap"
    :class="[
      sizeClasses[props.size],
      variantClasses[props.variant],
      {
        'hover:border-primary hover:text-primary hover:scale-[1.03] cursor-pointer':
          props.interactive,
      },
    ]"
  >
    <Icon v-if="props.icon" :name="props.icon" class="size-3.5 shrink-0" />
    <slot />
  </span>
</template>
