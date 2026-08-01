# CSS delivery strategy

## Chosen stack

| Layer        | Setting                             | Role                                                                                                                                        |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| First paint  | `features.inlineStyles: true`       | Inlines global + route CSS into SSR HTML so first paint does not wait on a render-blocking `<link rel="stylesheet">`.                       |
| Bundle shape | `vite.build.cssCodeSplit: false`    | One discoverable stylesheet instead of per-route chunks found only after entry JS executes.                                                 |
| Discovery    | `scripts/inject-entry-css-link.mjs` | Injects `rel=preload as=style` for the single entry CSS bundle — early fetch without blocking render (inline styles still own first paint). |

Configured in `nuxt.config.ts`; post-generate injection runs in the `generate` / `generate:netlify` scripts.

## Why this won

### Problem observed (audit)

- Homepage **~225 KB inline CSS** and **~424 KB** HTML `Content-Length`.
- Lighthouse **Network Dependency Tree** flagged CSS discovered only after JS: with `cssCodeSplit: true`, tiny per-section CSS files loaded late in the critical chain (HTML → entry JS → CSS → more JS).

### Options compared

| Approach                                             | Pros                                                                 | Cons                                                                     | Verdict               |
| ---------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------- |
| **A. Default Vite split + external `<link>`**        | Smaller HTML, browser cache for CSS file                             | Render-blocking stylesheet; worse LCP on cold loads                      | Rejected              |
| **B. `cssCodeSplit: true` + no inline**              | Smaller initial HTML                                                 | CSS still behind JS execution; dependency tree penalty                   | Rejected              |
| **C. `inlineStyles` only**                           | Fast first paint                                                     | Large HTML; CSS not separately cacheable                                 | Partial — used with D |
| **D. C + `cssCodeSplit: false` + preload injection** | Fast first paint **and** CSS discoverable from HTML without blocking | Large HTML remains; duplicate CSS bytes (inline + file)                  | **Selected**          |
| **E. Critical CSS extraction (manual)**              | Theoretically smallest critical path                                 | High maintenance for Tailwind 4 + PrimeVue + motion; fragile on redesign | Deferred              |

### Trade-offs accepted

- **HTML weight** grows (~225 KB CSS inlined) in exchange for eliminating render-blocking CSS and JS→CSS discovery chains.
- The external CSS file is still emitted for hydration/module graph consistency; preload makes it warm before JS needs it.
- `build:manifest` hook strips non-entry CSS from lazy chunks to avoid duplicate preload noise.

## Verification

```bash
pnpm generate:netlify
# Confirm preload injection:
rg 'rel="preload".*as="style"' .output/public/index.html
# Lab perf:
pnpm test:perf
```

Lighthouse CI budgets (`lighthouserc.cjs`): mobile performance ≥0.7, LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms (INP proxy).

## When to revisit

- If HTML TTFB or CDN transfer cost dominates (e.g. repeat visitors with strong edge cache), measure whether shrinking inline CSS via route-level critical extraction beats current LCP.
- If Nuxt adds first-class non-blocking CSS discovery without duplicate bytes, re-benchmark against option D.
