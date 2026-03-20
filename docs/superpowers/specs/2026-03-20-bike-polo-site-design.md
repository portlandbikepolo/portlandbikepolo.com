# Portland Bike Polo — Site Design Spec

**Date:** 2026-03-20
**Branch:** `astro_refactor`
**Status:** Approved

---

## Overview

A public-facing Astro website for Portland Bike Polo serving two equal audiences: curious newcomers who have never heard of the sport, and current/returning club members. The aesthetic is gritty/underground — raw and punchy like the sport itself — with a Pacific Northwest character.

---

## Goals

- Hook newcomers: explain what bike polo is and invite them to show up
- Serve members: surface upcoming tournaments and pick-up play schedule
- Showcase the club: action photos and live Instagram feed
- Fully accessible (WCAG AA) and mobile-first

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro (static output) |
| Styling | Tailwind CSS v4 |
| CMS | Keystatic (local storage mode) |
| Carousel | Embla Carousel + Embla Autoplay |
| Social | Instagram official embed |
| React | Scoped to Keystatic admin + PhotoCarousel island only |

---

## Color System

All combinations verified WCAG AA (4.5:1 minimum for normal text). Blue-orange accent pairing is safe across all forms of colorblindness (protanopia, deuteranopia, tritanopia).

| Token | Hex | Name | Contrast on bg |
|---|---|---|---|
| `--color-bg` | `#1e2a30` | Pacific Storm | — |
| `--color-surface` | `#253540` | Deep Slate | — |
| `--color-text-primary` | `#e8e4d8` | Morning Mist | 11.5:1 AAA |
| `--color-text-secondary` | `#9ab5c2` | Coastal Fog | 6.8:1 AA |
| `--color-accent` | `#d4842a` | Chanterelle | 5.0:1 AA |
| `--color-secondary` | `#5a9eae` | Salish Sea | 4.8:1 AA |

No red or green used as semantic/distinguishing colors.

---

## Pages

| Route | Source | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage |
| `/about` | `src/pages/about.astro` | About the club (Keystatic singleton) |
| `/play` | `src/pages/play.astro` | How to get involved (Keystatic singleton) |
| `/coc` | `src/pages/coc.astro` | Code of Conduct (Keystatic singleton) |
| `/tournaments` | `src/pages/tournaments/index.astro` | Tournament listing |
| `/tournaments/[id]` | `src/pages/tournaments/[id].astro` | Individual tournament |
| `/404` | `src/pages/404.astro` | Not found |

---

## Homepage Layout

Sections top to bottom:

1. **Sticky nav** — logo left, links right, hamburger on mobile
2. **Full-bleed hero** — one action photo as background, overlaid with club name, tagline, location label, and primary CTA button
3. **Three equal info cards** — Come Play / Next Tournament / What Is Bike Polo? (3-column on `md+`, stacked on mobile)
4. **Photo carousel** — Embla with autoplay, all 6 polo action photos
5. **Instagram feed** — official Instagram embed, fallback link if script fails
6. **Footer** — nav links, social link, copyright

---

## Components

### `BaseLayout.astro`
- Sets `<html lang="en">`
- Injects skip-to-main-content link as first focusable element
- Imports global Tailwind styles and color token definitions
- Renders `<SiteNavbar>` and `<SiteFooter>` around `<slot />`

### `SiteNavbar.astro`
- Logo (SVG asset) linked to `/`
- Nav links: About, Play, Tournaments
- Mobile: hamburger button with `aria-expanded` / `aria-controls`
- Mobile menu: focus-trapped when open, closes on Escape
- Active link indicated visually and via `aria-current="page"`

### `SiteFooter.astro`
- Repeated nav links
- Instagram / social link
- Copyright line

### `HeroSection.astro`
- Full-bleed `<section>` with background image via CSS `background-image`
- Dark overlay for text legibility
- Fluid headline typography with `clamp()`
- Amber accent label ("Portland, Oregon · Est. 2007")
- Primary CTA: "Come Play" → `/play`
- Secondary CTA: "Tournaments →" → `/tournaments`

### `InfoCards.astro`
- Three `<article>` cards in a CSS grid (1-col mobile, 3-col `md+`)
- **Come Play card**: day/time/location, links to `/play`
- **Next Tournament card**: pulls latest tournament from content collection, links to tournament page
- **What Is Bike Polo card**: one-paragraph hook, links to `/about`
- Each card has a colored top border (amber / teal / fog) for visual hierarchy without red/green dependency

### `PhotoCarousel` (React island)
- `client:load` Astro island
- Embla Carousel with Autoplay plugin
- `role="region"` with `aria-label="Photo gallery"`
- Prev/Next buttons with `aria-label`
- Keyboard navigable (arrow keys)
- All images have descriptive `alt` text
- 6 existing polo action photos from `src/assets/images/polo/`

### `InstagramFeed.astro`
- Section heading: "Follow Along"
- Official Instagram embed script (`//www.instagram.com/embed.js`)
- Fallback: visible link to Instagram profile if script fails or is blocked
- `aria-label` on the embed container

### `TournamentCard.astro`
- Accepts tournament entry (title, startDate, endDate, venue, cover image)
- Semantic `<article>` with cover image (`alt` = tournament title)
- Date range formatted as human-readable string
- Links to `/tournaments/[id]`

---

## Content Collections (existing, unchanged)

### `tournaments` collection
Fields: `title`, `cover` (image), `startDate`, `endDate`, `venue`, `content` (Markdoc)

### Keystatic singletons
- `about` — About page content
- `play` — Play page content
- `codeOfConduct` — Code of Conduct content

---

## Accessibility Requirements

- Skip-to-main-content link: first focusable element on every page
- All semantic landmarks: `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
- All images: meaningful `alt` text (no empty alt on informational images)
- Focus ring visible on all interactive elements — Tailwind `focus-visible` ring in `--color-accent`
- Hamburger mobile menu: `aria-expanded`, `aria-controls`, focus-trapped when open, closes on Escape
- Carousel: `role="region"`, `aria-label`, keyboard-accessible prev/next controls
- Instagram embed: labeled container, text fallback
- Color contrast: all text combinations verified WCAG AA minimum
- No color-only information conveyance

---

## Mobile Responsiveness

- Mobile-first Tailwind breakpoints
- Nav collapses to hamburger at `< md` (768px)
- Info cards: 1-column on mobile, 3-column on `md+`
- Hero headline uses `clamp()` for fluid type
- All tap/click targets minimum 44×44px
- Embla handles touch/swipe natively

---

## Out of Scope

- User accounts or login
- Online tournament registration
- Cloudflare Workers / server-side rendering (static output only)
- Search functionality
- Dark/light mode toggle (dark is the only mode)
