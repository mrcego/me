<script setup lang="ts">
import TerminalCommandIndex from '~/components/terminal/TerminalCommandIndex.vue';
import TerminalPrompt from '~/components/terminal/TerminalPrompt.vue';
import TerminalTranscript from '~/components/terminal/TerminalTranscript.vue';

const { terminalOpen, closeTerminal } = usePortfolioTerminal();
const { currentTheme } = useTheme();
const {
  lines,
  input,
  suggestions,
  activeSuggestion,
  submit,
  applySuggestion,
  moveSuggestion,
  historyPrev,
  historyNext,
  bootstrap,
} = usePortfolioTerminalSession();

const dialogRef = ref<HTMLDialogElement | null>(null);
const promptRef = ref<InstanceType<typeof TerminalPrompt> | null>(null);
const initialFocusRef = ref<HTMLElement | null>(null);
const shellArmed = ref(false);
let armedTimer: ReturnType<typeof setTimeout> | null = null;

const { onDialogCancel, onDialogClose } = useTerminalDialog({
  open: terminalOpen,
  dialogRef,
  initialFocusRef,
  onClose: closeTerminal,
});

watch(terminalOpen, async (open) => {
  if (!open) {
    shellArmed.value = false;
    if (armedTimer) {
      clearTimeout(armedTimer);
      armedTimer = null;
    }
    return;
  }
  bootstrap();
  // Phosphor bezel transfer from Konami unlock → shell edge.
  shellArmed.value = true;
  if (armedTimer) clearTimeout(armedTimer);
  armedTimer = setTimeout(() => {
    shellArmed.value = false;
    armedTimer = null;
  }, 600);

  await nextTick();
  initialFocusRef.value = promptRef.value?.el ?? null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    promptRef.value?.focus();
    initialFocusRef.value = promptRef.value?.el ?? null;
    await nextTick();
    if (document.activeElement === promptRef.value?.el) break;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  }
});

onScopeDispose(() => {
  if (armedTimer) clearTimeout(armedTimer);
});

function clearSuggestions() {
  suggestions.value = [];
  activeSuggestion.value = -1;
}

function onShellKeydown(event: KeyboardEvent) {
  event.stopPropagation();
  if (event.key !== 'Escape') return;
  if (suggestions.value.length) {
    event.preventDefault();
    clearSuggestions();
    return;
  }
  event.preventDefault();
  closeTerminal();
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="portfolio-terminal"
      aria-modal="true"
      :aria-label="$t('terminal.dialogLabel')"
      @cancel="onDialogCancel"
      @close="onDialogClose"
      @keydown="onShellKeydown"
    >
      <div
        class="portfolio-terminal__shell"
        :class="{ 'portfolio-terminal__shell--armed': shellArmed }"
      >
        <div class="portfolio-terminal__flight-frame" aria-hidden="true">
          <span class="portfolio-terminal__flight-horizon" />
          <span class="portfolio-terminal__flight-vector" />
          <span class="portfolio-terminal__flight-node portfolio-terminal__flight-node--west" />
          <span class="portfolio-terminal__flight-node portfolio-terminal__flight-node--east" />
        </div>
        <header class="portfolio-terminal__chrome">
          <div class="portfolio-terminal__traffic" aria-hidden="true"><span /><span /><span /></div>
          <p class="portfolio-terminal__title type-label">
            <span>{{ $t('terminal.title') }}</span>
            <span class="portfolio-terminal__host" aria-hidden="true">zsh</span>
          </p>
          <p class="portfolio-terminal__theme type-meta">
            {{ $t('terminal.themeIndicator', { name: currentTheme.name }) }}
          </p>
          <button
            type="button"
            class="portfolio-terminal__close"
            :aria-label="$t('terminal.close')"
            @click="closeTerminal"
          >
            <Icon name="lucide:x" class="size-4" />
          </button>
        </header>

        <div class="portfolio-terminal__body">
          <div class="portfolio-terminal__main">
            <TerminalTranscript :lines="lines" />
            <TerminalPrompt
              ref="promptRef"
              v-model="input"
              :suggestions="suggestions"
              :active-suggestion="activeSuggestion"
              @submit="submit"
              @apply-suggestion="applySuggestion"
              @move-suggestion="moveSuggestion"
              @history-prev="historyPrev"
              @history-next="historyNext"
            />
          </div>
          <TerminalCommandIndex class="hidden lg:flex" />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
