# Image delivery — Nuxt Image / IPX

## Runtime behavior

This site is **SSG** (`nuxt generate`). `@nuxt/image` resolves `<NuxtImg>` at build time and emits optimized URLs under `/_ipx/`.

### URL shape

```
/_ipx/f_<format>&q_<quality>&fit_<fit>&s_<width>x<height>/<source-path>
```

Example (hero LCP portrait):

```
/_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg
```

Responsive `srcset` variants are generated from `sizes`, `width`/`height`, and `format` props on `<NuxtImg>`. The home page also preloads the LCP candidate in `app/app.vue` and re-injects matching `link rel=preload` during `scripts/inject-entry-css-link.mjs`.

### Defaults (`nuxt.config.ts`)

| Setting   | Value                                                       |
| --------- | ----------------------------------------------------------- |
| `quality` | 80 (component props may override, e.g. hero `quality="85"`) |
| `format`  | `['webp', 'avif', 'jpeg']`                                  |
| `screens` | 320 → 1536 breakpoints for `sizes` resolution               |

### Static fallbacks

Brand and non-IPX assets live under `/img/*` (avatars, OG art, logos). Testimonial avatars and case-study art use `<NuxtImg>` where transformation helps; favicons stay at site root.

## Cache headers (artifact deploy)

Headers ship in `.output/public/_headers` via `scripts/write-csp-headers.mjs` → `scripts/lib/csp.mjs`.

| Path       | `Cache-Control`                                        | Rationale                                     |
| ---------- | ------------------------------------------------------ | --------------------------------------------- |
| `/_ipx/*`  | `public, max-age=604800, stale-while-revalidate=86400` | Week cache + 1-day SWR for transformed images |
| `/img/*`   | same as `/_ipx/*`                                      | Source and raster brand assets                |
| `/_nuxt/*` | `public, max-age=31536000, immutable`                  | Hashed build chunks only                      |

Constants: `CACHE_CONTROL_IMAGES`, `CACHE_CONTROL_IMMUTABLE` in `scripts/lib/csp.mjs`.

> **Note:** `netlify.toml` `[[headers]]` are **not** applied on artifact deploy (`netlify deploy --no-build`). The generated `_headers` file is the source of truth.

## Post-deploy verification

1. **Response headers** — pick a live `/_ipx/...` URL from home HTML:

   ```bash
   curl -sI "https://cesargomez.dev/_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg" | grep -i cache-control
   ```

   Expect: `public, max-age=604800, stale-while-revalidate=86400`

2. **Format negotiation** — confirm `Content-Type` is `image/webp` (or `image/avif` when emitted).

3. **LCP preload** — view source on `/`; hero should have `rel=preload` `as=image` pointing at the `/_ipx/...` LCP URL.

4. **Playwright production smoke** — hashed `/_nuxt/*.js` immutable cache is asserted in `tests/e2e/production-smoke.spec.ts`. Extend manually for `/_ipx` if a regression is suspected.

5. **Lighthouse** — run `pnpm test:perf` against local SSG; check LCP element is the hero `/_ipx` image, not an unoptimized `/img/me.jpg` direct fetch.

## Local dev vs production

- **Dev (`pnpm dev`)**: IPX runs in the Nuxt dev server; cache headers differ from production.
- **Lab perf (`pnpm serve:ssg`)**: Serves `.output/public` with CSP from `_headers` but **does not** replicate Netlify cache headers on static files — use production curl checks above for cache validation.
