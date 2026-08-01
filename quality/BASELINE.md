# Baseline — cesargomez.dev (updated 2026-08-01)

## Routes (canonical)

| Route                                                             | Notes                                |
| ----------------------------------------------------------------- | ------------------------------------ |
| `/`, `/es/`                                                       | Home                                 |
| `/vue-frontend-developer/`, `/es/desarrollador-vue/`              | Vue hire                             |
| `/ai-engineer/`, `/es/ingeniero-ia/`                              | Vibe Coding / AI-Assisted (URL kept) |
| `/nodejs-backend-developer/`, `/es/desarrollador-backend-nodejs/` | Node hire                            |
| `/case-studies/colegium/`, `/es/casos/colegium/`                  | Case study (new)                     |
| `/case-studies/lingoquesto/`, `/es/casos/lingoquesto/`            | Case study (new)                     |
| `/web-developer-cartagena/`, `/es/desarrollo-web-cartagena/`      | Local intent (new)                   |
| `/ai-assisted-craft/`, `/es/craft-asistido-ia/`                   | Methodology (new)                    |

## PSI canonical before (2026-08-01)

Report: [uyky82oqhc](https://pagespeed.web.dev/analysis/https-cesargomez-dev/uyky82oqhc) (Lighthouse 13.4.1). Field/CrUX: **No Data**.

| Form factor | Perf | A11y | BP  | SEO | FCP  | LCP  | TBT   | CLS |
| ----------- | ---- | ---- | --- | --- | ---- | ---- | ----- | --- |
| Mobile      | 97   | 100  | 100 | 100 | 2.0s | 2.3s | 20ms  | 0   |
| Desktop     | 98   | 100  | 100 | 100 | 0.5s | 0.5s | 110ms | 0   |

### Actionable insights addressed in `perf/pagespeed-actionable-annotations`

- Hero `sizes`/preload aligned to CSS display (~154px mobile → prefer 392w) — cuts image-delivery + LCP load-delay.
- `/_ipx/*` Cache-Control → immutable 1y; `/img/*` → 30d + SWR.
- Accessible names: CONTACT / Vibe Coding include visible text (Label in Name).
- Deferred navbar/about/tech/particles hydration; disabled card tilt on coarse pointers; Nuxt Icon CSS mode with `clientBundle.scan: false` (no Iconify SVG client payload).

### Documented residuals (not code-blocking)

- **Trusted Types / “CSP effective against XSS”** — site already ships hash CSP via `_headers`. Trusted Types would require a full Trusted Types policy + build pipeline; deferred as platform/policy work, not a portfolio SSG default.
- **Field CrUX No Data** — insufficient traffic; cannot invent field metrics.
- **SEO structured-data manual validator** — run externally; JSON-LD already emitted by `@nuxtjs/seo` where configured.
- **DOM size (~1.1k nodes)** — largely real portfolio content; only redundant wrappers removed when found. Residual accepted.
- **Lab variance** — local LH 12.x can score lower than PSI 13.x; treat PSI UI + production smoke as release check.

## Acceptance budgets

| Metric                    | Target                                             |
| ------------------------- | -------------------------------------------------- |
| LCP p75                   | ≤ 2.5s                                             |
| INP p75                   | ≤ 200ms                                            |
| CLS p75                   | ≤ 0.1                                              |
| Mobile glass blur (cards) | ≤ 8px                                              |
| Artifact `_headers`       | CSP + immutable `/_nuxt` + `/_ipx` + HTML no-cache |
| Lab Perf (PSI)            | ≥ 90 mobile & desktop                              |

## Measurement stack

- Google Search Console (coverage, sitemap, queries)
- GA4 + Consent Mode (when wired)
- `web-vitals` RUM (when wired)
- Playwright production smoke + Lighthouse CI
- PageSpeed Insights UI (authenticated / browser) when API quota is exhausted
