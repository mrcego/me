# Spec audit — portfolio growth megaplan

Date: 2026-07-31

| Area          | Spec requirement                            | Implementation                                          | Regression                                                     |
| ------------- | ------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| Indexation    | Artifact cache + sitemap prerender          | `scripts/lib/csp.mjs`, routes.manifest, generate e2e    | `tests/unit/csp.spec.ts`, `generate-artifacts.spec.ts`         |
| Person schema | Single `@id`, landings reference only       | `app/utils/seo.ts`, portfolio/expertise SEO composables | `tests/unit/seo.spec.ts`, `schema-sitemap-regressions.spec.ts` |
| hreflang      | `en-US` / `es-ES` / `x-default`             | `buildHreflangAlternateLinks`                           | unit + production smoke                                        |
| Availability  | No SSG date freeze                          | `useAvailability` client reconcile                      | unit + nuxt specs                                              |
| Navigation    | Landings → localized home + hash with slash | `sectionNavigation.ts`                                  | unit + link checker 0 warnings                                 |
| Mobile menu   | Dialog, Escape, inert, focus restore        | `AppNavbar.vue`                                         | `interactions.spec.ts`                                         |
| Chat          | Removed from runtime                        | not mounted in `app.vue`                                | e2e absence assertion                                          |
| Case studies  | Colegium + LingoQuesto EN/ES                | pages + `CaseStudiesSection`                            | routes.manifest + smoke                                        |
| Local / craft | Cartagena + methodology pages               | pages + i18n + AI landing CTA                           | manifest                                                       |
| Perf gates    | RUM + LHCI budgets                          | `useWebVitalsRum`, `lighthouserc.cjs`, CI soft-fail     | CI workflow                                                    |
| Ops           | GSC / authority / entity                    | quality docs                                            | human actions listed in RELEASE_CHECKLIST                      |

## Exemptions

- Multi-model Quality Playbook Council of Three: deferred; Mode A artifacts present.
- Authenticated PageSpeed / GSC sync: requires César credentials.
- LinkedIn/GitHub bio edits: human-only checklist in `ENTITY_ALIGNMENT.md`.
- 90-day measurement: starts after production deploy of this branch.
