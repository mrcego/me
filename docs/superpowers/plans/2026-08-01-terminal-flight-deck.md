# Spectral Flight Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the slash-to-Konami terminal sequence and dialog as an accessible, theme-adaptive Spectral Flight Deck.

**Architecture:** Keep `usePortfolioTerminalShortcut` as the single owner of keyboard state, timing, and localized announcements. Move the announcement live region to `app.vue`, leaving `KonamiSequenceGate` presentation-only. Use existing `--pt-*` and theme tokens with static CSS layers; terminal subcomponents retain their existing interaction contracts.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, TypeScript, motion-v, Tailwind 4, Vitest, Playwright.

## Global Constraints

- Preserve the existing `/` + Konami sequence, keyboard exclusions, and `4000 / 750 / 300 ms` timing constants.
- Keep the gate pointer-inert and `aria-hidden`; announce status only through an app-level polite live region.
- Add no assets, canvas/WebGL, eager chunks, polling, font requests, or new global listeners.
- Use theme-derived `color-mix()` tokens and preserve contrast in every theme, including light presets.
- Motion is transform/opacity only, capped by existing motion configuration; it is instantaneous for reduced motion and coarse/mobile input.
- Maintain native dialog, focus restoration, inert app root, Escape behavior, combobox semantics, and a 44 px close target.

---

### Task 1: Restore the gate’s accessible announcement channel

**Files:**

- Modify: `app/app.vue:13-20, 106-118`
- Modify: `app/components/terminal/KonamiSequenceGate.vue:8-14, 85-138`
- Test: `tests/e2e/portfolio-terminal.spec.ts`

**Interfaces:**

- Consumes: `gateAnnounce: Ref<string>` from `usePortfolioTerminalShortcut()`.
- Produces: an app-level `<div class="sr-only" aria-live="polite" aria-atomic="true">` that exposes the latest gate status.
- Removes: the `announce` prop and the live region nested in `.konami-gate[aria-hidden="true"]`.

- [ ] **Step 1: Write the failing accessibility regression**

```ts
await page.keyboard.press('/');
await expect(page.locator('.konami-gate[aria-hidden="true"] [aria-live]')).toHaveCount(0);
await expect(page.locator('[data-terminal-gate-announcement]')).toContainText(
  /Access gate|Puerta de acceso/i,
);
```

- [ ] **Step 2: Run the focused E2E test to verify it fails**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "announcement"`

Expected: FAIL because the live region remains inside the aria-hidden gate.

- [ ] **Step 3: Move the live region to `app.vue`**

```vue
<div data-terminal-gate-announcement class="sr-only" aria-live="polite" aria-atomic="true">
  {{ gateAnnounce }}
</div>
<LazyTerminalKonamiSequenceGate
  v-if="gatePhase !== 'idle'"
  :phase="gatePhase"
  :keys="revealedKeys"
  :progress="progressIndex"
  :total="sequenceLength"
/>
```

Delete `announce` from the gate props and delete its descendant live region.

- [ ] **Step 4: Re-run the focused E2E test**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "announcement"`

Expected: PASS.

### Task 2: Build the Flight Deck gate presentation

**Files:**

- Modify: `app/components/terminal/KonamiSequenceGate.vue:19-138`
- Modify: `app/assets/css/main.css:terminal and konami-gate rules`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`
- Test: `tests/e2e/portfolio-terminal.spec.ts`

**Interfaces:**

- Consumes: `phase`, `keys`, `progress`, and `total` props only.
- Produces: `.konami-gate__route`, `.konami-gate__tick`, and `.konami-keycap` visual hooks.

- [ ] **Step 1: Write the failing gate visual-state test**

```ts
await page.keyboard.press('/');
await expect(page.locator('.konami-gate__route')).toBeVisible();
await expect(page.locator('.konami-gate__ticks .konami-gate__tick')).toHaveCount(10);
await page.keyboard.press('ArrowUp');
await expect(page.locator('.konami-gate__tick--filled')).toHaveCount(1);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "route ticks"`

Expected: FAIL because the Flight Deck route hook does not exist.

- [ ] **Step 3: Implement the presentation and localized labels**

Add the route container and status text in `KonamiSequenceGate.vue`; preserve entered keycaps but remove the failure flame element. Update both locale files together for Flight Deck gate labels. Add tokenized CSS for a physical bezel, ten telemetry ticks, route-lost error treatment, and unlock handoff using only `opacity` and `transform`.

- [ ] **Step 4: Add reduced-motion styles**

```css
@media (prefers-reduced-motion: reduce) {
  .konami-gate__route,
  .konami-keycap,
  .konami-gate__tick {
    animation: none;
    transition-duration: 0.01ms;
  }
}
```

Also preserve the project’s coarse/mobile motion budget.

- [ ] **Step 5: Re-run the focused E2E test**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "route ticks"`

Expected: PASS.

### Task 3: Polish terminal shell and prompt as a flight console

**Files:**

- Modify: `app/components/PortfolioTerminal.vue:96-136`
- Modify: `app/components/terminal/TerminalPrompt.vue:76-138`
- Modify: `app/components/terminal/TerminalCommandIndex.vue`
- Modify: `app/assets/css/main.css:portfolio-terminal rules`
- Test: `tests/e2e/portfolio-terminal.spec.ts`

**Interfaces:**

- Consumes: existing terminal session props/events and `shellArmed`.
- Produces: visual-only flight-console classes without changing dialog or combobox APIs.

- [ ] **Step 1: Write the failing terminal chrome test**

```ts
await unlockTerminal(page);
await expect(page.locator('.portfolio-terminal__flight-frame')).toBeVisible();
await expect(page.locator('.portfolio-terminal__prompt-route')).toBeVisible();
await expect(page.locator('#portfolio-terminal-input')).toBeFocused();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "flight console"`

Expected: FAIL because the Flight Deck chrome hooks are absent.

- [ ] **Step 3: Add semantic visual hooks and scoped CSS**

Add a decorative `aria-hidden` flight-frame inside the terminal shell and a prompt-route decoration adjacent to the existing prompt prefix. Style a double-bezel shell, restrained vector/horizon accents, transcript-safe surfaces, and desktop telemetry command index. Keep the input label, combobox, listbox, close control, and transcript DOM contracts unchanged.

- [ ] **Step 4: Prevent modal scroll chaining**

```css
.portfolio-terminal__main {
  overscroll-behavior: contain;
}
```

- [ ] **Step 5: Re-run the focused E2E test**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts --grep "flight console"`

Expected: PASS.

### Task 4: Validate behavior, a11y, themes, and formatting

**Files:**

- Modify: `tests/nuxt/usePortfolioTerminalShortcut.nuxt.spec.ts`
- Modify: `tests/e2e/portfolio-terminal.spec.ts`

- [ ] **Step 1: Add shortcut behavior coverage**

Cover arm/progress/reset/unlock announcements, editable-target cancellation, Escape cancellation, and the unchanged unlock delay using the existing `press()` helper and fake timers.

- [ ] **Step 2: Run focused Nuxt tests**

Run: `pnpm vitest run tests/nuxt/usePortfolioTerminalShortcut.nuxt.spec.ts tests/nuxt/useTerminalDialog.nuxt.spec.ts`

Expected: PASS.

- [ ] **Step 3: Run focused terminal E2E tests**

Run: `pnpm playwright test tests/e2e/portfolio-terminal.spec.ts`

Expected: PASS in desktop and reduced-motion coverage.

- [ ] **Step 4: Run project checks**

Run: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm test`

Expected: every command exits 0.
