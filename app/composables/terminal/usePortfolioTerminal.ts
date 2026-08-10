/**
 * SSR-safe global state for the secret portfolio terminal.
 * Dialog mounts lazily on first unlock — never on initial hydration.
 */
export function usePortfolioTerminal() {
  const terminalOpen = useState('portfolio-terminal-open', () => false);
  const terminalMounted = useState('portfolio-terminal-mounted', () => false);

  function openTerminal() {
    terminalMounted.value = true;
    terminalOpen.value = true;
  }

  function closeTerminal() {
    terminalOpen.value = false;
  }

  return {
    terminalOpen,
    terminalMounted,
    openTerminal,
    closeTerminal,
  };
}
