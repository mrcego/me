# Specification: Portfolio Sanctuary & Interactive Terminal

## Domain

`portfolio-sanctuary`

## Overview

Canonical specifications for the personal portfolio, digital sanctuary, programmatic landings, and interactive terminal of César Gómez (`cesargomez.dev`).

---

## Requirements

### REQ-001: Offline Icon Bundling

The system MUST bundle all UI icons offline at build-time using `@nuxt/icon` (`provider: 'none'`, `fallbackToApi: false`, `serverBundle: 'local'`). No runtime requests to external icon APIs SHALL be allowed.

#### Scenario: Icon rendering offline

- **GIVEN** the application is running in an offline or restricted network environment
- **WHEN** any component renders a registered icon from `@iconify-json/*`
- **THEN** the icon SVG MUST render immediately without network errors or remote CDN fetches.

---

### REQ-002: Strict Content Security Policy (CSP Grade A+)

All production pages MUST comply with strict CSP headers with zero inline event handlers (`onload`, `onclick`, `onerror`).

#### Scenario: Preload stylesheet delivery

- **GIVEN** a preloaded CSS stylesheet link in the HTML `<head>`
- **WHEN** the browser parses the document under strict CSP
- **THEN** it MUST NOT use inline JavaScript event handlers and MUST NOT trigger CSP violation reports.

---

### REQ-003: Bilingual Localization Parity

All user-facing copy MUST be localized in English (`i18n/locales/en.json`) and Spanish (`i18n/locales/es.json`) with 100% key parity.

#### Scenario: Locale switching

- **GIVEN** a visitor on any page or landing
- **WHEN** the visitor switches the language toggle
- **THEN** the route MUST transition seamlessly, preserve the scroll position or route target, and render localized text without missing translation keys.

---

### REQ-004: Interactive Terminal & Konami Gate

The system MUST provide an interactive terminal (`/` shortcut) with command execution, shell history, theme customization, telemetry inspection, and Konami code easter egg.

#### Scenario: Terminal opening and command execution

- **GIVEN** a visitor on the home page
- **WHEN** the visitor presses the `/` key or clicks the terminal trigger
- **THEN** the terminal modal MUST open, trap keyboard focus, and accept commands (`help`, `stack`, `theme`, `benchmark`, `deploy`, `clear`).

---

### REQ-005: Angie AI Concierge Guardrails

The Angie AI concierge MUST operate with strict domain guardrails, defending against prompt injection and off-topic queries, and prioritizing verified production achievements.

#### Scenario: Domain-restricted query handling

- **GIVEN** an active conversation with Angie AI
- **WHEN** a visitor asks about César's technical experience, architecture, or case studies
- **THEN** Angie MUST retrieve verified knowledge entries, provide structured action buttons, and refuse off-topic or prompt-injection attempts.
