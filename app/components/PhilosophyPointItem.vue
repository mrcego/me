<script setup lang="ts">
export interface PhilosophyPoint {
  label: string;
  descKey: string;
  icon?: string;
  icons?: string[];
  to?: string;
  linkLabelKey?: string;
}

const props = defineProps<{
  point: PhilosophyPoint;
}>();

const localePath = useLocalePath();

const iconNames = computed(() =>
  props.point.icons?.length ? props.point.icons : props.point.icon ? [props.point.icon] : [],
);

const profileTo = computed(() => (props.point.to ? localePath(props.point.to) : null));
</script>

<template>
  <div class="philosophy-point">
    <div
      class="philosophy-point__icon glass"
      :class="{ 'philosophy-point__icon--multi': iconNames.length > 1 }"
    >
      <Icon
        v-for="icon in iconNames"
        :key="icon"
        :name="icon"
        class="philosophy-point__glyph"
        :class="{ 'philosophy-point__glyph--multi': iconNames.length > 1 }"
      />
    </div>

    <div class="philosophy-point__copy">
      <h3 class="philosophy-point__title type-overline text-foreground">
        {{ $t(point.label) }}
      </h3>
      <p class="philosophy-point__desc type-meta text-muted">
        {{ $t(point.descKey) }}
      </p>
      <NuxtLink
        v-if="profileTo && point.linkLabelKey"
        :to="profileTo"
        class="philosophy-point__link"
      >
        {{ $t(point.linkLabelKey) }}
        <Icon name="solar:arrow-right-linear" class="philosophy-point__link-icon" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.philosophy-point {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  column-gap: 0.75rem;
  width: 100%;
}

@media (min-width: 640px) {
  .philosophy-point {
    column-gap: 1rem;
  }
}

.philosophy-point__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.875rem; /* 46px — was 36px +10 */
  height: 2.875rem;
  border-radius: 0.5rem;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, #000 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
  transition: none;
}

@media (min-width: 640px) {
  .philosophy-point__icon {
    width: 3.125rem; /* 50px */
    height: 3.125rem;
    border-radius: 0.75rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__icon {
    width: 3.625rem; /* 58px */
    height: 3.625rem;
  }
}

.philosophy-point__icon--multi {
  gap: 0.125rem;
  padding-inline: 0.25rem;
}

.philosophy-point__glyph {
  width: 1.875rem; /* 30px */
  height: 1.875rem;
}

@media (min-width: 640px) {
  .philosophy-point__glyph {
    width: 2.125rem; /* 34px */
    height: 2.125rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__glyph {
    width: 2.375rem; /* 38px */
    height: 2.375rem;
  }
}

.philosophy-point__glyph--multi {
  width: 1.625rem; /* 26px */
  height: 1.625rem;
}

@media (min-width: 640px) {
  .philosophy-point__glyph--multi {
    width: 1.775rem; /* ~28px */
    height: 1.775rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__glyph--multi {
    width: 1.875rem; /* 30px */
    height: 1.875rem;
  }
}

.philosophy-point__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}

.philosophy-point__title {
  margin: 0;
}

.philosophy-point__desc {
  margin: 0;
  padding-top: 0.125rem;
}

.philosophy-point__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
  width: fit-content;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary);
  transition:
    gap 0.25s ease,
    color 0.25s ease;
}

.philosophy-point__link:hover {
  gap: 0.55rem;
  color: var(--color-foreground);
}

.philosophy-point__link-icon {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
