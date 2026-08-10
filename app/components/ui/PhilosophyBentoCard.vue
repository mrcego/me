<script setup lang="ts">
export interface PhilosophyPoint {
  label: string;
  descKey: string;
  icon?: string;
  icons?: string[];
  to?: string;
  linkLabelKey?: string;
  accent?: 'emerald' | 'violet' | 'cyan' | 'red' | 'indigo' | 'amber';
  featured?: boolean;
}

const props = withDefaults(
  defineProps<{
    point: PhilosophyPoint;
    index?: number;
  }>(),
  {
    index: 0,
  },
);

const localePath = useLocalePath();

const iconNames = computed(() =>
  props.point.icons?.length ? props.point.icons : props.point.icon ? [props.point.icon] : [],
);

const profileTo = computed(() => (props.point.to ? localePath(props.point.to) : null));

const formattedIndex = computed(() => String(props.index + 1).padStart(2, '0'));

const accentStyle = computed(() => {
  switch (props.point.accent) {
    case 'emerald':
      return {
        card: 'hover:border-emerald-500/30 hover:shadow-emerald-500/10',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        iconBg: 'bg-emerald-500/10 text-emerald-400',
        glow: 'from-emerald-500/15 via-transparent to-transparent',
      };
    case 'violet':
      return {
        card: 'hover:border-violet-500/30 hover:shadow-violet-500/10',
        badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        iconBg: 'bg-violet-500/10 text-violet-400',
        glow: 'from-violet-500/15 via-transparent to-transparent',
      };
    case 'cyan':
      return {
        card: 'hover:border-cyan-500/30 hover:shadow-cyan-500/10',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        iconBg: 'bg-cyan-500/10 text-cyan-400',
        glow: 'from-cyan-500/15 via-transparent to-transparent',
      };
    case 'red':
      return {
        card: 'hover:border-rose-500/30 hover:shadow-rose-500/10',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        iconBg: 'bg-rose-500/10 text-rose-400',
        glow: 'from-rose-500/15 via-transparent to-transparent',
      };
    case 'indigo':
      return {
        card: 'hover:border-indigo-500/30 hover:shadow-indigo-500/10',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        iconBg: 'bg-indigo-500/10 text-indigo-400',
        glow: 'from-indigo-500/15 via-transparent to-transparent',
      };
    case 'amber':
    default:
      return {
        card: 'hover:border-amber-500/30 hover:shadow-amber-500/10',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        iconBg: 'bg-amber-500/10 text-amber-400',
        glow: 'from-amber-500/15 via-transparent to-transparent',
      };
  }
});
</script>

<template>
  <div
    class="bento-card group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-foreground/10 bg-background/60 p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 shadow-lg hover:shadow-2xl overflow-hidden w-full"
    :class="[accentStyle.card]"
  >
    <!-- Background Radial Glow -->
    <div
      class="absolute -top-12 -right-12 size-36 bg-linear-to-br rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :class="accentStyle.glow"
    />

    <div>
      <!-- Header Meta -->
      <div class="flex items-center justify-between gap-3 mb-4">
        <div
          class="flex items-center gap-2 rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border"
          :class="accentStyle.badge"
        >
          <span>Pillar {{ formattedIndex }}</span>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <div
            v-for="icon in iconNames"
            :key="icon"
            class="flex size-9 items-center justify-center rounded-xl border border-foreground/10 transition-transform group-hover:scale-110"
            :class="accentStyle.iconBg"
          >
            <Icon :name="icon" class="size-5 shrink-0" />
          </div>
        </div>
      </div>

      <!-- Title & Description -->
      <h3
        class="text-base sm:text-lg font-black tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors"
      >
        {{ $t(point.label) }}
      </h3>
      <p class="text-xs sm:text-sm font-medium text-muted leading-relaxed">
        {{ $t(point.descKey) }}
      </p>
    </div>

    <!-- Link CTA -->
    <div v-if="profileTo && point.linkLabelKey" class="mt-4 pt-3 border-t border-foreground/5">
      <NuxtLink
        :to="profileTo"
        class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md px-1 py-0.5"
      >
        <span>{{ $t(point.linkLabelKey) }}</span>
        <Icon
          name="solar:arrow-right-linear"
          class="size-3.5 shrink-0 transition-transform duration-300 group-hover/link:translate-x-1"
        />
      </NuxtLink>
    </div>
  </div>
</template>
