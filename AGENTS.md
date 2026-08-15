# AGENTS.md — Canonical Project & AI Governance

This document is the **CANONICAL GROUND TRUTH** for any AI agent, coding assistant, or developer working on the `mrcego/me` (`cesargomez.dev`) repository.

---

## 1. 🚨 Git & Branching Invariant (MANDATORY CANON)

> **ABSOLUTE RULE**: **NEVER commit directly to `main`. NEVER push directly to `main`.**

1. **Branch-First Workflow**:
   - Every task, bugfix, feature, or design polish **MUST** start on a dedicated working branch created from `main`:
     - `feat/<feature-name>` (e.g., `feat/hero-telemetry`)
     - `fix/<issue-name>` (e.g., `fix/hero-icons`)
     - `refactor/<module-name>`
     - `chore/<task-name>`
2. **Pre-Push Validation**:
   - Always run before committing/pushing:
     ```bash
     pnpm format:check
     pnpm lint
     pnpm test
     ```
3. **Commit Standards**:
   - Conventional Commits enforced via Husky and Commitlint (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`).
   - Never use `--no-verify` or bypass pre-commit/pre-push hooks.
4. **Integration**:
   - Push the branch to `origin <branch-name>` and create a Pull Request or follow the established promotion workflow to merge into `main`.

---

## 2. Technical Stack & Architecture

- **Framework**: Nuxt 4 (compatibilityVersion 4) + Vue 3 `<script setup lang="ts">` + Nitro.
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite` + Vanilla CSS tokens in `app/assets/css/main.css`.
- **Motion**: `motion-v` (Motion Vue) with `:while-in-view`, `:initial`, and reduced-motion safety composable `useMotionConfig()`.
- **Icons**: `@nuxt/icon` with strict offline client bundling (`provider: 'none'`, `fallbackToApi: false`, `serverBundle: 'local'`).
  - **CRITICAL**: Every icon used anywhere in the codebase **MUST** be explicitly listed in `nuxt.config.ts` under `clientBundle.icons` and must exist in the `@iconify-json/*` packages (`solar`, `logos`, `simple-icons`, `lucide`).
- **Localization (i18n)**: `@nuxtjs/i18n` with canonical dictionary files in `i18n/locales/en.json` and `i18n/locales/es.json`. Both languages must remain in 100% key parity.
- **Deployment**: Static Site Generation (SSG) hosted on Netlify (`cesargomez.dev`) with strict Content Security Policy (CSP), sub-second load times, and 0 runtime API dependencies.

---

## 3. Product Positioning & Identity

- **Name**: César Gómez
- **Canonical Roles**: Senior Fullstack Engineer · Frontend Architect · Senior Vue/Nuxt Engineer (13+ years experience).
- **AI-Augmented Engineering**: Methodology and engineering leverage governed by strict human architectural oversight and quality gates — not a standalone unqualified title.
- **Design Metaphor**: _"The Modern IDE Sanctuary"_ — dark obsidian base, high-contrast typography, emerald/indigo neon accents, glass HUD cards, and interactive portfolio terminal (`/`).

---

## 4. Verification Checklist Before Hand-off

Every AI assistant must verify:

- [ ] Working branch is active (not `main`).
- [ ] `pnpm format:check` passes without errors.
- [ ] `pnpm lint` and `nuxt typecheck` pass with 0 warnings/errors.
- [ ] `pnpm test` (all 158+ Vitest specs) passes.
- [ ] Any newly added icon is verified in `clientBundle.icons`.
- [ ] No hardcoded user-facing strings; all texts localized in both `en.json` and `es.json`.
