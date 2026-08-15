<script setup lang="ts">
import ScrollToTopButton from '~/components/ui/ScrollToTopButton.vue';
import AngieChatWindow from '~/components/angie/AngieChatWindow.vue';

const { isOpen, toggleChat } = useAngieChat();
</script>

<template>
  <div
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 sm:gap-3 pointer-events-none"
  >
    <!-- Floating Scroll To Top Button -->
    <ScrollToTopButton />

    <!-- Angie AI Trigger FAB -->
    <button
      type="button"
      class="angie-fab group pointer-events-auto size-12 sm:size-13 md:size-14 glass rounded-2xl md:rounded-3xl flex items-center justify-center border border-primary/30 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      :class="{ 'angie-fab--active': isOpen }"
      :aria-label="isOpen ? $t('angie.close') : $t('angie.launcher.aria')"
      :aria-expanded="isOpen"
      @click="toggleChat"
    >
      <!-- Radiant background glow & wave -->
      <span
        class="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors"
        aria-hidden="true"
      />
      <span
        v-if="!isOpen"
        class="absolute -inset-1 rounded-full border border-primary/40 animate-ping opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <!-- Icon -->
      <Icon
        v-if="!isOpen"
        name="solar:stars-minimalistic-bold-duotone"
        class="size-6 sm:size-6.5 text-primary relative z-10 transition-transform group-hover:rotate-12 duration-300"
      />
      <Icon
        v-else
        name="lucide:x"
        class="size-6 text-foreground relative z-10 transition-transform duration-300"
      />

      <!-- Mini online status badge -->
      <span
        class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 size-2 rounded-full bg-emerald-400 border border-background shadow-xs shadow-emerald-400 z-20"
        aria-hidden="true"
      />
    </button>

    <!-- Chat Window Modal -->
    <AngieChatWindow />
  </div>
</template>

<style scoped>
.angie-fab {
  isolation: isolate;
  background: color-mix(in srgb, var(--secondary) 90%, var(--background));
  box-shadow:
    0 8px 32px color-mix(in srgb, var(--background) 70%, transparent),
    0 0 20px color-mix(in srgb, var(--primary) 22%, transparent);
}

.angie-fab:hover {
  border-color: var(--primary);
  box-shadow:
    0 12px 36px color-mix(in srgb, var(--background) 80%, transparent),
    0 0 28px color-mix(in srgb, var(--primary) 40%, transparent);
}

.angie-fab--active {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 15%, var(--background));
}
</style>
