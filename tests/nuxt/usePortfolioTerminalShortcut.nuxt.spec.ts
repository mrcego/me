import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { KONAMI_SEQUENCE } from '~/config/portfolioTerminal.config';
import { usePortfolioTerminal } from '~/composables/terminal/usePortfolioTerminal';
import { usePortfolioTerminalShortcut } from '~/composables/terminal/usePortfolioTerminalShortcut';

function press(key: string, code?: string) {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      code: code ?? key,
      bubbles: true,
      cancelable: true,
    }),
  );
}

async function mountShortcut() {
  let shortcut!: ReturnType<typeof usePortfolioTerminalShortcut>;
  let terminal!: ReturnType<typeof usePortfolioTerminal>;
  await mountSuspended(
    defineComponent({
      setup() {
        terminal = usePortfolioTerminal();
        shortcut = usePortfolioTerminalShortcut();
        return {};
      },
      template: '<div />',
    }),
  );
  return { shortcut, terminal };
}

describe('usePortfolioTerminalShortcut', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('arms on `/` and reveals keys only for correct Konami order', async () => {
    const { shortcut, terminal } = await mountShortcut();
    shortcut.resetGate();
    press('/');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('armed');
    expect(shortcut.revealedKeys.value).toHaveLength(0);

    press('ArrowUp');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('progress');
    expect(shortcut.revealedKeys.value.map((k) => k.label)).toEqual(['↑']);

    press('ArrowDown'); // wrong after first ↑
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('failed');
    expect(terminal.terminalOpen.value).toBe(false);
    expect(shortcut.revealedKeys.value.some((k) => k.kind === 'error')).toBe(true);
  });

  it('unlocks after exact sequence and opens terminal', async () => {
    const { shortcut, terminal } = await mountShortcut();
    vi.useFakeTimers();
    shortcut.resetGate();
    terminal.closeTerminal();
    terminal.terminalMounted.value = false;

    press('/');
    for (const key of KONAMI_SEQUENCE) {
      if (key === 'KeyB') press('b', 'KeyB');
      else if (key === 'KeyA') press('a', 'KeyA');
      else press(key);
    }
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('unlocked');
    vi.advanceTimersByTime(350);
    await nextTick();
    expect(terminal.terminalOpen.value).toBe(true);
    expect(terminal.terminalMounted.value).toBe(true);
  });

  it('ignores `/` inside editable fields', async () => {
    const { shortcut } = await mountShortcut();
    shortcut.resetGate();
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }),
    );
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('idle');
    input.remove();
  });

  it('ignores inputs while failed or unlocked', async () => {
    const { shortcut, terminal } = await mountShortcut();
    vi.useFakeTimers();
    terminal.closeTerminal();
    shortcut.resetGate();
    press('/');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('armed');
    press('x');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('failed');
    press('/');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('failed');
  });

  it('publishes a single gate status for arm, progress, reset, and Escape cancellation', async () => {
    const { shortcut } = await mountShortcut();
    shortcut.resetGate();

    press('/');
    await nextTick();
    expect(shortcut.announce.value).toMatch(
      /Flight path armed|Ruta de vuelo armada|terminal\.gate\.armed/,
    );

    press('ArrowUp');
    await nextTick();
    expect(shortcut.announce.value).toMatch(
      /Flight path 1 of 10|Ruta de vuelo 1 de 10|terminal\.gate\.progress/,
    );

    press('x');
    await nextTick();
    expect(shortcut.announce.value).toMatch(
      /Flight path reset|Ruta de vuelo reiniciada|terminal\.gate\.reset/,
    );

    shortcut.resetGate();
    press('/');
    press('Escape');
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('idle');
    expect(shortcut.announce.value).toBe('');
  });

  it('unlocks from logo long-press and opens the terminal', async () => {
    const { shortcut, terminal } = await mountShortcut();
    vi.useFakeTimers();
    shortcut.resetGate();
    terminal.closeTerminal();
    terminal.terminalMounted.value = false;

    shortcut.unlockFromLogoLongPress();
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('unlocked');
    expect(shortcut.announce.value).toMatch(
      /Terminal unlocked|Terminal desbloqueado|terminal\.gate\.unlocked/,
    );

    vi.advanceTimersByTime(350);
    await nextTick();
    expect(terminal.terminalOpen.value).toBe(true);
    expect(terminal.terminalMounted.value).toBe(true);
  });

  it('skips unlock delay when prefers-reduced-motion is set', async () => {
    const { shortcut, terminal } = await mountShortcut();
    vi.useFakeTimers();
    shortcut.resetGate();
    terminal.closeTerminal();
    terminal.terminalMounted.value = false;

    shortcut.unlockFromLogoLongPress({ preferReducedMotion: true });
    await nextTick();
    expect(shortcut.gatePhase.value).toBe('unlocked');
    vi.advanceTimersByTime(0);
    await nextTick();
    expect(terminal.terminalOpen.value).toBe(true);
  });

  it('does not re-arm logo unlock while terminal or gate is busy', async () => {
    const { shortcut, terminal } = await mountShortcut();
    vi.useFakeTimers();
    shortcut.resetGate();
    terminal.openTerminal();

    shortcut.unlockFromLogoLongPress();
    await nextTick();
    expect(shortcut.announce.value).toBe('');
  });
});
