<script setup lang="ts">
export interface PhilosophyPoint {
  label: string;
  descKey: string;
  icon?: string;
  icons?: string[];
}

const props = defineProps<{
  point: PhilosophyPoint;
}>();

const iconNames = computed(() =>
  props.point.icons?.length ? props.point.icons : props.point.icon ? [props.point.icon] : [],
);
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
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  color: var(--color-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, #000 28%, transparent);
  overflow: hidden;
  flex-shrink: 0;
  transition: none;
}

@media (min-width: 640px) {
  .philosophy-point__icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__icon {
    width: 3rem;
    height: 3rem;
  }
}

.philosophy-point__icon--multi {
  gap: 0.125rem;
  padding-inline: 0.25rem;
}

.philosophy-point__glyph {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 640px) {
  .philosophy-point__glyph {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__glyph {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.philosophy-point__glyph--multi {
  width: 1rem;
  height: 1rem;
}

@media (min-width: 640px) {
  .philosophy-point__glyph--multi {
    width: 1.15rem;
    height: 1.15rem;
  }
}

@media (min-width: 768px) {
  .philosophy-point__glyph--multi {
    width: 1.25rem;
    height: 1.25rem;
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
</style>
