# Portfolio Positioning and SEO Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate César Gómez’s positioning as a senior Vue/Nuxt and fullstack engineer while improving conversion, SEO, international targeting, honest structured data, and AI-search readiness.

**Architecture:** Keep the Nuxt 4 static-site architecture. Treat the shared SEO composables and route manifest as the canonical technical layer, i18n JSON as copy source of truth, and the existing component sections as focused presentation units. Preserve the active user changes in the working tree.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, TypeScript, @nuxtjs/i18n, @nuxtjs/seo, Vitest, Playwright, Netlify static deployment.

## Global Constraints

- Preserve all existing uncommitted changes; never use reset, checkout, or restore.
- Canonical identity: César Gómez — Senior Fullstack Engineer, Frontend Architect, and Senior Vue/Nuxt Engineer.
- AI is a delivery method, never César’s primary job title; do not emit AI Engineer, NLP Engineer, LLM Engineer, AI & NLP Expert, or AI Agentic Ecosystem Specialist on indexable surfaces.
- Use only verified claims already in the repository; do not invent metrics, employers, prices, clients, or credentials.
- Keep the current dark editorial visual system, keyboard access, reduced-motion support, static deployment, and SEO regression coverage.

---

### Task 1: Protect canonical entity and SEO metadata

**Files:**

- Modify: `app/composables/seo/usePortfolioSeo.ts`
- Modify: `app/config/seo.config.ts`
- Modify: `app/composables/ui/useBrandRoleRotator.ts`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`
- Test: `tests/unit/seo.spec.ts`
- Test: `tests/unit/seo.config.spec.ts`
- Test: `tests/nuxt/useBrandRoleRotator.nuxt.spec.ts`

- [ ] Write failing tests proving metadata is deterministic and excludes prohibited role labels.
- [ ] Implement a stable home title, Open Graph title, Twitter title, Person name, and concise localized descriptions.
- [ ] Keep role rotation purely visual and remove it from document metadata.
- [ ] Run the focused SEO and role-rotator tests.

### Task 2: Correct language targeting, routes, redirects, and agent-readable artifacts

**Files:**

- Modify: `nuxt.config.ts`
- Modify: `app/utils/seo.ts`
- Modify: `app/config/routes.manifest.ts`
- Modify: `public/_redirects`
- Modify: `public/robots.txt`
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`
- Modify: `public/ai.txt`
- Modify: `public/okf/index.md`
- Modify: `public/okf/person.md`
- Modify: `public/okf/services.md`
- Test: `tests/unit/routes.manifest.spec.ts`
- Test: `tests/unit/schema-sitemap-regressions.spec.ts`
- Test: `tests/e2e/production-smoke.spec.ts`

- [ ] Write failing tests for `en` and `es-CO` alternates and legacy AI route redirects.
- [ ] Implement locale consistency and 301 redirects from the obsolete AI Engineer URLs to AI-Assisted Craft.
- [ ] Remove obsolete AI Engineer URLs from indexable route, sitemap, navigation, schema, and agent-readable references.
- [ ] Update machine-readable descriptions and availability to the canonical identity and current availability.
- [ ] Run route, sitemap, schema, and smoke-focused tests.

### Task 3: Make structured data truthful and page-specific

**Files:**

- Modify: `app/composables/seo/usePortfolioSeo.ts`
- Modify: `app/composables/seo/useExpertiseLandingSeo.ts`
- Modify: `app/composables/seo/useCaseStudySeo.ts`
- Test: `tests/unit/seo.spec.ts`
- Test: `tests/unit/schema-sitemap-regressions.spec.ts`

- [ ] Write failing tests for visible-only schema data and valid case-study schema selectors.
- [ ] Remove employer misuse of `alumniOf`, unshown rates/offers, and invalid or decorative Speakable markup.
- [ ] Keep one canonical Person entity and useful WebSite, ProfilePage, BreadcrumbList, Article, and visible FAQ markup.
- [ ] Run focused schema tests.

### Task 4: Rebuild conversion hierarchy and concise, evidence-led copy

**Files:**

- Modify: `app/components/sections/HeroSection.vue`
- Modify: `app/components/sections/CapabilitiesSection.vue`
- Modify: `app/components/sections/CaseStudiesSection.vue`
- Modify: `app/components/sections/TechStackSection.vue`
- Modify: `app/components/sections/CertificationsSection.vue`
- Modify: `app/components/sections/SeoFaqSection.vue`
- Modify: `app/components/sections/ContactSection.vue`
- Modify: `app/components/layout/AppNavbar.vue`
- Modify: `app/components/layout/AvailabilityBanner.vue`
- Modify: `app/config/availability.config.ts`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`
- Test: `tests/e2e/hero-conversion.spec.ts`
- Test: `tests/e2e/sections.spec.ts`
- Test: `tests/e2e/interactive-a11y.spec.ts`
- Test: `tests/nuxt/useContactForm.nuxt.spec.ts`

- [ ] Write failing interaction and content assertions for the stable hero proposition, clear primary CTA, current availability, and qualified lead path.
- [ ] Make the home prioritize product proof and three core capabilities over buzzwords and long credential lists.
- [ ] Add accessible project-intent qualification to the contact form without adding unnecessary fields or third-party services.
- [ ] Ensure eyebrow labels do not create invalid heading order and primary touch controls are at least 44px.
- [ ] Run focused component, conversion, and accessibility tests.

### Task 5: Elevate landings, case studies, conversion instrumentation, and distribution docs

**Files:**

- Modify: `app/components/landings/ExpertiseLandingPage.vue`
- Modify: `app/components/landings/CaseStudyPage.vue`
- Modify: `app/composables/domain/useContactForm.ts`
- Modify: `app/composables/seo/useWebVitalsRum.ts`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`
- Create: `docs/go-to-market-90-days.md`
- Test: `tests/e2e/contact-form.spec.ts`
- Test: `tests/e2e/portfolio.spec.ts`

- [ ] Write failing tests for conversion event names and landing/case-study evidence structure.
- [ ] Rewrite role pages and the three case studies around situation, role, technical decisions, verified proof, and a relevant CTA.
- [ ] Add consent-safe tracking for case-study views, primary CTA clicks, CV downloads, and completed contact submissions.
- [ ] Write the ethical 90-day LinkedIn, GitHub, Stack Overflow, and Vue/Nuxt community distribution plan.
- [ ] Run focused conversion and content route tests.

### Task 6: Full static-site verification

**Files:**

- Modify only when verification identifies a regression in the files above.
- Test: `tests/unit/*.spec.ts`
- Test: `tests/nuxt/*.spec.ts`
- Test: `tests/e2e/*.spec.ts`

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm generate:netlify`.
- [ ] Run `pnpm test:e2e`.
- [ ] Run `pnpm test:perf` when the environment can execute it.
- [ ] Inspect generated home, English landing, Colombian Spanish landing, and case-study HTML for title, description, canonical, hreflang, robots, schema, and redirects.
- [ ] Report commands and real results; do not claim checks passed without output.
