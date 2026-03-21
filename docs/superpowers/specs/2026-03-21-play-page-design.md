# /play Page Design

**Date:** 2026-03-21
**Branch:** astro_refactor

## Overview

Expand the `/play` page from its current stub into a useful beginner guide. The page helps newcomers understand what bike polo is, when and where to show up, what to bring, and where to buy gear.

## Content Sections

Stacked single-column layout (`max-w-2xl mx-auto`), consistent with the existing About page.

1. **Page header** — `// Get Involved` label + `PLAY` h1
2. **Intro** — beginner-friendly overview of hardcourt bike polo (welcoming tone)
3. **When & Where** — pickup schedule (Fri/Sat/Sun with descriptions) + `map.png` with address caption
4. **What to Bring** — equipment list (helmet, bike; mallet optional for first-timers)
5. **What Kind of Bike** — short prose on what bikes work (fixed, single speed, beater — anything goes)
6. **Get Your Gear** — Hecklers Alley featured callout: logo, blurb, site link, and direct product card for the Complete Mallet

## Keystatic Schema

The `play` singleton in `keystatic/singletons.ts` is expanded from a single `content` field to structured fields:

| Field | Type | Purpose |
|---|---|---|
| `intro` | markdoc | Beginner overview paragraph |
| `schedule` | array of `{ day: text, description: text }` | Pickup days and descriptions |
| `location` | object `{ name: text, address: text }` | Venue name and address |
| `equipment` | markdoc | Equipment list prose |
| `bikeType` | markdoc | What kind of bike to bring |
| `hecklersAlleyBlurb` | markdoc | Short vendor callout text |

**Hardcoded in `.astro`** (not CMS-managed):
- `map.png` image reference
- Hecklers Alley logo, site URL (`https://hecklersalley.com/`)
- Complete Mallet product URL (`https://hecklersalley.com/collections/mallet-parts/products/complete-mallet?variant=41418374217791`)

## Implementation

### Files to modify

- `keystatic/singletons.ts` — expand `play` singleton schema
- `src/content/play/index.mdoc` — update with new structured fields and initial content
- `src/pages/play.astro` — rebuild page to render each section from the new schema

### `play.astro` rendering

- Read singleton via `getEntry("keystatic", "play")`
- Render each field independently (not a single `<Content />` render)
- `intro`, `equipment`, `bikeType`, `hecklersAlleyBlurb` rendered as markdoc via `render()`
- `schedule` and `location` rendered as structured data (loop/template)
- `map.png` imported as an Astro asset and displayed with `<Image />`
- Hecklers Alley logo imported from `@assets/images/brands/hecklers_alley.webp`

### Styling

- Follows existing page conventions: `text-mist`, `text-fog`, `text-accent`, `border-l-[3px] border-accent`
- Section labels use `// style` uppercase tracking pattern
- Hecklers Alley callout uses `border-accent` and displays the logo with the product link as a styled card

## Out of Scope

- No new components (everything in `play.astro`)
- No changes to the InfoCards homepage teaser
- No Enforcer Bikes mention on this page
