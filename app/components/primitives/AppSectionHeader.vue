<script setup lang="ts">
interface Props {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  as?: 'h1' | 'h2' | 'h3';
  headingId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  title: undefined,
  highlight: undefined,
  description: undefined,
  align: 'left',
  as: 'h2',
  headingId: undefined,
});

const alignClasses: Record<NonNullable<Props['align']>, { container: string; desc: string }> = {
  left: {
    container: 'text-left items-start',
    desc: 'max-w-3xl',
  },
  center: {
    container: 'text-center items-center mx-auto',
    desc: 'max-w-2xl text-center',
  },
  right: {
    container: 'text-right items-end ml-auto',
    desc: 'max-w-3xl text-right',
  },
};
</script>

<template>
  <div
    class="app-section-header flex flex-col gap-3 sm:gap-4 mb-10 sm:mb-16"
    :class="alignClasses[props.align].container"
  >
    <!-- Eyebrow Tag / Label -->
    <div v-if="props.eyebrow || $slots.eyebrow" class="type-eyebrow">
      <slot name="eyebrow">{{ props.eyebrow }}</slot>
    </div>

    <!-- Main Title -->
    <component
      :is="props.as"
      :id="props.headingId"
      class="text-3xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight text-foreground text-balance"
    >
      <slot name="title">
        <template v-if="props.highlight && props.title">
          <template v-if="props.title.includes(props.highlight)">
            <span>{{ props.title.split(props.highlight)[0] }}</span>
            <span class="text-gradient text-gradient-primary inline-block">{{
              props.highlight
            }}</span>
            <span>{{ props.title.split(props.highlight)[1] }}</span>
          </template>
          <template v-else>
            <span class="block">{{ props.title }}</span>
            <span class="text-gradient text-gradient-primary block">{{ props.highlight }}</span>
          </template>
        </template>
        <template v-else>
          {{ props.title }}
        </template>
      </slot>
    </component>

    <!-- Description -->
    <p
      v-if="props.description || $slots.description"
      class="text-sm sm:text-base md:text-lg text-muted font-normal leading-relaxed"
      :class="alignClasses[props.align].desc"
    >
      <slot name="description">{{ props.description }}</slot>
    </p>

    <!-- Extra Slot (e.g. actions, tabs, filters) -->
    <div v-if="$slots.extra" class="mt-2">
      <slot name="extra" />
    </div>
  </div>
</template>
