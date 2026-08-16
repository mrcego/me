import type { GtagWindow } from '~/core/types/webVitals';

const ANALYTICS_CONSENT_KEY = 'analytics-consent';

function hasAnalyticsConsent(): boolean {
  if (!import.meta.client) return false;

  try {
    if (localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'denied') {
      return false;
    }
  } catch {
    // localStorage blocked
  }

  return true;
}

let gtagLoaded = false;

function loadGtag(measurementId: string): void {
  if (!import.meta.client) return;
  if (gtagLoaded || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    gtagLoaded = true;
    return;
  }

  gtagLoaded = true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag(..._args: unknown[]) {
      // GTAG/GTM engine requires the native `arguments` object, not an ES6 Array [...args]
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag('js', new Date());
    w.gtag('config', measurementId, { send_page_view: true });
  }

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/**
 * Lightweight Core Web Vitals RUM via dynamic import of `web-vitals`.
 * Sends to GA4 when `public.gaMeasurementId` is set and `analytics-consent=granted`.
 */
export function useWebVitalsRum() {
  if (!import.meta.client) return;

  const runtimeConfig = useRuntimeConfig();
  const measurementId = String(runtimeConfig.public.gaMeasurementId || '').trim();
  const consentGranted = hasAnalyticsConsent();

  onMounted(() => {
    if (measurementId && consentGranted) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadGtag(measurementId), { timeout: 3500 });
      } else {
        setTimeout(() => loadGtag(measurementId), 1500);
      }
    }

    const send = (metric: { name: string; value: number; id: string; rating?: string }) => {
      const payload = {
        name: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        id: metric.id,
        rating: metric.rating,
        path: window.location.pathname,
        ts: Date.now(),
      };

      const gtag = (window as GtagWindow).gtag;
      if (measurementId && consentGranted && typeof gtag === 'function') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: payload.value,
          metric_id: payload.id,
          metric_rating: payload.rating,
          page_path: payload.path,
          non_interaction: true,
        });
      } else if (import.meta.dev) {
        console.debug('[web-vitals]', payload);
      }
    };

    void import('web-vitals')
      .then((mod) => {
        mod.onCLS?.(send);
        mod.onINP?.(send);
        mod.onLCP?.(send);
        mod.onTTFB?.(send);
        mod.onFCP?.(send);
      })
      .catch(() => {
        // Package not installed — skip quietly.
      });
  });
}
