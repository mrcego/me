<script setup lang="ts">
import type { PhilosophyPoint } from '~/core/types/portfolio';

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
    <AppIconBadge :names="iconNames" size="md" />

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
