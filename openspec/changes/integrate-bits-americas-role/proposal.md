# Proposal: Integrate BITS Americas Frontend Architect Role & Experience

## Intent

César Gómez was selected as **Arquitecto de Soluciones Frontend Nivel II** at **BITS Americas S.A.S.** This change integrates this key career milestone across the portfolio, Angie AI knowledge engine, and bilingual localized timelines without prematurely altering contract-sensitive availability states.

## Scope

### In Scope

- **Career Timeline & Experience**: Add BITS Americas S.A.S. (Arquitecto de Soluciones Frontend Nivel II) to bilingual experience timelines in `i18n/locales/en.json` and `i18n/locales/es.json`.
- **Angie AI Knowledge Engine**: Add `company_bits_americas` entry and update `companies_experience` in `app/config/angie.knowledge.ts` to recognize queries regarding BITS Americas.
- **Unit & Retrieval Tests**: Add test coverage in `tests/unit/angieRetriever.spec.ts` and `tests/unit/case-studies-i18n.spec.ts`.

### Out of Scope

- Modifying `app/config/availability.config.ts` to `unavailable` before final contract signing (preserves current hiring funnel).
- Creating dedicated case study page (reserved for post-delivery project milestones).

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `portfolio-sanctuary`: Extend biography, experience timeline, and AI concierge knowledge to cover BITS Americas architecture role.

## Approach

1. Update `i18n/locales/en.json` and `i18n/locales/es.json` with strict 100% key parity for the BITS Americas experience item.
2. Add knowledge node `company_bits_americas` with English and Spanish queries, keywords, and action tags in `app/config/angie.knowledge.ts`.
3. Update `companies_experience` node to mention BITS Americas as recent enterprise engagement.
4. Validate with Vitest unit tests (`pnpm test:unit`), ESLint (`pnpm lint`), and typecheck (`pnpm typecheck`).

## Affected Areas

| Area                                             | Impact   | Description                                                        |
| ------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| `i18n/locales/en.json`                           | Modified | Add BITS Americas experience copy in English                       |
| `i18n/locales/es.json`                           | Modified | Add BITS Americas experience copy in Spanish                       |
| `app/config/angie.knowledge.ts`                  | Modified | Add `company_bits_americas` node and update `companies_experience` |
| `tests/unit/angieRetriever.spec.ts`              | Modified | Add retrieval assertion for BITS Americas queries                  |
| `openspec/changes/integrate-bits-americas-role/` | New      | SDD change management artifacts                                    |

## Risks

| Risk                                 | Likelihood | Mitigation                                                                           |
| ------------------------------------ | ---------- | ------------------------------------------------------------------------------------ |
| Premature availability status change | Low        | Keep `app/config/availability.config.ts` available until contract is signed          |
| i18n locale key drift                | Low        | Pre-commit validation and `tests/unit/locale-switch-scroll.spec.ts` guarantee parity |

## Rollback Plan

Revert the commit on branch `perf/quality-and-runtime-hardening` using `git revert` or restore previous locale files.

## Dependencies

- None

## Success Criteria

- [ ] BITS Americas role is displayed in the experience timeline in both EN and ES.
- [ ] Angie AI concierge accurately responds to "Tell me about his role at BITS Americas" in English and Spanish.
- [ ] 100% key parity between `en.json` and `es.json`.
- [ ] All Vitest unit tests pass with 0 errors.
