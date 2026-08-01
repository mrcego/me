# Real User Monitoring (RUM)

Core Web Vitals collection via `useWebVitalsRum` (`app/composables/useWebVitalsRum.ts`), registered in `app/app.vue`.

## Metrics

Dynamic import of `web-vitals` reports CLS, INP, LCP, TTFB, and FCP.

## Google Analytics 4 (optional)

Set a measurement ID via either:

- `runtimeConfig.public.gaMeasurementId` in `nuxt.config.ts`, or
- env `NUXT_PUBLIC_GA_MEASUREMENT_ID` at build time.

GA loads **only when both** are true:

1. `gaMeasurementId` is non-empty, and
2. Visitor consent is `analytics-consent=granted` in `localStorage` or the `analytics-consent` cookie.

Without consent, metrics are not sent to GA. In development, payloads are logged with `console.debug`.

### Consent integration

Your cookie banner or preferences UI must set:

```js
localStorage.setItem('analytics-consent', 'granted');
// and/or
document.cookie = 'analytics-consent=granted; path=/; max-age=31536000; SameSite=Lax';
```

Until consent is granted, RUM still collects metrics locally in dev but does not load gtag.

## Lighthouse CI

Lab budgets live in `lighthouserc.cjs` and run in CI (soft-fail). Use LHCI for regressions; use RUM for field data when GA is enabled.
