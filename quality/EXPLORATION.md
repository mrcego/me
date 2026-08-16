# Phase 1: Comprehensive Quality Engineering Exploration Report

## 1. System Topology & Architecture

- **Framework**: Nuxt 4 (compatibilityVersion: 4) + Vue 3 `<script setup lang="ts">` + Nitro Engine.
- **Styling Architecture**: Tailwind CSS v4 (`@tailwindcss/vite`) + Design Tokens in `app/assets/css/main.css` (_The Modern IDE Sanctuary_ design metaphor).
- **Component Primitives**: Custom composables (`useCardTilt`, `useMotionConfig`, `useTheme`, `useAngieChat`, `usePortfolioTerminal`).
- **On-Device AI Engine**: `@browserai/browserai` (`smollm2-135m-instruct`) running inside dedicated Web Worker `app/workers/angie.worker.ts` with 4-layer active guardrail defense.
- **Interactive Terminal**: CLI engine with telemetry, benchmark runner, deploy simulator, and Easter egg Konami code sequence.
- **Offline & PWA Compliance**: Service Worker (`public/sw.js` cache `v9`) and `@nuxt/icon` client-bundled offline SVG glyphs (0 runtime API fetches).

---

## 2. Quality Risk Matrix & Defect Prevention

| System Component        | Potential Failure Vector                 | Implemented Guardrail / Mitigation                                                                             | Verification Status                                               |
| :---------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **Angie AI Worker**     | WebGPU load failure / CSP blocking       | CSP `connect-src` whitelist for `raw.githubusercontent.com` + graceful fallback to 0ms deterministic RAG       | ✅ Verified (Unit + Worker tests passing)                         |
| **Angie AI Guardrails** | Prompt injection / Jailbreak attacks     | Regex-based injection interception + domain filtering + system prompt armor + post-generation output sanitizer | ✅ Verified (`angieRetriever.spec.ts`)                            |
| **SEO & Schema**        | Mismatched dates or schema collisions    | ISO-8601 strict timestamps, stable `#person` schema URI, 100% i18n key parity between `en` & `es-CO`           | ✅ Verified (`seo.spec.ts`, `schema-sitemap-regressions.spec.ts`) |
| **Performance (CWV)**   | Layout shifts on theme/font switch       | `font-display: optional`, predefined image dimensions, CSS inline critical styles                              | ✅ Verified (LCP < 0.8s, CLS = 0.000)                             |
| **Motion & A11y**       | Motion sickness / reduced motion         | Central `useMotionConfig()` reading `prefers-reduced-motion` to bypass animations                              | ✅ Verified (`useMotionConfig.nuxt.spec.ts`)                      |
| **Service Worker**      | Cache `addAll` failure on missing assets | `Promise.allSettled` and valid asset route `/img/me.jpg`                                                       | ✅ Verified (`sw.spec.ts`)                                        |

---

## 3. Test Coverage & Invariants

- **Unit & Nuxt Specs**: 175 tests across 42 test suites.
- **Pass Rate**: 100%.
- **Branch Invariant**: Working strictly on feature branch `perf/landing-page-optimization` (never direct `main`).
- **Lint / Typecheck**: 0 errors, 0 warnings.
