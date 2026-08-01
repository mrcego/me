# EXPLORATION — cesargomez.dev (Quality Playbook v1.5.6)

Target: Nuxt 4 static portfolio on Netlify (`cesargomez.dev`).
Date: 2026-07-31. Mode A skill-direct bootstrap (no prior quality/ seeds).

## Domain

Personal hire-intent portfolio for César Gómez: bilingual EN/ES, SSG (`nuxt generate`),
expertise landings (Vue / AI-Assisted Craft / Node), case studies, Cartagena local page,
contact via Netlify Forms, SEO via `@nuxtjs/seo`, performance-sensitive cinematic UI.

## Architecture snapshot

- App dir: `app/` (Nuxt 4). Canonical i18n: `i18n/locales/{en,es}.json`.
- Deploy: GH Actions validates + uploads artifact; Netlify deploy `--no-build --dir=.output/public`.
- Security + cache headers generated into `_headers` by `scripts/write-csp-headers.mjs`
  (`scripts/lib/csp.mjs` → `buildNetlifyHeadersFile` / `buildCacheHeaderBlocks`).
- Indexable routes centralized in `app/config/routes.manifest.ts` (8 page families × EN/ES).

## Open exploration findings

### P0 — Indexation / production

1. **Artifact cache headers missing (in progress → Phase 1)**: historically `buildNetlifyHeadersFile`
   shipped CSP/HSTS only; production assets returned `max-age=0` despite `netlify.toml` immutable
   rules. **Fix direction:** emit cache policies into `.output/public/_headers` (implemented in Phase 1).
2. **Sitemap HTTP 500**: observed on live `/sitemap_index.xml` / `/sitemap.xml` during audit window.
   Live probe (2026-08-01) returned 200 with static XML; root cause class is artifact deploy without
   Nitro — `zeroRuntime` must prerender XML, and `_redirects` must not force `sitemap_index` to
   `/.netlify/functions|builders`. **Fix direction:** explicit sitemap prerender routes + redirect
   invariants (Phase 1). Still verify after next production deploy.
3. **Production HTML lag**: live site still showed pre-reframe “AI & NLP Expert” / inflated hero
   metrics while local branch had honesty + AI-Assisted Craft reframe — deploy parity risk.
   **Pending production deploy verification.**
4. **Google footprint**: `site:cesargomez.dev` returned no results at audit time — visibility crisis.

### P0/P1 — SEO correctness

5. **Person `@id` conflict**: home and landings redefine `https://cesargomez.dev/#person` with
   different `url` / `jobTitle`.
6. **hreflang inconsistency**: HTML uses `en`/`es`; sitemap uses `en-US`/`es-ES`.
7. **Dead SEO config / StructuredData stub**: consolidate entity publishing on home only.
8. **SSG date freeze (Phase 1)**: `useAvailability` must not freeze build-time `new Date()` in a
   dep-less computed — content `availableFrom` + client reconcile after mount.
9. **Home H1 = name**, not hire-intent role; title/role mismatch for queries like “Vue developer Colombia”.
10. **URL–copy tension**: `/ai-engineer/` kept by product decision; copy must not claim AI Engineer job title.

### P1 — Performance / CWV

11. **Large HTML / ~225KB inline CSS** from `inlineStyles` + `cssCodeSplit:false`.
12. **Glass blur cascade**: mobile computed backdrop often still ~40px despite override aiming ≤8px.
13. **Post-LCP hydration burst**: timed Lazy islands at 2.8–5.5s contend with INP.
14. **Canvas rAF**: HeroParticles continues on mobile; ParticlesBackground costly when enabled.
15. **content-visibility: auto** with generic intrinsic size → bad anchor geometry.

### P1 — UX / a11y / conversion

16. **Broken landing hash nav**: `scrollToSection` no-ops when section IDs absent on expertise routes.
17. **Mobile menu**: dialog role without name/focus trap/inert background.
18. **AppProtocolChat a11y**: unlabeled input, icon-only send, English-only, post-LCP cost.
19. **Mobile hero too tall**: CTA buried below portrait/tags/stats.
20. **ProjectsSection disabled** + placeholder Unsplash/`href="#"` — no proof rail (case-study pages
    added as partial replacement).
21. **Testimonials nested scroll**; footer density on phones.
22. **transition-all** and hard-coded red RGB break theme tokens / motion guidelines.

### Strengths to preserve

- Explicit prerender of indexable routes; trailing-slash discipline + NuxtLink append.
- LCP preload for hero image; deferred webfonts with metric fallbacks.
- Lazy hydration for below-fold sections; AI crawlers allowed in robots; rich `llms.txt`.
- Strong CSP hash pipeline for SSG inline scripts under `--no-build` deploys.

## Domain-risk analysis

| Risk                | Why it bites this system                                                  |
| ------------------- | ------------------------------------------------------------------------- |
| Deploy/config split | `netlify.toml` headers unused on artifact deploy → silent perf regression |
| Entity SEO          | Conflicting Person graphs confuse Knowledge Graph / rich results          |
| SSG time            | Availability/dateModified freeze wrong state for months                   |
| Cinematic UI        | Glass/canvas/motion compete with CWV on mobile recruiters                 |
| Thin proof          | Without case studies, landings are keyword shells → low CTR/trust         |
| Chat ornament       | Fake assistant UI harms a11y and trust without conversion value           |

## Structured patterns sampled

- Redirect/canonical chains (trailing slash)
- Artifact vs platform config dual-source
- Schema entity identity stability
- Hydration scheduling vs interaction
- Focus management for teleported/modals overlays
- i18n content drift (`app/locales` vs `i18n/locales`)
