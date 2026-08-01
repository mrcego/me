# Code review protocol (three-pass)

## Pass 1 — Correctness & honesty

- Claims match CV/i18n truth (no AI Engineer job title, no fake metrics).
- SSG determinism (dates, availability, random).
- Schema entity identity (`Person` @id unique).

## Pass 2 — Performance & deploy

- Artifact `_headers` includes cache + CSP.
- Lazy islands / canvas budgets on mobile.
- LCP preload intact; no webfont preload.

## Pass 3 — Accessibility & conversion

- Dialogs: label, trap, Escape, restore, inert.
- Section navigation works from landings.
- Forms labelled; no unlabeled icon buttons.
- Case studies use real destinations.

For every confirmed bug: add a regression test or document an explicit exemption in `quality/RECONCILIATION.md`.
