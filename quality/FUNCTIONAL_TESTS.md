# Functional tests map

| REQ                       | Coverage                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| REQ-IDX-005               | `tests/unit/csp.spec.ts`, `tests/e2e/generate-artifacts.spec.ts`          |
| REQ-SEO-001/002           | `tests/unit/seo.spec.ts`, composables using `buildHreflangAlternateLinks` |
| REQ-SEO-004               | `tests/nuxt/useAvailability.nuxt.spec.ts`                                 |
| REQ-SEO-006               | `tests/unit/routes.manifest.spec.ts`                                      |
| REQ-A11Y-003              | `tests/e2e/interactions.spec.ts` (chat not mounted)                       |
| REQ-PERF / deploy smoke   | `tests/e2e/production-smoke.spec.ts` (opt-in via `PLAYWRIGHT_PROD_URL`)   |
| Trailing slash / landings | `tests/e2e/portfolio.spec.ts`                                             |

Pending expansion: keyboard focus-trap assertions, schema parity crawl, Lighthouse CI budgets.
