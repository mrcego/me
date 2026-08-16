# Quality Playbook Bug Tracking & Resolution Matrix

## Resolved Defects & Mitigations

| Bug ID      | Component                        | Description                                                                                                     | Resolution & Test Verification                                                                                                                                                                   | Status   |
| :---------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **BUG-001** | `scripts/lib/csp.mjs`            | CSP `connect-src` blocked `raw.githubusercontent.com`, crashing WebGPU WASM download in `@browserai/browserai`. | Added `https://raw.githubusercontent.com` to CSP headers in `scripts/lib/csp.mjs`. Verified in `tests/unit/csp.spec.ts`.                                                                         | 🟢 FIXED |
| **BUG-002** | `public/sw.js`                   | Service Worker `addAll` threw uncaught promise rejection on non-existent `/_ipx/` route.                        | Replaced with valid asset `/img/me.jpg`, wrapped in `Promise.allSettled`, bumped cache to `cesar-gomez-portfolio-v9`. Verified in `tests/unit/sw.spec.ts`.                                       | 🟢 FIXED |
| **BUG-003** | `scripts/lib/entry-css-link.mjs` | Browser warning regarding same-origin CSS preload with `crossorigin` attribute.                                 | Removed `crossorigin` from stylesheet preload in `scripts/lib/entry-css-link.mjs`. Verified in `tests/unit/entry-css-link.spec.ts`.                                                              | 🟢 FIXED |
| **BUG-004** | `app/config/angie.knowledge.ts`  | Discrepancy in multi-framework representation (contained React/Next.js instead of canonical Angular v16+).      | Aligned knowledge base with true canonical identity: **Angular v16+, RxJS, Standalone Components, and Vue migration leadership**. Verified in `tests/unit/angieRetriever.spec.ts`.               | 🟢 FIXED |
| **BUG-005** | `app/workers/angie.worker.ts`    | Vulnerability to prompt injection and off-topic domain queries in AI Concierge.                                 | Added 4-layer active guardrails (`isPromptInjectionAttempt`, `isOutOfDomainQuery`, `buildSystemPrompt` armor, and `validateAndSanitizeOutput`). Verified in `tests/unit/angieRetriever.spec.ts`. | 🟢 FIXED |
| **BUG-006** | `app/config/angie.knowledge.ts`  | Vue 3 / Nuxt 4 authority needed higher prominence over general stack descriptions.                              | Added dedicated `vue_nuxt_mastery` high-authority knowledge node. Verified in `tests/unit/angieRetriever.spec.ts`.                                                                               | 🟢 FIXED |

---

## Current Defect Tally

- **Critical / Blocker**: 0
- **High**: 0
- **Medium**: 0
- **Low / Minor**: 0
- **Total Open Defects**: **0**
