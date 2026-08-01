# Release checklist — post-deploy

Run after every production deploy to `https://cesargomez.dev`.

## 1. Build artifact parity

- [ ] CI green on merged commit (lint, typecheck, unit, e2e, artifact upload).
- [ ] Deploy job published `.output/public` from the same SHA (no manual drift).

## 2. Sitemap & indexation

- [ ] `GET https://cesargomez.dev/sitemap_index.xml` → **200** XML.
- [ ] Sitemap lists all canonical routes (home, 3 hire landings, 2 case studies, local, methodology × EN/ES).
- [ ] **GSC**: resubmit sitemap (`quality/GSC_OPERATIONS.md`).
- [ ] **URL Inspection**: home + any changed routes → Request indexing.

## 3. Production smoke (Playwright)

```bash
PLAYWRIGHT_PROD_URL=https://cesargomez.dev pnpm exec playwright test tests/e2e/production-smoke.spec.ts
```

Checks:

- HTTP 200 on core routes
- `rel=canonical` present
- `hreflang` `en-US` / `es-ES`
- `robots.txt` references sitemap
- `/_nuxt/*.js` returns `Cache-Control` with `max-age=31536000` and `immutable`

## 4. Cache & security headers

Spot-check with curl:

```bash
# HTML — no long-lived cache
curl -sI https://cesargomez.dev/ | grep -i cache-control

# Hashed JS — immutable
curl -sI "$(curl -s https://cesargomez.dev/ | grep -o '/_nuxt/[^"]*\.js' | head -1 | xargs -I{} echo https://cesargomez.dev{})" | grep -i cache-control

# IPX image — immutable 1y (see quality/IMAGE_DELIVERY.md)
curl -sI "https://cesargomez.dev/_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg" | grep -i cache-control
```

- [ ] CSP present on HTML responses (Netlify `_headers`).
- [ ] No regression to `max-age=0` on `/_nuxt/*` (see `quality/BASELINE.md`).

## 5. Content & positioning

- [ ] Live `<title>` shows **Senior Vue/Nuxt · AI-Assisted Craft** (not legacy “AI & NLP Expert”).
- [ ] Availability banner reflects real calendar (post–Aug 2026 messaging when applicable).
- [ ] Case study pages return 200 EN + ES.

## 6. Performance sampling

- [ ] `pnpm test:perf` locally on release tag (optional but recommended before major UI changes).
- [ ] Lighthouse CI artifact from GitHub Actions (soft-fail step) — review trends.
- [ ] Field data: GSC Core Web Vitals + GA4 when wired.

## 7. 90-day measurement window

Start clock on deploy date; review at **day 30 / 60 / 90**:

| Signal         | Tool                        | Target                                     |
| -------------- | --------------------------- | ------------------------------------------ |
| Indexed pages  | GSC Coverage                | 8+ canonical routes indexed                |
| Hire queries   | GSC Performance             | Impressions ↑ for Vue/Nuxt/Cartagena terms |
| CWV p75        | GSC + RUM                   | LCP ≤2.5s, CLS ≤0.1, INP ≤200ms            |
| Branded search | `site:cesargomez.dev`       | Home + landings appear                     |
| Conversions    | Form submissions / LinkedIn | Baseline established                       |

See `quality/GSC_OPERATIONS.md` for weekly CLI commands and `quality/BASELINE.md` for budgets.

## 8. Human ops (non-automated)

- [ ] LinkedIn / GitHub bios aligned (`quality/ENTITY_ALIGNMENT.md`).
- [ ] Authority distribution actions (`quality/AUTHORITY_DISTRIBUTION.md`).
- [ ] Update `SEO_EDITORIAL_DATES.lastModified` in `seo.config.ts` when profile content materially changes.
