---
name: César Gómez Portfolio
description: Senior Fullstack Engineer & Frontend Architect Design System
colors:
  primary: '#58a6ff'
  primary-hover: '#79b8ff'
  background: '#0d1117'
  surface: '#161b22'
  foreground: '#ffffff'
  muted: '#cbd5e1'
  accent: '#3b82f6'
  border: 'rgba(255, 255, 255, 0.1)'
typography:
  display:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: 'clamp(2.25rem, 6vw, 4.5rem)'
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: '-0.03em'
  headline:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: 'clamp(1.75rem, 4vw, 2.75rem)'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  title:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '-0.01em'
  body:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 'normal'
  label:
    fontFamily: "ui-monospace, 'Fira Code', SFMono-Regular, monospace"
    fontSize: '0.75rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '0.1em'
rounded:
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  full: '9999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  '2xl': '48px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '#000000'
    rounded: '{rounded.full}'
    padding: '16px 36px'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    rounded: '{rounded.full}'
    padding: '16px 36px'
  card-glass:
    backgroundColor: 'rgba(22, 27, 34, 0.75)'
    textColor: '{colors.foreground}'
    rounded: '{rounded.xl}'
    padding: '24px'
---

# Design System: César Gómez Portfolio

## Overview

**Creative North Star: "The Modern IDE Sanctuary"**

The visual language marries the technical rigor and precision of an advanced developer IDE (subtle HUD grid lines, scanlines, monospace badges, terminal overlays) with the elegance and conversion clarity of a world-class digital product. Dark canvases provide a calm, distraction-free backdrop where vibrant electric accents and multi-theme palettes spotlight architecture case studies, metrics, and hiring paths.

Depth is expressed through multi-layered glassmorphism and crisp borders rather than heavy, muddy drop shadows. Micro-interactions (card tilting, smooth button scaling, particle sweep effects) offer tactile feedback without compromising performance or causing layout shift.

**Key Characteristics:**

- **IDE-Inspired Atmosphere**: Obsidian backdrops, terminal prompts, code-level badges, and custom theme switches (Dark Modern, Dark+, Tokyo Night).
- **Tactile Glass Layering**: Translucent surfaces with calibrated backdrop blurs (`8px` to `24px`) and luminous 1px perimeter borders.
- **Zero-Regret Performance**: Visual enhancements (scanlines, subtle HUD grids, webfonts) defer until post-idle (`html.fx-on`) to keep First Contentful Paint and Largest Contentful Paint sub-second.
- **Dual Conversion & Proof Focus**: Prominent CTA buttons with fluid hover states paired with real interactive engineering proof (CLI terminal, interactive metrics).

## Colors

The palette centers on a deep obsidian canvas accented by crisp electric blues, jewel highlights, and high-contrast typography calibrated for strict WCAG 2.1 AA accessibility.

### Primary

- **Electric Cyan-Blue** (`#58a6ff` / `#007acc`): Primary action triggers, key active navigation states, focus rings, and brand identity marks.

### Secondary

- **Deep Slate Canvas** (`#161b22` / `#1e1e2e`): Surface container backgrounds, card panels, and navigation shells.

### Tertiary

- **Neon Indigo Accent** (`#7aa2f7` / `#3b82f6`): Gradient endpoint highlights, glowing badge borders, and terminal keyword accents.

### Neutral

- **Obsidian Dark** (`#0d1117`): Global body canvas backdrop.
- **Pure White** (`#ffffff`): Primary headings and high-contrast title copy.
- **Cool Slate** (`#cbd5e1`): Secondary descriptive text, metadata tags, and disabled states.
- **Subtle Glass Border** (`rgba(255, 255, 255, 0.1)`): Card and surface structural borders.

### Named Rules

**The Rare Electric Accent Rule.** The primary electric accent is restricted to key interactive affordances, active states, and focal metrics (≤10% of any viewport). Its restraint commands instant visual priority.

**The Multi-Theme Invariant Rule.** Every color role must resolve dynamically through CSS custom properties (`--primary`, `--background`, `--surface`), allowing instant runtime switching between IDE presets without hardcoded overrides.

## Typography

**Display Font:** Outfit (`"Outfit", ui-sans-serif, system-ui, sans-serif`)  
**Body Font:** System Sans (`ui-sans-serif, system-ui, -apple-system, sans-serif`)  
**Label / Mono Font:** Fira Code / JetBrains Mono (`ui-monospace, "Fira Code", monospace`)

**Character:** Bold, modern geometric display headings paired with clean, highly readable neutral body text and crisp developer monospace labels.

### Hierarchy

- **Display** (800 weight, `clamp(2.25rem, 6vw, 4.5rem)`, 1.1 line-height, -0.03em tracking): Hero title and landmark section headlines.
- **Headline** (700 weight, `clamp(1.75rem, 4vw, 2.75rem)`, 1.2 line-height, -0.02em tracking): Major section headers and case study titles.
- **Title** (600 weight, `1.25rem` / `20px`, 1.4 line-height, -0.01em tracking): Card headers, service role names, and metric labels.
- **Body** (400 weight, `1rem` / `16px`, 1.6 line-height, normal tracking, max 65–75ch): Narrative text, project descriptions, and FAQ answers.
- **Label / Monospace** (700 weight, `0.75rem` / `12px`, 1.2 line-height, 0.1em tracking, uppercase): Terminal tags, category badges, availability indicators, and system metrics.

### Named Rules

**The First-Paint System Font Rule.** First paint renders strictly with native local system font faces (`ui-monospace`, `ui-sans-serif`) to eliminate layout shifts and network blocking. Webfonts load asynchronously and hydrate smoothly after load.

## Layout

The spatial model uses an 8pt / 12-column responsive fluid grid with clean vertical rhythm and dedicated density tiers:

- **Max Container Width**: `80rem` (1280px) for general content; `90rem` (1440px) for immersive dashboard and hero sections.
- **Spacing Rhythm**: 4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px (`p-4`, `p-6`, `p-8`, `gap-6`, `gap-8`).
- **Density Tiers**:
  - `surface-narrative`: Low-density, generous line height for reading case studies and career history.
  - `surface-evidence`: Medium-density glass cards with structured badges, stats, and CTAs.
  - `surface-utility`: High-density monospace status indicators, HUD widgets, and terminal lines.
- **Responsive Breakpoints**:
  - Mobile (`< 640px`): Single-column stacked layouts, 44px minimum touch targets, collapsible full-screen navigation modal.
  - Tablet (`640px – 1024px`): 2-column card grids, condensed topbar with icon actions.
  - Desktop (`> 1024px`): 3-column / asymmetric layout, 3D card tilt, interactive terminal drawer.

## Elevation & Depth

Surfaces are predominantly flat and luminous at rest, relying on translucent glass layering and 1px perimeter highlights rather than heavy drop shadows.

### Shadow Vocabulary

- **Subtle Ambient** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)`): Glass cards and interactive buttons at rest.
- **Accent Glow** (`box-shadow: 0 0 25px rgba(88, 166, 255, 0.25)`): Active theme switches, terminal prompt focus, and primary button hover states.
- **Deep Modal Backdrop** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5)`): Terminal dialog and navigation drawer overlays.

### Named Rules

**The Glass Blur Hierarchy Rule.** Mobile viewports compute lightweight backdrop blurs (`8px`), while desktop viewports receive deep blurs (`20px – 24px`), preventing mobile GPU rendering bottlenecks.

**The No-Double-Blur Rule.** Nested containers within a glass card must use `.glass-lite` or `.surface-utility` (zero extra blur) to prevent stacking multiple heavy blur layers.

## Shapes

- **Radius Scale**:
  - `sm` (8px): Chips, tooltips, and code inline tags.
  - `md` (12px): Profile icons, form inputs, and small utility cards.
  - `lg` (16px): Standard evidence cards, feature blocks, and dialog boxes.
  - `xl` (24px): Large showcase cards, terminal dialog frame, and section banners.
  - `full` (9999px): Primary and secondary CTA pill buttons, avatar rings, and counter badges.
- **Border Treatment**: 1px subtle stroke (`border-foreground/10` or `border-primary/20`) defining clear surface contours.

## Components

### Buttons

- **Shape**: Full pill (`rounded-full`, 9999px radius).
- **Primary**: Background `{colors.primary}`, text `#000000` (or theme contrast), bold uppercase, tracking-wider, padding `14px 28px`. Hover: scale-102, shadow glow. Active: scale-95.
- **Secondary / Glass**: Translucent glass (`.glass`), text `{colors.foreground}`, border `border-foreground/15`. Hover: `border-primary/40`, `text-primary`.
- **Icon Actions**: Circular `size-11` (44px) or `size-12` (48px) buttons with centered SVG icon, `border-foreground/15`, and smooth hover color shift.

### Cards / Containers

- **Corner Style**: `rounded-2xl` (16px / 24px).
- **Background**: Translucent surface (`var(--glass-bg)` or `bg-secondary/40`).
- **Border**: 1px crisp stroke (`border-foreground/10`).
- **Hover Behavior**: 3D perspective tilt (`useCardTilt`) on desktop, subtle border glow (`hover:border-primary/30`).
- **Internal Padding**: `p-6` (mobile) to `p-8` (desktop).

### Chips & Badges

- **Shape**: `rounded-xl` (12px) or `rounded-full`.
- **Style**: Monospace label, `bg-primary/10`, `border-primary/20`, text `{colors.primary}`, padding `4px 12px`.

### Inputs & Forms

- **Shape**: `rounded-xl` (12px radius).
- **Background**: `bg-secondary/60` with `border-foreground/15`.
- **Focus**: `focus:border-primary focus:ring-2 focus:ring-primary/20` transition with zero layout jump.

### Navigation Topbar & Mobile Drawer

- **Desktop Topbar**: Floating glass capsule (`.glass`, `rounded-full`, `p-2`), backdrop-filtered with active section indicator pills.
- **Mobile Drawer**: Full-screen dialog with brand header, 2-column section grid, and specialized hiring profile cards with specialty subtitle tags.

### Signature Component: Portfolio Terminal

- **Visuals**: Dark monospace console window with macOS-style window controls, cyan prompt markers (`>`), real-time autocomplete, and audio feedback option.
- **Trigger**: Universal `/` keyboard shortcut or floating HUD trigger button.

## Do's and Don'ts

### Do:

- **Do** use semantic CSS variables (`var(--primary)`, `var(--background)`) for every visual property to guarantee complete multi-theme support.
- **Do** preserve 44px minimum touch targets on all mobile interactive elements.
- **Do** test high contrast (4.5:1 text-to-background ratio) across both Dark Modern and Tokyo Night themes.
- **Do** use `.glass-lite` on nested cards inside glass containers to keep frame rates at 60fps.

### Don't:

- **Don't** hardcode static hex colors in component templates when a theme token exists.
- **Don't** apply heavy drop shadows without a glass border; dark themes require luminous border contours for boundary definition.
- **Don't** load render-blocking webfonts on initial paint; let the local system stack render FCP instantly.
- **Don't** crowd the screen with neon accents; reserve `{colors.primary}` for focused interactive elements.
