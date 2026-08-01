import { useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';
import {
  KONAMI_ARM_TIMEOUT_MS,
  KONAMI_FAIL_RESET_MS,
  KONAMI_KEY_LABELS,
  KONAMI_SEQUENCE,
  KONAMI_UNLOCK_DELAY_MS,
  type KonamiKey,
} from '~/config/portfolioTerminal.config';

export type KonamiGatePhase = 'idle' | 'armed' | 'progress' | 'failed' | 'unlocked';

export interface KonamiRevealedKey {
  id: string;
  label: string;
  kind: 'ok' | 'error';
}

export interface PortfolioTerminalShortcutApi {
  gatePhase: Ref<KonamiGatePhase>;
  revealedKeys: Ref<KonamiRevealedKey[]>;
  progressIndex: Ref<number>;
  sequenceLength: number;
  announce: Ref<string>;
  resetGate: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.closest('[contenteditable="true"]')) return true;
  if (target.getAttribute('role') === 'textbox') return true;
  return Boolean(target.closest('input, textarea, select, [role="textbox"]'));
}

function hasOpenDialog(): boolean {
  if (!import.meta.client) return false;
  if (document.querySelector('dialog[open]')) return true;
  // PrimeVue modal mask is present only while a Dialog is visible.
  return Boolean(document.querySelector('.p-dialog-mask'));
}

function eventToKonamiKey(event: KeyboardEvent): KonamiKey | null {
  if (event.code === 'KeyB' || event.key.toLowerCase() === 'b') return 'KeyB';
  if (event.code === 'KeyA' || event.key.toLowerCase() === 'a') return 'KeyA';
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight'
  ) {
    return event.key;
  }
  return null;
}

/**
 * Global `/` + Konami unlock. Activate once from app.vue onMounted.
 * Exposes decorative gate state for KonamiSequenceGate.
 */
export function usePortfolioTerminalShortcut(): PortfolioTerminalShortcutApi {
  const { openTerminal, terminalOpen } = usePortfolioTerminal();
  const { t } = useI18n();

  const gatePhase = useState<KonamiGatePhase>('portfolio-terminal-gate-phase', () => 'idle');
  const revealedKeys = useState<KonamiRevealedKey[]>('portfolio-terminal-gate-keys', () => []);
  const progressIndex = useState('portfolio-terminal-gate-progress', () => 0);
  const announce = useState('portfolio-terminal-gate-announce', () => '');

  let armTimer: ReturnType<typeof setTimeout> | null = null;
  let settleTimer: ReturnType<typeof setTimeout> | null = null;
  let keySerial = 0;

  function clearTimers() {
    if (armTimer) {
      clearTimeout(armTimer);
      armTimer = null;
    }
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  function resetGate() {
    clearTimers();
    gatePhase.value = 'idle';
    revealedKeys.value = [];
    progressIndex.value = 0;
    announce.value = '';
  }

  function armSequence() {
    clearTimers();
    gatePhase.value = 'armed';
    revealedKeys.value = [];
    progressIndex.value = 0;
    announce.value = t('terminal.gate.armed');
    armTimer = setTimeout(() => {
      if (gatePhase.value === 'armed' || gatePhase.value === 'progress') {
        resetGate();
      }
    }, KONAMI_ARM_TIMEOUT_MS);
  }

  function failSequence(wrongLabel: string) {
    clearTimers();
    gatePhase.value = 'failed';
    revealedKeys.value = [
      ...revealedKeys.value,
      { id: `err-${++keySerial}`, label: wrongLabel, kind: 'error' },
    ];
    announce.value = t('terminal.gate.reset');
    settleTimer = setTimeout(() => {
      resetGate();
    }, KONAMI_FAIL_RESET_MS);
  }

  function unlockSequence() {
    clearTimers();
    gatePhase.value = 'unlocked';
    announce.value = t('terminal.gate.unlocked');
    settleTimer = setTimeout(() => {
      openTerminal();
      resetGate();
    }, KONAMI_UNLOCK_DELAY_MS);
  }

  function onGlobalKeydown(event: KeyboardEvent) {
    if (!import.meta.client) return;
    if (event.defaultPrevented) return;
    if (event.repeat) return;
    if (event.isComposing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    // Arm with `/` when idle (or re-arm from progress by restarting).
    if (event.key === '/') {
      if (isEditableTarget(event.target)) return;
      if (terminalOpen.value || hasOpenDialog()) return;
      if (gatePhase.value === 'failed' || gatePhase.value === 'unlocked') return;
      event.preventDefault();
      armSequence();
      return;
    }

    if (gatePhase.value !== 'armed' && gatePhase.value !== 'progress') return;

    if (isEditableTarget(event.target)) {
      resetGate();
      return;
    }
    if (terminalOpen.value || hasOpenDialog()) {
      resetGate();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      resetGate();
      return;
    }

    const expected = KONAMI_SEQUENCE[progressIndex.value];
    const actual = eventToKonamiKey(event);

    // Ignore pure modifier/function noise without consuming the event.
    if (!actual && event.key.length > 1 && !event.key.startsWith('Arrow')) {
      return;
    }

    // Capture-phase: stop navbar/theme handlers from consuming arrows/letters mid-sequence.
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!actual || actual !== expected) {
      const wrongLabel = actual
        ? KONAMI_KEY_LABELS[actual]
        : event.key.length === 1
          ? event.key.toUpperCase()
          : '×';
      failSequence(wrongLabel);
      return;
    }

    clearTimers();
    armTimer = setTimeout(() => {
      if (gatePhase.value === 'armed' || gatePhase.value === 'progress') {
        resetGate();
      }
    }, KONAMI_ARM_TIMEOUT_MS);

    revealedKeys.value = [
      ...revealedKeys.value,
      {
        id: `ok-${++keySerial}`,
        label: KONAMI_KEY_LABELS[actual],
        kind: 'ok',
      },
    ];
    progressIndex.value += 1;
    gatePhase.value = 'progress';
    announce.value = t('terminal.gate.progress', {
      current: progressIndex.value,
      total: KONAMI_SEQUENCE.length,
    });

    if (progressIndex.value >= KONAMI_SEQUENCE.length) {
      unlockSequence();
    }
  }

  if (import.meta.client) {
    useEventListener(window, 'keydown', onGlobalKeydown, { capture: true });
  }

  onScopeDispose(() => {
    clearTimers();
  });

  return {
    gatePhase,
    revealedKeys,
    progressIndex,
    sequenceLength: KONAMI_SEQUENCE.length,
    announce,
    resetGate,
  };
}
