# Tasks: Integrate BITS Americas Solutions Architect Level II Role & Experience

## Review Workload Forecast

| Field                   | Value                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| Estimated changed lines | ~120 lines                                                        |
| 400-line budget risk    | Low                                                               |
| Chained PRs recommended | No                                                                |
| Suggested split         | Single PR / Working branch (`perf/quality-and-runtime-hardening`) |
| Delivery strategy       | single-pr (Integrated on active PR branch, ready for merge)       |
| Chain strategy          | feature-branch-chain                                              |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: feature-branch-chain
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal                                                  | Likely PR | Focused test command                    | Runtime harness | Rollback boundary |
| ---- | ----------------------------------------------------- | --------- | --------------------------------------- | --------------- | ----------------- |
| U1   | TDD Unit tests for BITS Americas knowledge retrieval  | PR 1      | `pnpm test:unit angieRetriever.spec.ts` | Vitest          | Revert test edits |
| U2   | Angie knowledge node & i18n dictionary implementation | PR 1      | `pnpm test:unit`                        | Nuxt / i18n     | Revert locales    |
| U3   | Experience card integration in About section          | PR 1      | `pnpm test`                             | Vue 3 / Nuxt    | Revert component  |
| U4   | Full quality validation & pre-deployment staging gate | PR 1      | `pnpm prepush:validate`                 | Full Suite      | Branch isolation  |

---

## Tasks

### Phase 1: Test Suite Preparation (Strict TDD RED)

- [x] 1.1 Add failing unit test in `tests/unit/angieRetriever.spec.ts` verifying semantic search matches `company_bits_americas` for BITS Americas queries in EN and ES.
- [x] 1.2 Add test assertion verifying `about.roles.bitsamericas` exists with 100% key parity across `en.json` and `es.json`.

### Phase 2: Angie Knowledge Base & Localization (GREEN)

- [x] 2.1 Add `company_bits_americas` knowledge entry to `app/config/angie.knowledge.ts` with keywords, title, summary, and action links.
- [x] 2.2 Update `companies_experience` knowledge entry in `app/config/angie.knowledge.ts` to include BITS Americas S.A.S.
- [x] 2.3 Add `about.roles.bitsamericas` to `i18n/locales/en.json` (title: "Frontend Solutions Architect Level II", company, years, desc, highlights).
- [x] 2.4 Add `about.roles.bitsamericas` to `i18n/locales/es.json` (title: "Arquitecto de Soluciones Frontend Nivel II", company, years, desc, highlights).

### Phase 3: Experience Cards & UI Presentation

- [x] 3.1 Prepend `bitsamericas` to `roles` array in `app/components/sections/AboutSection.vue`.
- [x] 3.2 Add `bitsamericas` configuration to `COMPANY_LOGOS` in `AboutSection.vue` with fallback badge styling.
- [x] 3.3 Verify `AvailabilityBanner.vue` and top announcement messaging stay aligned with hiring funnel.

### Phase 4: Quality Gate & Pre-Deployment Staging

- [x] 4.1 Run `pnpm format:check` and `pnpm lint`.
- [x] 4.2 Run `pnpm typecheck` and `pnpm test:coverage` (178/178 specs passing with 0 warnings).
- [x] 4.3 Commit and push all changes to active branch `perf/quality-and-runtime-hardening` (PR #28).
- [ ] 4.4 Hold final PR merge until user signals formal contract signature.
