export function useAnalytics() {
  function trackEvent(eventName: string, params?: Record<string, unknown>) {
    if (!import.meta.client) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, params);
    }
  }

  return { trackEvent };
}
