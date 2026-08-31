<script setup lang="ts">
interface Props {
  name?: string;
  names?: string[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tilt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  names: undefined,
  size: 'md',
  tilt: false,
});

const iconList = computed(() => {
  if (props.names?.length) return props.names;
  if (props.name) return [props.name];
  return [];
});
</script>

<template>
  <div
    class="app-icon-badge glass shrink-0 flex items-center justify-center text-primary shadow-xl"
    :class="[
      `app-icon-badge--${size}`,
      { 'app-icon-badge--tilt': tilt, 'app-icon-badge--multi': iconList.length > 1 },
    ]"
  >
    <Icon
      v-for="icon in iconList"
      :key="icon"
      :name="icon"
      class="app-icon-badge__glyph shrink-0"
      :class="{ 'app-icon-badge__glyph--multi': iconList.length > 1 }"
    />
  </div>
</template>

<style scoped>
.app-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, #000 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}

.app-icon-badge--sm {
  width: 2.75rem; /* 44px */
  height: 2.75rem;
  border-radius: 0.75rem;
}
.app-icon-badge--sm .app-icon-badge__glyph {
  width: 1.375rem; /* 22px */
  height: 1.375rem;
}

.app-icon-badge--md {
  width: 3.5rem; /* 56px */
  height: 3.5rem;
  border-radius: 1rem;
}

@media (min-width: 640px) {
  .app-icon-badge--md {
    width: 4rem; /* 64px */
    height: 4rem;
    border-radius: 1.125rem;
  }
}

.app-icon-badge--md .app-icon-badge__glyph {
  width: 2.25rem; /* 36px */
  height: 2.25rem;
}

@media (min-width: 640px) {
  .app-icon-badge--md .app-icon-badge__glyph {
    width: 2.625rem; /* 42px */
    height: 2.625rem;
  }
}

.app-icon-badge--lg {
  width: 4rem; /* 64px */
  height: 4rem;
  border-radius: 1rem;
}

@media (min-width: 640px) {
  .app-icon-badge--lg {
    width: 4.75rem; /* 76px */
    height: 4.75rem;
    border-radius: 1.25rem;
  }
}

@media (min-width: 768px) {
  .app-icon-badge--lg {
    width: 5.5rem; /* 88px */
    height: 5.5rem;
  }
}

.app-icon-badge--lg .app-icon-badge__glyph {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
}

@media (min-width: 640px) {
  .app-icon-badge--lg .app-icon-badge__glyph {
    width: 3rem; /* 48px */
    height: 3rem;
  }
}

@media (min-width: 768px) {
  .app-icon-badge--lg .app-icon-badge__glyph {
    width: 3.5rem; /* 56px */
    height: 3.5rem;
  }
}

.app-icon-badge--xl {
  width: 4.5rem; /* 72px */
  height: 4.5rem;
  border-radius: 1.25rem;
}

@media (min-width: 640px) {
  .app-icon-badge--xl {
    width: 5.5rem; /* 88px */
    height: 5.5rem;
    border-radius: 1.5rem;
  }
}

@media (min-width: 768px) {
  .app-icon-badge--xl {
    width: 6rem; /* 96px */
    height: 6rem;
  }
}

.app-icon-badge--xl .app-icon-badge__glyph {
  width: 3rem; /* 48px */
  height: 3rem;
}

@media (min-width: 640px) {
  .app-icon-badge--xl .app-icon-badge__glyph {
    width: 3.5rem; /* 56px */
    height: 3.5rem;
  }
}

@media (min-width: 768px) {
  .app-icon-badge--xl .app-icon-badge__glyph {
    width: 4rem; /* 64px */
    height: 4rem;
  }
}

.app-icon-badge--multi {
  gap: 0.25rem;
  padding-inline: 0.35rem;
}

.app-icon-badge__glyph--multi {
  width: 1.875rem !important;
  height: 1.875rem !important;
}
</style>
