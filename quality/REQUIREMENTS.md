# REQUIREMENTS — cesargomez.dev

Derived from `quality/EXPLORATION.md`. Each REQ is testable.
Todo IDs map to the portfolio mega-plan Phase 1+ backlog.

## Indexation & deploy

| REQ-ID          | Todo / theme                | Requirement                                                                                                   |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **REQ-IDX-001** | indexing                    | All canonical routes return HTTP 200 with self-referencing canonical.                                         |
| **REQ-IDX-002** | indexing                    | Slashless counterparts return exactly one 301 to trailing-slash form.                                         |
| **REQ-IDX-003** | sitemap-production-recovery | `/robots.txt` allows crawl and references a working sitemap URL that returns 200 XML.                         |
| **REQ-IDX-004** | indexing / deploy           | Production HTML matches the validated artifact for titles/positioning (AI-Assisted Craft).                    |
| **REQ-IDX-005** | artifact-cache-headers      | Artifact `_headers` includes immutable cache for `/_nuxt/*`, `/_fonts/*`, `/_i18n/*` and revalidate for HTML. |
| **REQ-IDX-006** | route-manifest              | Prerender + sitemap URL lists come from `app/config/routes.manifest.ts` (8 page families).                    |

## SEO / schema / i18n

| REQ-ID          | Todo / theme           | Requirement                                                                                                            |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **REQ-SEO-001** | schema                 | Single Person entity `@id=https://cesargomez.dev/#person` with stable properties; landings reference it.               |
| **REQ-SEO-002** | indexing               | HTML hreflang uses `en-US` / `es-ES` + `x-default` EN; reciprocal pairs on every localized page.                       |
| **REQ-SEO-003** | schema                 | FAQ/WebPage schema only asserts content visible on the page.                                                           |
| **REQ-SEO-004** | time-safe-availability | Availability banner / date-driven UI is not frozen incorrectly by SSG build time (`availableFrom` + client reconcile). |
| **REQ-SEO-005** | schema                 | Editorial `dateModified` comes from a central reviewed config value.                                                   |
| **REQ-SEO-006** | route-manifest         | Hire-profile nav paths consume the same manifest without renaming `/ai-engineer/`.                                     |

## Performance / CWV

| REQ-ID           | Todo / theme | Requirement                                                                               |
| ---------------- | ------------ | ----------------------------------------------------------------------------------------- |
| **REQ-PERF-001** | CWV          | Mobile p75 LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (field when available; lab budgets in CI).  |
| **REQ-PERF-002** | CWV          | At ≤1023px, card glass backdrop blur computes ≤8px or none (except nav/modal).            |
| **REQ-PERF-003** | CWV          | No continuous canvas rAF on coarse/mobile after initial reveal.                           |
| **REQ-PERF-004** | CWV          | Non-critical islands hydrate on visible/idle; interaction at 3–5s remains <200ms blocked. |
| **REQ-PERF-005** | CWV          | Anchor navigation does not require forcing every section `content-visibility: visible`.   |

## Accessibility & conversion

| REQ-ID           | Todo / theme | Requirement                                                                               |
| ---------------- | ------------ | ----------------------------------------------------------------------------------------- |
| **REQ-A11Y-001** | a11y         | Mobile menu is a labeled dialog with focus trap, Escape, restore focus, inert background. |
| **REQ-A11Y-002** | a11y         | No unlabeled icon-only controls; form fields have labels/names.                           |
| **REQ-A11Y-003** | a11y / chat  | Decorative chat is not in the runtime critical path (removed or fully a11y-compliant).    |
| **REQ-A11Y-004** | conversion   | Section CTAs from landings navigate to localized home+hash and scroll correctly.          |
| **REQ-A11Y-005** | a11y         | `prefers-reduced-motion` disables continuous animation; no `transition: all`.             |

## Content / conversion

| REQ-ID          | Todo / theme | Requirement                                                                                                |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| **REQ-CNT-001** | conversion   | Home H1/title communicate hire-intent Senior Vue/Nuxt + honest AI-Assisted Craft.                          |
| **REQ-CNT-002** | conversion   | AI landing does not sell “AI Engineer” as job title; frames Vibe Coding Cleanup / quality gates.           |
| **REQ-CNT-003** | conversion   | Home includes real case-study proof (no Unsplash placeholders / `href="#"`).                               |
| **REQ-CNT-004** | indexing     | Bilingual case studies + Cartagena local page + AI craft methodology exist and are prerendered/sitemapped. |
| **REQ-CNT-005** | indexing     | `llms.txt` / `ai.txt` list canonical URLs and forbid AI Engineer mislabeling.                              |

## Verification

| REQ-ID         | Todo / theme                        | Requirement                                                                                             |
| -------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **REQ-QA-001** | artifact-cache-headers / tests      | CI fails if artifact `_headers` lacks cache rules or CSP hashes.                                        |
| **REQ-QA-002** | tests                               | E2E covers indexable routes, slash redirects, keyboard/modal, reduced motion, landings→home hashes.     |
| **REQ-QA-003** | sitemap-production-recovery / tests | Post-deploy smoke checks production status/headers/sitemap/meta; generate artifacts assert sitemap XML. |
