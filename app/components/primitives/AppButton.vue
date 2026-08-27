<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  to?: RouteLocationRaw;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  icon: undefined,
  iconPosition: 'left',
  to: undefined,
  href: undefined,
  target: undefined,
  rel: undefined,
  disabled: false,
  loading: false,
  ariaLabel: undefined,
  type: 'button',
});

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl sm:rounded-2xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'bg-primary text-primary-contrast font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]',
  secondary:
    'bg-secondary text-foreground border border-foreground/10 hover:border-primary/40 hover:text-primary active:scale-[0.98]',
  ghost:
    'bg-transparent text-foreground hover:bg-foreground/5 hover:text-primary active:scale-[0.98]',
  outline:
    'bg-transparent text-foreground border border-foreground/20 hover:border-primary hover:text-primary active:scale-[0.98]',
  premium:
    'btn-premium bg-linear-to-r from-primary/20 via-primary/10 to-accent/20 text-foreground border border-primary/30 hover:border-primary hover:shadow-[0_0_24px_rgba(var(--primary-rgb,88,166,255),0.25)]',
};
</script>

<template>
  <NuxtLink
    v-if="props.to && !props.disabled"
    :to="props.to"
    :target="props.target"
    :rel="props.rel"
    :aria-label="props.ariaLabel"
    class="app-button inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none whitespace-nowrap"
    :class="[sizeClasses[props.size], variantClasses[props.variant]]"
  >
    <Icon
      v-if="props.icon && props.iconPosition === 'left' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
    <Icon v-if="props.loading" name="solar:restart-linear" class="size-4.5 shrink-0 animate-spin" />
    <slot />
    <Icon
      v-if="props.icon && props.iconPosition === 'right' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
  </NuxtLink>

  <a
    v-else-if="props.href && !props.disabled"
    :href="props.href"
    :target="props.target"
    :rel="props.rel || (props.target === '_blank' ? 'noopener noreferrer' : undefined)"
    :aria-label="props.ariaLabel"
    class="app-button inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none whitespace-nowrap"
    :class="[sizeClasses[props.size], variantClasses[props.variant]]"
  >
    <Icon
      v-if="props.icon && props.iconPosition === 'left' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
    <Icon v-if="props.loading" name="solar:restart-linear" class="size-4.5 shrink-0 animate-spin" />
    <slot />
    <Icon
      v-if="props.icon && props.iconPosition === 'right' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
  </a>

  <button
    v-else
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-label="props.ariaLabel"
    class="app-button inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none whitespace-nowrap"
    :class="[
      sizeClasses[props.size],
      variantClasses[props.variant],
      props.disabled || props.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <Icon
      v-if="props.icon && props.iconPosition === 'left' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
    <Icon v-if="props.loading" name="solar:restart-linear" class="size-4.5 shrink-0 animate-spin" />
    <slot />
    <Icon
      v-if="props.icon && props.iconPosition === 'right' && !props.loading"
      :name="props.icon"
      class="size-4.5 shrink-0"
    />
  </button>
</template>
