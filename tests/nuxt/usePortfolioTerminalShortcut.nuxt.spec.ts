import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { KONAMI_SEQUENCE } from '~/config/portfolioTerminal.config';
import { usePortfolioTerminal } from '~/composables/usePortfolioTerminal';
import { usePortfolioTerminalShortcut } from '~/composables/usePortfolioTerminalShortcut';

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
    vi.useFakeTimers();
    const { shortcut, terminal } = await mountShortcut();
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
    vi.useFakeTimers();
    const { shortcut, terminal } = await mountShortcut();
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
});
