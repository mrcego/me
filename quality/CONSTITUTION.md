# Quality Constitution — Architectural Invariants & Non-Negotiables

## 1. Governance & Git Flow

1. **Never commit directly to `main`**: All features, fixes, and refactors MUST originate from a dedicated branch (`feat/*`, `fix/*`, `perf/*`, `refactor/*`).
2. **Husky & Quality Gates**: `pnpm lint`, `pnpm format:check`, `nuxt typecheck` and `pnpm test:coverage` must pass before any push.
3. **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `perf:`, `chore:`, `test:`, `docs:`.

## 2. Technical Stack Invariants

1. **Nuxt 4 / Vue 3 Composition API**: Strict TypeScript `<script setup lang="ts">`.
2. **No Unbundled Icons**: All icons must exist in `@iconify-json/*` and be declared in `nuxt.config.ts` (`provider: 'none'`, `fallbackToApi: false`).
3. **Strict i18n Key Parity**: 100% parity between `i18n/locales/en.json` and `i18n/locales/es.json`.
4. **Zero Runtime API Dependency**: Static Site Generation (SSG) with client-side deterministic fallbacks.
5. **Accessible & Reduced Motion Compliant**: `useMotionConfig()` governs all UI motion.
