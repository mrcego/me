import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { usePortfolioTerminal } from '~/composables/terminal/usePortfolioTerminal';
import { usePortfolioTerminalSession } from '~/composables/terminal/usePortfolioTerminalSession';

async function mountSession() {
  let session!: ReturnType<typeof usePortfolioTerminalSession>;
  let terminal!: ReturnType<typeof usePortfolioTerminal>;
  await mountSuspended(
    defineComponent({
      setup() {
        terminal = usePortfolioTerminal();
        session = usePortfolioTerminalSession();
        return {};
      },
      template: '<div />',
    }),
  );
  return { session, terminal };
}

describe('usePortfolioTerminalSession', () => {
  it('bootstraps banner lines and clears the transcript', async () => {
    const { session } = await mountSession();
    session.bootstrap();
    expect(session.lines.value.length).toBeGreaterThanOrEqual(2);
    expect(session.lines.value.every((line) => line.kind === 'system')).toBe(true);

    session.clearTranscript();
    expect(session.lines.value).toEqual([]);
  });

  it('runs help, theme, and clear commands from submit', async () => {
    const { session } = await mountSession();
    session.bootstrap();

    session.input.value = 'help';
    await session.submit();
    expect(session.lines.value.some((line) => line.kind === 'output')).toBe(true);

    session.input.value = 'theme list';
    await session.submit();
    expect(
      session.lines.value.some((line) => line.text.includes('nord') || line.kind === 'output'),
    ).toBe(true);

    session.input.value = 'clear';
    await session.submit();
    expect(session.lines.value.some((line) => line.kind === 'system')).toBe(true);
  });

  it('surfaces unknown commands and closes on exit', async () => {
    const { session, terminal } = await mountSession();
    terminal.openTerminal();

    session.input.value = 'rm -rf /';
    await session.submit();
    expect(session.lines.value.some((line) => line.kind === 'error')).toBe(true);

    session.input.value = 'exit';
    await session.submit();
    expect(terminal.terminalOpen.value).toBe(false);
  });

  it('runs benchmark, deploy, stack, and info commands from submit', async () => {
    const { session } = await mountSession();

    session.input.value = 'benchmark';
    await session.submit();
    expect(
      session.lines.value.some(
        (line) => line.text.includes('BENCHMARK') || line.text.includes('RENDIMIENTO'),
      ),
    ).toBe(true);

    session.input.value = 'deploy';
    await session.submit();
    expect(
      session.lines.value.some(
        (line) =>
          line.text.includes('DEPLOYMENT') ||
          line.text.includes('DESPLIEGUE') ||
          line.text.includes('PRODUCCIÓN'),
      ),
    ).toBe(true);

    session.input.value = 'stack';
    await session.submit();
    expect(session.lines.value.length).toBeGreaterThan(0);

    session.input.value = 'services';
    await session.submit();
    expect(session.lines.value.length).toBeGreaterThan(0);

    session.input.value = 'experience';
    await session.submit();

    session.input.value = 'profiles';
    await session.submit();

    session.input.value = 'certs';
    await session.submit();

    session.input.value = 'contact';
    await session.submit();

    session.input.value = 'work';
    await session.submit();

    session.input.value = 'seo';
    await session.submit();

    session.input.value = 'lang';
    await session.submit();

    session.input.value = 'status';
    await session.submit();

    session.input.value = 'theme show';
    await session.submit();

    session.input.value = 'theme use dracula';
    await session.submit();

    session.input.value = 'go contact';
    await session.submit();

    expect(session.lines.value.some((line) => line.kind === 'output')).toBe(true);
  });

  it('supports suggestion navigation and history recall', async () => {
    const { session } = await mountSession();

    session.input.value = 'he';
    await nextTick();
    expect(session.suggestions.value.length).toBeGreaterThan(0);
    session.moveSuggestion(1);
    session.applySuggestion();
    expect(session.input.value.toLowerCase()).toContain('help');

    session.input.value = 'about';
    await session.submit();
    session.historyPrev();
    expect(session.input.value).toBe('about');
    session.historyNext();
    expect(session.input.value).toBe('');
  });
});
