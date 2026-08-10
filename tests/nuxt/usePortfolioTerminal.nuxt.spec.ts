import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { usePortfolioTerminal } from '~/composables/terminal/usePortfolioTerminal';

async function mountTerminalState() {
  let api!: ReturnType<typeof usePortfolioTerminal>;
  await mountSuspended(
    defineComponent({
      setup() {
        api = usePortfolioTerminal();
        return {};
      },
      template: '<div />',
    }),
  );
  return api;
}

describe('usePortfolioTerminal', () => {
  it('starts closed and unmounted', async () => {
    const api = await mountTerminalState();
    expect(api.terminalOpen.value).toBe(false);
    expect(api.terminalMounted.value).toBe(false);
  });

  it('mounts once on first open and can close without unmounting', async () => {
    const api = await mountTerminalState();
    api.openTerminal();
    expect(api.terminalMounted.value).toBe(true);
    expect(api.terminalOpen.value).toBe(true);
    api.closeTerminal();
    expect(api.terminalOpen.value).toBe(false);
    expect(api.terminalMounted.value).toBe(true);
    api.openTerminal();
    expect(api.terminalOpen.value).toBe(true);
    expect(api.terminalMounted.value).toBe(true);
  });
});
