# Spectral Flight Deck — Terminal and Konami Gate

## Scope

Refresh the secret portfolio-terminal entry sequence and dialog chrome as a restrained, premium sci-fi **Spectral Flight Deck**. The experience remains a non-interactive visual overlay until the existing `/` + Konami sequence opens the terminal; command parsing, navigation, theme commands, shortcut exclusions, and timing constants remain intact.

The redesign covers:

- `KonamiSequenceGate` visual language, phase feedback, and announcement placement.
- The terminal dialog's shell, chrome, transcript, prompt, suggestions, and command index styling.
- Responsive, theme-aware CSS tokens for those surfaces.
- Copy changes required to describe the gate in English and Spanish.

## Visual direction

The Flight Deck should read as an instrument panel, not a game overlay: deep translucent surfaces, hairline vector routes, deliberate spacing, and the active theme's primary color as the sole spectral accent. Retain the current mono stack and rounded physical keycaps, but replace generic CRT/noise heaviness and failure flames with a calmer navigation-system vocabulary.

- **Shell:** retain the native `<dialog>` layout and its restrained traffic lights. Use an inset “flight frame,” a single low-opacity orbital/vector line, and a faint horizon gradient. The transcript remains the visual priority; the command index is a secondary telemetry rail on desktop and remains hidden below `lg`.
- **Palette:** derive all new spectral, success, warning, and surface values from existing theme variables with `color-mix()`. Never hard-code cyan, dark backgrounds, or a theme-specific foreground; the 22 theme presets, including light themes, must remain legible.
- **Type:** mono for commands, telemetry, and gate states. Existing localized prose and command output stay unchanged. Use tabular numerals for sequence progress.
- **Density:** preserve the current terminal dimensions, mobile single-column layout, and keyboard-size keycaps. Avoid decorative layers that obscure command text or make the gate feel modal.

## Gate interaction

### Slash arm

Pressing `/` outside editable controls and open dialogs creates the existing full-viewport, pointer-inert visual gate. Its focal point is a large slash glyph presented as the **flight-path arm**:

1. On `armed`, a short diagonal vector and soft primary-color halo resolve around `/`; the status announces that the gate is armed and displays `0/10`.
2. The slash settles into a thin horizontal route rail once the first valid key is registered. It is a visual anchor only: no click, focus, or pointer interaction is introduced.
3. The 4-second arm window stays in force. Expiry returns directly to `idle` without a failure flourish or extra announcement.

### Progress, reset, and unlock

- Each correct input fills exactly one of ten route ticks and adds its already-entered arrow/letter keycap to the rail. The next key is never revealed; the gate continues to show only input already accepted.
- A wrong input appends the existing error keycap, switches the rail to an amber/red **route lost** treatment, and shows a brief decompression/defocus rather than fire. It announces the reset once, then resets after the existing 750 ms delay.
- `Escape`, focus entering an editable target, or a dialog opening cancels silently to `idle`, as today.
- On the tenth correct key, all route ticks illuminate, the slash/vector route contracts toward the terminal bezel, and the gate uses the existing 300 ms handoff before opening the dialog. The terminal shell receives its existing 600 ms armed bezel pulse.
- Motion is decorative only. Phase changes and their durations must not depend on animation completion.

## Accessibility and semantic contract

The visual gate remains `aria-hidden="true"` and pointer-inert because it does not accept interaction. Its status copy and decorative keycaps must not be announced individually.

**Required current defect fix:** `KonamiSequenceGate.vue` currently nests `<div class="sr-only" aria-live="polite">` inside `.konami-gate[aria-hidden="true"]`. This removes the live region from the accessibility tree in practice. Move the live region to `app/app.vue` as a sibling of `LazyTerminalKonamiSequenceGate` (or another non-`aria-hidden` app-level sibling), bound to `gateAnnounce`; remove the live-region element and `announce` prop from `KonamiSequenceGate`. Keep the visual overlay hidden from assistive technology, and make the external live region the sole spoken status channel.

- Use `aria-live="polite"` and atomic updates; announce only arm, progress, reset, and unlock strings.
- Do not move focus to the gate or trap focus. On unlock, preserve the existing dialog behavior: focus the terminal input, make the app inert, and restore the invoking element when the dialog closes.
- Retain visible `:focus-visible` treatment for terminal controls and current Escape behavior.

## Theme, reduced motion, and performance

- Continue to use `useTheme()`/CSS theme variables and `useMotionConfig()` plus `usePrefersReducedMotion()`. Respect both explicit reduced-motion preference and the mobile/coarse-pointer motion budget.
- With motion disabled, render each gate phase at its final visual state: no route sweep, scale, key fall, blur, flame/decompression, or animated scanline. State timing still opens/resets the terminal as specified.
- Keep the gate lazy-mounted only outside `idle` and the terminal lazy-mounted only after first unlock. Do not add images, canvas/WebGL, audio, webfont requests, polling, or global listeners.
- Limit desktop-only animation to transform and opacity; do not animate `filter`, `box-shadow`, layout properties, or broad paint-heavy backgrounds. Avoid additional `backdrop-filter` layers beyond the dialog's existing backdrop.
- Verify the existing mobile rule that suppresses global particle/HUD work remains effective while the gate is active.

## File and component boundaries

- `app/app.vue`: remains the integration point for shortcut state, lazy gate mounting, and the external live region. It must pass visual phase/key/progress data only.
- `app/components/terminal/KonamiSequenceGate.vue`: owns presentation of the hidden visual overlay, slash arm, route ticks, entered keycaps, and phase classes. It must not own global keyboard handling, timers, focus, or live announcements.
- `app/composables/usePortfolioTerminalShortcut.ts`: remains the source of truth for keyboard capture, editable/dialog exclusions, phase transitions, timers, revealed key data, and translated announcement values. Do not duplicate sequence state in the component.
- `app/config/portfolioTerminal.config.ts`: retains the sequence and current `4000 / 750 / 300 ms` constants unless a separately approved behavioral change is needed.
- `app/components/PortfolioTerminal.vue` and `app/components/terminal/{TerminalTranscript,TerminalPrompt,TerminalCommandIndex}.vue`: retain their existing responsibilities and DOM contracts; only styling/chrome hooks needed for the Flight Deck belong here.
- `app/assets/css/main.css`: contains all Flight Deck tokens, responsive rules, reduced-motion overrides, and the terminal/gate styles. Keep selectors scoped to the existing `portfolio-terminal` and `konami-gate` namespaces.

## i18n

All visible and announced gate copy remains under `terminal.gate` in both `i18n/locales/en.json` and `i18n/locales/es.json`. Update the existing armed, progress, reset, unlock, label, unlocked-label, and reset-label values to Flight Deck terminology where needed; add only keys for new visible/announced text. Keep dynamic `{current}` and `{total}` interpolation and provide Spanish equivalents in the same change. Command names, aliases, transcript responses, and terminal safety copy are out of scope.

## Test plan

- Extend `tests/nuxt/usePortfolioTerminalShortcut.nuxt.spec.ts` to preserve exact-sequence unlock, wrong-key reset, editable-target exclusion, failed/unlocked input suppression, Escape cancellation, and arm-timeout behavior.
- Add a component-level accessibility regression test for `KonamiSequenceGate`: the visual root is `aria-hidden`, it has no descendant live region, and the app-level live region receives arm/progress/reset/unlock text.
- Extend `tests/e2e/portfolio-terminal.spec.ts` to assert the visual gate appears after `/`, accepted inputs fill one tick/keycap at a time, a wrong key shows reset state and never opens the dialog, and successful unlock still focuses the prompt and restores focus on exit.
- Add reduced-motion coverage to verify no gate motion classes/styles require animation and that unlock/reset semantics still complete. Exercise a dark and a light theme to confirm contrast and theme-variable derivation.
- Run the focused unit and E2E suites, then `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` during implementation.

## Non-goals

- Changing the Konami sequence, timing constants, command whitelist/parser, command behavior, dialog semantics, or terminal session persistence.
- Adding a visible “open terminal” button, touch gesture, audio, haptics, a game, or a new navigation path.
- Replacing the native dialog, introducing a new animation library, or creating a standalone design system.
- Applying the Flight Deck visual language to unrelated page sections, navbar, particles, or theme picker.
