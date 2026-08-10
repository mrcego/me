<script setup lang="ts">
import { Motion } from 'motion-v';

interface Props {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  titleEnd?: string;
  lead?: string;
  align?: 'center' | 'left';
}

withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  titleHighlight: undefined,
  titleEnd: undefined,
  lead: undefined,
  align: 'center',
});

const { motionInitial, motionInView, motionTransition } = useMotionConfig();
</script>

<template>
  <Motion
    :initial="motionInitial({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })"
    :while-in-view="motionInView({ opacity: 1, y: 0 })"
    :transition="motionTransition({ duration: 0.4 })"
    :viewport="{ once: true, amount: 0.1 }"
    class="space-y-5"
    :class="align === 'center' ? 'max-w-4xl mx-auto text-center' : 'max-w-3xl text-left'"
  >
    <div
      v-if="eyebrow"
      class="flex items-center gap-4"
      :class="align === 'center' ? 'justify-center' : 'justify-start'"
    >
      <div class="h-px w-10 bg-primary/40" />
      <h2 class="type-eyebrow tracking-[0.4em]">
        {{ eyebrow }}
      </h2>
      <div class="h-px w-10 bg-primary/40" />
    </div>

    <h3
      class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-foreground text-balance"
    >
      {{ title }}
      <template v-if="titleHighlight">
        <br v-if="align === 'center'" />
        <span class="text-gradient">{{ titleHighlight }}</span>
      </template>
      <template v-if="titleEnd"> {{ titleEnd }}</template>
    </h3>

    <p
      v-if="lead"
      class="text-muted text-base md:text-lg lg:text-xl font-medium leading-relaxed text-pretty max-w-3xl"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      {{ lead }}
    </p>
  </Motion>
</template>
