<script setup lang="ts">
import ScrollToTopButton from '~/components/ui/ScrollToTopButton.vue';
import AngieChatWindow from '~/components/angie/AngieChatWindow.vue';

const { isOpen, toggleChat } = useAngieChat();
</script>

<template>
  <div
    class="fixed bottom-[max(1rem,env(safe-area-inset-bottom,1rem))] right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 sm:gap-3 pointer-events-none"
  >
    <!-- Floating Scroll To Top Button -->
    <ScrollToTopButton />

    <!-- Angie AI Trigger FAB & Tooltip Container -->
    <div class="relative flex items-center group/angie-launcher pointer-events-auto">
      <!-- Tooltip on Hover / Focus -->
      <div
        v-if="!isOpen"
        class="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 translate-x-2 scale-95 group-hover/angie-launcher:opacity-100 group-hover/angie-launcher:translate-x-0 group-hover/angie-launcher:scale-100 group-focus-within/angie-launcher:opacity-100 group-focus-within/angie-launcher:translate-x-0 group-focus-within/angie-launcher:scale-100 transition-all duration-300 ease-out z-50 hidden sm:block"
        role="tooltip"
      >
        <div
          class="bg-secondary border border-primary/40 rounded-2xl p-3.5 shadow-2xl shadow-black/90 backdrop-blur-2xl w-64 sm:w-72 text-left relative"
        >
          <!-- Arrow caret pointing right towards the FAB -->
          <div
            class="absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 bg-secondary border-t border-r border-primary/40 rotate-45 pointer-events-none"
            aria-hidden="true"
          />

          <div class="relative z-10 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span
                  class="size-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400 shrink-0"
                />
                <span class="text-xs font-black tracking-tight text-foreground truncate">
                  {{ $t('angie.launcher.tooltipTitle') }}
                </span>
              </div>
              <span
                class="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/30 shrink-0"
              >
                AI RAG
              </span>
            </div>

            <p class="text-xs font-medium text-foreground/85 leading-relaxed">
              {{ $t('angie.launcher.tooltipText') }}
            </p>

            <div
              class="pt-1.5 flex items-center justify-between text-[10px] font-mono font-bold text-primary border-t border-foreground/10"
            >
              <span>{{ $t('angie.launcher.tooltipPrompt') }}</span>
              <Icon
                name="solar:chat-round-dots-bold-duotone"
                class="size-3.5 text-primary shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Angie AI Trigger FAB -->
      <button
        type="button"
        class="angie-fab group pointer-events-auto size-12 sm:size-13 md:size-14 glass rounded-2xl md:rounded-3xl flex items-center justify-center border border-primary/30 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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

        <!-- Angie Face Avatar / Close Icon -->
        <NuxtImg
          v-if="!isOpen"
          src="/img/angie-face.webp"
          alt="Angie AI"
          width="128"
          height="128"
          densities="x1 x2"
          loading="eager"
          class="size-8.5 sm:size-9.5 md:size-10 rounded-xl sm:rounded-2xl object-cover relative z-10 drop-shadow-md pointer-events-none transform-gpu"
        />
        <Icon
          v-else
          name="lucide:x"
          class="size-6 text-foreground relative z-10 transition-transform duration-300"
        />

        <!-- Mini online status badge -->
        <span
          class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 size-2 rounded-full bg-emerald-400 border border-background shadow-xs shadow-emerald-400 z-20 pointer-events-none"
          aria-hidden="true"
        />
      </button>
    </div>

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
  backface-visibility: hidden;
  transform: translateZ(0);
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

.angie-fab :deep(img) {
  image-rendering: -webkit-optimize-contrast;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
