# Portland Bike Polo — Site Design Spec

**Date:** 2026-03-20
**Branch:** `astro_refactor`
**Status:** Approved

---

## Overview

A public-facing Astro website for Portland Bike Polo serving two equal audiences: curious newcomers who have never heard of the sport, and current/returning club members. The aesthetic is gritty/underground — raw and punchy like the sport itself — with a Pacific Northwest character.

Portland Bike Polo is a non-profit 501(c)(3) organization focused on building a competitive, diverse, and inclusive bike polo community in the Pacific Northwest. Federal Tax ID: #83-3435866.

This information should appear in the site footer.

---

## Goals

- Hook newcomers: explain what bike polo is and invite them to show up
- Serve members: surface upcoming tournaments and pick-up play schedule
- Showcase the club: action photos and live Instagram feed
- Fully accessible (WCAG AA) and mobile-first

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro (static output) |
| Styling | Tailwind CSS v4 |
| CMS | Keystatic (local storage mode) |
| Carousel | Embla Carousel + Embla Autoplay |
| Social | Instagram official embed (`@portlandbikepolo`) |
| React | Scoped to Keystatic admin + PhotoCarousel island only |

---

## Color System

All combinations verified WCAG AA (4.5:1 minimum for normal text). `--color-secondary` (4.8:1) is used only for large text (≥18px) and UI elements (borders, icons) where the 3:1 large-text threshold applies — never for small body text. Blue-orange accent pairing is safe across all forms of colorblindness (protanopia, deuteranopia, tritanopia). No red or green used as semantic/distinguishing colors.

| Token | Hex | Name | Contrast on bg |
| --- | --- | --- | --- |
| `--color-bg` | `#1e2a30` | Pacific Storm | — |
| `--color-surface` | `#253540` | Deep Slate | — |
| `--color-text-primary` | `#e8e4d8` | Morning Mist | 11.5:1 AAA |
| `--color-text-secondary` | `#9ab5c2` | Coastal Fog | 6.8:1 AA |
| `--color-accent` | `#d4842a` | Chanterelle | 5.0:1 AA |
| `--color-secondary` | `#5a9eae` | Salish Sea | 4.8:1 (large text / UI only) |

Card top borders use `--color-accent` (amber), `--color-secondary` (teal), and `--color-text-secondary` (fog/slate) respectively — all three are visually distinct and none are red/green.

---

## Pages

| Route | Source | Description |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Homepage |
| `/about` | `src/pages/about.astro` | About the club |
| `/play` | `src/pages/play.astro` | How to get involved |
| `/coc` | `src/pages/coc.astro` | Code of Conduct |
| `/tournaments` | `src/pages/tournaments/index.astro` | Tournament listing |
| `/tournaments/[id]` | `src/pages/tournaments/[id].astro` | Individual tournament |
| `/404` | `src/pages/404.astro` | Not found |

---

## Homepage Layout

Sections top to bottom:

1. **Sticky nav**
2. **Full-bleed hero** — `polo_01.webp` as background image, dark overlay, overlaid with club name, tagline, location label, and CTAs
3. **Three equal info cards** — Come Play / Next Tournament / What Is Bike Polo? (3-column on `md+`, stacked on mobile)
4. **Photo carousel** — Embla with autoplay, all 6 polo action photos
5. **Instagram feed** — official Instagram embed with always-visible fallback link
6. **Footer**

---

## Components

### `BaseLayout.astro`

- Sets `<html lang="en">`
- First element in `<body>` is a visually hidden skip link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`
- Defines Tailwind CSS color tokens as CSS custom properties on `:root`
- Renders `<SiteNavbar>` and `<SiteFooter>` around `<main id="main-content"><slot /></main>`

### `SiteNavbar.astro`

- Logo: `src/assets/images/logo_light_outline.svg`, linked to `/`, `aria-label="Portland Bike Polo — Home"`
- Nav links: About (`/about`), Play (`/play`), Tournaments (`/tournaments`)
- Active link: `aria-current="page"` + amber underline on current route
- Mobile (`< md`): hamburger `<button>` with `aria-expanded`, `aria-controls="mobile-menu"`, and `aria-label="Open navigation menu"` / `"Close navigation menu"` toggled by state
- Mobile menu (`id="mobile-menu"`): full-screen overlay, stacked links, focus-trapped while open using vanilla JS (cycle focus between first and last focusable elements on Tab/Shift+Tab), closes on Escape

### `SiteFooter.astro`

- Repeated nav links (About, Play, Tournaments)
- Instagram link: `https://instagram.com/portlandbikepolo` with text "Follow @portlandbikepolo"
- Non-profit statement: "Portland Bike Polo is a non-profit 501(c)(3) organization focused on building a competitive, diverse, and inclusive bike polo community in the Pacific Northwest."
- Tax ID line: "Federal Tax ID: #83-3435866"
- Copyright: `© Portland Bike Polo`

### `HeroSection.astro`

- Full-bleed `<section>` using `polo_01.webp` as CSS `background-image` with `background-size: cover; background-position: center`
- Semi-transparent dark overlay (`bg-black/60`) for text legibility — ensures white text achieves ≥ 4.5:1 contrast
- Headline: "Hardcourt Bike Polo" — fluid size via `clamp(2rem, 5vw, 4rem)`
- Subhead in `--color-secondary`: "In the Rain" (Portland identity)
- Amber label: "Portland, Oregon · Est. 2007"
- Primary CTA: `<a href="/play">Come Play</a>` — amber filled button
- Secondary CTA: `<a href="/tournaments">Tournaments →</a>` — teal outlined button
- Min-height `100svh` on mobile, `80vh` on `md+`

### `InfoCards.astro`

Three `<article>` cards in a CSS grid: `grid-cols-1 md:grid-cols-3`. Each card has a colored 3px top border.

**Come Play card** (amber border):

- Heading: "Come Play"
- Content (hardcoded in component — update here when schedule changes):
  - Fridays — afternoon pick-up, all levels
  - Saturdays — afternoon, pro-level
  - Sundays — general pick-up, all welcome
- Location: Alberta Park, Portland, OR
- Link: "How to show up →" → `/play`

**Next Tournament card** (teal border):

- Heading: "Next Tournament"
- Pulls from the `tournaments` content collection: the entry with the earliest `startDate` that is ≥ today's date (build time)
- Displays: title, formatted date range (`MMM D–D, YYYY`), venue
- Link: "Details →" → `/tournaments/[id]`
- Fallback (no upcoming tournaments): render "Stay tuned — more tournaments coming soon."

**What Is Bike Polo card** (fog/slate border):

- Heading: "What Is Bike Polo?"
- Content: one short hardcoded paragraph: "Three players, one goal, one mallet. Hardcourt bike polo is fast, physical, and welcoming — played on bikes in a fenced court."
- Link: "Learn more →" → `/about`

### `PhotoCarousel` (React island, `client:load`)

- Embla Carousel with `EmblaAutoplay({ delay: 4000, stopOnInteraction: true })`
- Autoplay is disabled entirely when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — carousel renders as static first slide in that case
- Autoplay pauses on mouse hover and on keyboard focus within the carousel
- `role="region"` with `aria-label="Portland Bike Polo photo gallery"`
- Pause/Play toggle button: `aria-label="Pause slideshow"` / `"Play slideshow"`, visually a ⏸/▶ icon, always visible — satisfies WCAG 2.2.2
- Prev / Next buttons: `aria-label="Previous photo"` / `"Next photo"`, keyboard accessible
- Photos (all from `src/assets/images/polo/`):

| File | `alt` text |
| --- | --- |
| `polo_01.webp` | Players jostling for position during a Portland Bike Polo match |
| `polo_02.webp` | A polo player taking a shot on goal |
| `polo_03.webp` | Two players racing for the ball at midcourt |
| `polo_04.webp` | A goalie defending the net during a club match |
| `polo_05.webp` | Players clustered around the ball in tight court action |
| `polo_06.webp` | A polo player maneuvering around an opponent |

*(Alt text is descriptive placeholder — update with accurate descriptions once photos are reviewed.)*

### `InstagramFeed.astro`

- `<section aria-label="Portland Bike Polo on Instagram">`
- Section heading (visible): "Follow Along"
- Instagram embed: load `//www.instagram.com/embed.js` via `<script async>`; embed a pinned post or the profile widget using the official embed markup
- Fallback link: always visible below the embed — `<a href="https://instagram.com/portlandbikepolo">@portlandbikepolo on Instagram</a>` — ensures content is accessible with or without the embed loading

### `TournamentCard.astro`

Props: `title`, `startDate`, `endDate`, `venue`, `cover` (image), `slug`

- Semantic `<article>`
- Cover image rendered with Astro `<Image>`, `alt={title}`, `loading="lazy"`
- Formatted date range: `Apr 12–13, 2025` style
- Venue line in `--color-text-secondary` (e.g. "Alberta Park, Portland, OR")
- Full card is a link to `/tournaments/${slug}` — wraps with `<a>` at article level, `aria-label={title}`

### `TournamentList.astro`

Used on `/tournaments/index.astro`:

- Fetches all entries from `tournaments` collection
- Sorts by `startDate` descending (most recent first)
- Renders a grid of `<TournamentCard>` components: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Empty state: "No tournaments yet — check back soon."

---

## Page Layouts

### `/` — Homepage

Composition of: `HeroSection`, `InfoCards`, `PhotoCarousel`, `InstagramFeed` inside `BaseLayout`.

### `/tournaments` — Tournament Index

`BaseLayout` → `<main>`:

- Page heading: "Tournaments" (h1)
- `<TournamentList>` component

### `/tournaments/[id]` — Tournament Detail

`BaseLayout` → `<main>`:

- Cover image: full-width, `aspect-ratio: 16/9`, `object-fit: cover`, `alt={title}`
- h1: tournament title
- Date range + venue in `--color-text-secondary`
- Divider
- Markdoc body content rendered via `<Content />` — styled with Tailwind Typography prose classes using the site color tokens
- Back link: "← All Tournaments" → `/tournaments`

### `/about`, `/play`, `/coc` — Content Pages

All three follow the same layout. `BaseLayout` → `<main>`:

- Max-width centered column (`max-w-2xl mx-auto px-4`)
- h1: page title (About / Play / Code of Conduct)
- Markdoc body content via `<Content />` — Tailwind Typography prose classes
- No sidebar, no hero image

Content is managed via Keystatic singletons. Existing singleton schemas (Markdoc content field only) are sufficient — no schema changes required.

### `/404` — Not Found

`BaseLayout` → `<main>`:

- Centered layout
- h1: "Page Not Found"
- Short message: "That page doesn't exist. Maybe it got mallet'd."
- Link: "Go Home" → `/`

---

## Content Collections (existing, unchanged)

### `tournaments` collection

Fields: `title`, `cover` (image), `startDate`, `endDate`, `venue`, `content` (Markdoc)

### Keystatic singletons

All three singletons (`about`, `play`, `codeOfConduct`) use a single Markdoc content field. No schema changes required — existing configuration is sufficient.

---

## Accessibility Requirements

- **Skip link**: `<a href="#main-content">Skip to main content</a>` — first focusable element on every page, visually hidden until focused
- **Landmarks**: `<nav>`, `<main id="main-content">`, `<section>`, `<footer>`, `<article>` used semantically throughout
- **Images**: all images have meaningful `alt` text; decorative images (if any) use `alt=""`
- **Focus ring**: Tailwind `focus-visible:ring-2 focus-visible:ring-[--color-accent]` on all interactive elements
- **Mobile nav**: `aria-expanded`, `aria-controls`, focus-trapped (vanilla JS), closes on Escape, `aria-label` toggles between open/close state
- **Carousel**: `role="region"`, `aria-label`, pause/play button, keyboard-accessible prev/next, `prefers-reduced-motion` support
- **Instagram section**: `aria-label` on section, always-visible text fallback link
- **Heading hierarchy**: one `<h1>` per page, `<h2>` for major sections, `<h3>` for card headings
- **Color contrast**: all text/bg combinations WCAG AA verified
- **No color-only information**: borders + labels + text used together, never color alone

---

## Mobile Responsiveness

- Mobile-first Tailwind breakpoints throughout
- Nav collapses to hamburger at `< md` (768px)
- Info cards: `grid-cols-1` mobile → `grid-cols-3` on `md+`
- Hero: full-viewport height on mobile (`100svh`), `80vh` on desktop
- Headline: `clamp(2rem, 5vw, 4rem)` fluid type
- All interactive targets: minimum 44×44px touch area
- Embla: touch/swipe handled natively

---

## Assets

| File | Usage |
| --- | --- |
| `src/assets/images/logo_light_outline.svg` | Navbar logo |
| `src/assets/images/polo/polo_01.webp` | Hero background image |
| `src/assets/images/polo/polo_01.webp` – `polo_06.webp` | Photo carousel |
| `src/assets/images/brands/instagram.svg` | Footer Instagram icon (optional) |

---

## Out of Scope

- User accounts or login
- Online tournament registration
- Cloudflare Workers / server-side rendering (static output only)
- Search functionality
- Dark/light mode toggle (dark is the only mode)
- CMS field changes to existing Keystatic singleton schemas
