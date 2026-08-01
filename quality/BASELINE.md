# Baseline — cesargomez.dev (2026-07-31)

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

## Production observations (audit)

- Homepage Content-Length ~424 KB; ~225 KB inline CSS.
- Live Cache-Control often `max-age=0` for hashed assets (artifact `_headers` lacked cache blocks).
- Sitemap endpoints returned HTTP 500 during audit window.
- Public PageSpeed API quota exhausted — use authenticated PSI / Lighthouse CI / WebPageTest.
- `site:cesargomez.dev` returned no Google results at audit time.

## Acceptance budgets (initial)

| Metric                    | Target                                   |
| ------------------------- | ---------------------------------------- |
| LCP p75                   | ≤ 2.5s                                   |
| INP p75                   | ≤ 200ms                                  |
| CLS p75                   | ≤ 0.1                                    |
| Mobile glass blur (cards) | ≤ 8px                                    |
| Artifact `_headers`       | CSP + immutable `/_nuxt` + HTML no-cache |

## Measurement stack

- Google Search Console (coverage, sitemap, queries)
- GA4 + Consent Mode (when wired)
- `web-vitals` RUM (when wired)
- Playwright production smoke + Lighthouse CI
