# Entity alignment — canonical identity

## Canonical string

Use this positioning consistently across site, schema, and profiles:

> **César Gómez — Senior Vue/Nuxt · AI-Assisted Craft**

Supporting facts (not headline):

- Senior frontend / fullstack delivery · Vue 3, Nuxt 4, TypeScript, Node/Express
- Honest **AI-Assisted Craft** / Vibe Coding Cleanup — not an “AI Engineer” job title
- Based in Cartagena de Indias, Colombia · remote contract from **August 2026**
- Site: `https://cesargomez.dev/` (Person `@id`: `https://cesargomez.dev/#person`)

Source of truth in code: `app/config/seo.config.ts` (`SEO_IDENTITY`, `PERSON_KNOWS_ABOUT`).

## Platform checklist

| Platform               | Field                         | Target                                                                                         | Status                                       |
| ---------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Site home**          | `<title>`, H1, Person schema  | Canonical string + hire intent                                                                 | ✅ In branch                                 |
| **README**             | Title + intro                 | Matches canonical identity                                                                     | ✅ Updated                                   |
| **GitHub**             | Profile name + bio + Blog URL | `César Gómez` + Senior Vue/Nuxt · Blog → `https://cesargomez.dev/` (not `mrcego.github.io/me`) | ⬜ Human edit — see `DISTRIBUTION_30_DAY.md` |
| **LinkedIn**           | Headline + About + Featured   | Same identity; feature case studies; no “AI Engineer” headline                                 | ⬜ Human edit                                |
| **Twitter/X**          | `@codingwithcego` display     | Align with site OG title                                                                       | ⬜ Verify                                    |
| **Structured data**    | `jobTitle` / `knowsAbout`     | Landings reference `#person` only; no conflicting `@id`                                        | ✅ In branch                                 |
| **OG / Twitter cards** | `og:title`, image alt         | `SEO_IDENTITY.ogImageAlt` pattern                                                              | ✅ In branch                                 |
| **llms.txt / ai.txt**  | AI crawler guidance           | Forbid AI Engineer mislabel                                                                    | ✅ In branch                                 |

## Name spelling

| Context                               | Spelling                                      |
| ------------------------------------- | --------------------------------------------- |
| Legal / display (preferred)           | **César Gómez**                               |
| ASCII handles (GitHub `mrcego`, URLs) | Cesar Gomez acceptable where diacritics break |
| Schema `name`                         | `César Gómez` (`seo.config.ts`)               |

## hreflang & locale

- HTML: `en-US` / `es-ES` + `x-default` → English home
- `Person.url` always `https://cesargomez.dev/` — never a landing URL

## Verification

```bash
pnpm test:e2e          # local SSG canonical + hreflang
PLAYWRIGHT_PROD_URL=https://cesargomez.dev pnpm test:e2e tests/e2e/production-smoke.spec.ts
```

After deploy: Google URL Inspection on home — rich result test should show single Person entity without conflicting `jobTitle` on landings.
