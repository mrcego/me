<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AngieAction } from '~/config/angie.knowledge';
import type { AngieCategory } from '~/composables/domain/useAngieChat';

const { locale } = useI18n();
const {
  isOpen,
  isTyping,
  messages,
  activeCategory,
  closeChat,
  clearTranscript,
  sendMessage,
  triggerAction,
} = useAngieChat();

const userInput = ref('');
const transcriptRef = ref<HTMLElement | null>(null);

const categories: Array<{ id: AngieCategory; labelKey: string }> = [
  { id: 'all', labelKey: 'angie.categories.all' },
  { id: 'recruiter', labelKey: 'angie.categories.recruiter' },
  { id: 'lead', labelKey: 'angie.categories.lead' },
  { id: 'founder', labelKey: 'angie.categories.founder' },
];

const categoryPrompts = computed(() => {
  const isEs = locale.value === 'es';
  switch (activeCategory.value) {
    case 'recruiter':
      return isEs
        ? [
            '¿Cuál es la disponibilidad actual de César?',
            '¿Qué modalidades de contrato maneja?',
            '¿Cuáles son sus certificaciones técnicas?',
          ]
        : [
            "What is César's current availability?",
            'What contract modalities does he accept?',
            'What are his verified certifications?',
          ];
    case 'lead':
      return isEs
        ? [
            'Cuéntame sobre la arquitectura en Vue 3 y Nuxt 4',
            '¿Cómo optimiza Core Web Vitals a 60 FPS?',
            '¿Cómo aplica Ingeniería Aumentada por IA?',
          ]
        : [
            'Tell me about his Vue 3 & Nuxt 4 architecture',
            'How does he optimize Core Web Vitals to 60 FPS?',
            'How does he apply AI-Augmented Engineering?',
          ];
    case 'founder':
      return isEs
        ? [
            'Háblame del caso de estudio de LingoQuesto',
            '¿Cómo ayudó a Colegium en su migración?',
            '¿Cómo coordinar una llamada de proyecto?',
          ]
        : [
            'Tell me about the LingoQuesto case study',
            'How did he help Colegium migrate 30+ modules?',
            'How do I schedule a project briefing?',
          ];
    case 'all':
    default:
      return isEs
        ? [
            '¿Quién es César Gómez?',
            '¿Cuál es su stack técnico principal?',
            '¿Cómo puedo descargar su CV?',
            '¿Cuáles son sus canales de contacto?',
          ]
        : [
            'Who is César Gómez?',
            'What is his core technical stack?',
            'How can I download his CV?',
            'What are his contact channels?',
          ];
  }
});

function handleSend(text?: string) {
  const query = text || userInput.value;
  if (!query?.trim()) return;
  sendMessage(query);
  userInput.value = '';
  scrollToBottom();
}

function scrollToBottom() {
  nextTick(() => {
    if (transcriptRef.value) {
      transcriptRef.value.scrollTo({
        top: transcriptRef.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
}

function onActionClick(action: AngieAction, event: MouseEvent) {
  triggerAction(action, event);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeChat();
  }
}

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  },
);

watch(isOpen, (open) => {
  if (open) {
    scrollToBottom();
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="angie-window fixed bottom-20 right-4 sm:bottom-24 sm:right-6 md:bottom-26 md:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[26rem] md:w-[28rem] h-[34rem] max-h-[calc(100svh-7rem)] glass rounded-3xl border border-primary/25 shadow-4xl flex flex-col overflow-hidden text-foreground"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('angie.header.title')"
        @keydown="onKeydown"
      >
        <!-- CRT scanline aura overlay -->
        <div
          class="angie-window__scanlines absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />

        <!-- Header -->
        <header
          class="p-4 sm:p-5 border-b border-foreground/10 bg-secondary/80 backdrop-blur-md flex items-center justify-between relative z-10"
        >
          <div class="flex items-center gap-3">
            <div
              class="relative flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/30 text-primary"
            >
              <Icon name="solar:stars-minimalistic-bold-duotone" class="size-5" />
              <span
                class="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 animate-pulse border border-background"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-mono text-xs font-black tracking-wider uppercase text-foreground">
                  {{ $t('angie.header.title') }}
                </h3>
                <span
                  class="font-mono text-[9px] px-1.5 py-0.2 rounded bg-primary/15 text-primary font-bold"
                >
                  {{ $t('angie.header.badge') }}
                </span>
              </div>
              <p class="font-mono text-[10px] text-muted flex items-center gap-1.5">
                <span class="size-1.5 rounded-full bg-emerald-400" />
                {{ $t('angie.header.status') }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              type="button"
              class="p-2 text-muted hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
              :title="$t('angie.clearTranscript')"
              :aria-label="$t('angie.clearTranscript')"
              @click="clearTranscript"
            >
              <Icon name="solar:restart-linear" class="size-4" />
            </button>
            <button
              type="button"
              class="p-2 text-muted hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
              :aria-label="$t('angie.close')"
              @click="closeChat"
            >
              <Icon name="lucide:x" class="size-4" />
            </button>
          </div>
        </header>

        <!-- Category Selector Tabs -->
        <div
          class="px-4 py-2 bg-foreground/3 border-b border-foreground/5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide relative z-10"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer whitespace-nowrap"
            :class="
              activeCategory === cat.id
                ? 'bg-primary text-primary-contrast shadow-sm shadow-primary/20'
                : 'text-muted hover:text-foreground bg-foreground/5'
            "
            @click="activeCategory = cat.id"
          >
            {{ $t(cat.labelKey) }}
          </button>
        </div>

        <!-- Chat Log Stream -->
        <div
          ref="transcriptRef"
          class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs sm:text-sm relative z-10 scrollbar-thin"
          role="log"
          aria-live="polite"
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex flex-col gap-1.5"
            :class="msg.role === 'user' ? 'items-end' : 'items-start'"
          >
            <span class="font-mono text-[10px] text-muted/60 uppercase tracking-widest px-1">
              {{ msg.role === 'user' ? $t('angie.roles.user') : $t('angie.roles.angie') }}
            </span>

            <div
              class="max-w-[88%] p-3 sm:p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap"
              :class="
                msg.role === 'user'
                  ? 'bg-primary/90 text-primary-contrast font-medium rounded-tr-xs shadow-md shadow-primary/10'
                  : 'bg-secondary/90 border border-foreground/10 text-foreground rounded-tl-xs shadow-md'
              "
            >
              {{ msg.text }}
              <span
                v-if="msg.isStreaming"
                class="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse align-middle"
              />
            </div>

            <!-- Action Badges for Angie messages -->
            <div
              v-if="msg.actions && msg.actions.length > 0 && !msg.isStreaming"
              class="flex flex-wrap gap-1.5 pt-1 max-w-[90%]"
            >
              <button
                v-for="action in msg.actions"
                :key="action.id"
                type="button"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-contrast border border-primary/30 transition-all duration-200 cursor-pointer active:scale-95"
                @click="onActionClick(action, $event)"
              >
                <span>{{ $t(action.labelKey) }}</span>
                <Icon name="solar:arrow-right-up-linear" class="size-3" />
              </button>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div
            v-if="isTyping && (!messages.length || !messages[messages.length - 1]?.isStreaming)"
            class="flex items-center gap-2 text-muted font-mono text-xs"
          >
            <span class="size-2 rounded-full bg-primary animate-ping" />
            <span>{{ $t('angie.thinking') }}</span>
          </div>
        </div>

        <!-- Quick Prompts Slider -->
        <div
          class="p-2.5 bg-foreground/2 border-t border-foreground/5 relative z-10 flex gap-1.5 overflow-x-auto scrollbar-hide"
        >
          <button
            v-for="prompt in categoryPrompts"
            :key="prompt"
            type="button"
            class="px-2.5 py-1 rounded-md bg-foreground/5 hover:bg-primary/15 hover:text-primary border border-foreground/5 font-mono text-[11px] text-muted transition-colors cursor-pointer whitespace-nowrap text-left"
            @click="handleSend(prompt)"
          >
            {{ prompt }}
          </button>
        </div>

        <!-- Input Box -->
        <form
          class="p-3 bg-secondary/90 border-t border-foreground/10 flex items-center gap-2 relative z-10"
          @submit.prevent="handleSend()"
        >
          <input
            v-model="userInput"
            type="text"
            :placeholder="$t('angie.inputPlaceholder')"
            :aria-label="$t('angie.inputPlaceholder')"
            class="flex-1 bg-foreground/5 border border-foreground/10 focus:border-primary/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            maxlength="200"
          />
          <button
            type="submit"
            :disabled="!userInput.trim() || isTyping"
            class="size-9 sm:size-10 rounded-xl bg-primary text-primary-contrast flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0"
            :aria-label="$t('angie.send')"
          >
            <Icon name="lucide:send" class="size-4" />
          </button>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.angie-window {
  isolation: isolate;
  background: color-mix(in srgb, var(--background) 92%, var(--secondary));
  box-shadow:
    0 16px 48px color-mix(in srgb, var(--background) 80%, transparent),
    0 0 24px color-mix(in srgb, var(--primary) 15%, transparent);
}

.angie-window__scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.015) 3px
  );
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--foreground) 15%, transparent);
  border-radius: 4px;
}
</style>
