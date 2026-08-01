# Reconciliation — visibility / engagement / security

## Completed in this pass

| Finding                                                  | Status          | Evidence                                              |
| -------------------------------------------------------- | --------------- | ----------------------------------------------------- |
| Case studies i18n key mismatch                           | Fixed           | Full EN/ES contract + `case-studies-i18n.spec.ts`     |
| Hero repetition / stuck name / photo order               | Fixed           | `HeroSection.vue` + `hero-conversion.spec.ts`         |
| Proof buried below fold                                  | Fixed           | Case studies immediately after hero                   |
| Contact gamified labels                                  | Fixed           | Conventional Name / Work email / Message labels       |
| Mobile contact friction                                  | Fixed           | Persistent navbar contact before theme                |
| Artifact redirects (`www`, legacy CV)                    | Fixed           | `public/_redirects`                                   |
| `llms.txt` keyword bloat / missing `ai.txt` in prod path | Fixed in source | Short evidence-led files; smoke asserts after deploy  |
| Supply-chain `netlify-cli@latest`                        | Fixed           | Pinned `netlify-cli` + `pnpm exec netlify`            |
| Over-broad Pages permissions on PRs                      | Fixed           | Job-scoped `pages: write` / `id-token: write`         |
| Form abuse surface                                       | Hardened        | maxlength + honeypot; spam filter = human ops         |
| Landing cannibalization AI vs craft                      | Improved        | Commercial vs methodology framing + proof links       |
| Home FAQ bloat                                           | Fixed           | Trimmed to 7 decision FAQs                            |
| RUM without delivery path                                | Wired           | Consent-gated GA4 via `NUXT_PUBLIC_GA_MEASUREMENT_ID` |
| LHCI route coverage                                      | Expanded        | Home EN/ES, Vue, case study, Cartagena                |
| 30-day distribution playbook                             | Documented      | `quality/DISTRIBUTION_30_DAY.md`                      |

## Verification snapshot

- lint / format / typecheck — pass
- coverage — ≥80% statements / ≥70% branches
- `generate:netlify` — 99 routes, 0 link checker warnings
- e2e — 36 passed (production smoke skipped without `PLAYWRIGHT_PROD_URL`)

## Remaining human ops

1. Merge + Netlify deploy; run production smoke with `PLAYWRIGHT_PROD_URL`.
2. Confirm live `sitemap_index.xml` 200 and `ai.txt` 200 (currently broken on prod until deploy).
3. GSC: resubmit sitemap + URL Inspection (`GSC_OPERATIONS.md`).
4. Set `NUXT_PUBLIC_GA_MEASUREMENT_ID` + consent UX if field RUM is desired (`RUM.md`).
5. GitHub Blog URL → `cesargomez.dev`; LinkedIn headline/Featured (`ENTITY_ALIGNMENT.md`, `DISTRIBUTION_30_DAY.md`).
6. Branch protection, token rotation, Namecheap MFA (`SECURITY_HARDENING.md`).
