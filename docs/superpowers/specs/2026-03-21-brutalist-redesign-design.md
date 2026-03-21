# Brutalist Redesign — Portland Bike Polo

**Date:** 2026-03-21
**Status:** Approved
**Scope:** Full site — all pages and components

---

## Summary

Redesign the Portland Bike Polo site from its current polished dark teal aesthetic to a brutalist style with a warm, slightly fancy edge. The design combines the structured layout of "Dark Minimal" (C) with the raw monospace character and stark borders of "Raw Industrial" (A), layered with a warm cream palette, film grain texture, and four subtle interaction effects.

---

## Design Tokens

Update `src/styles/global.css` `@theme` block:

| Token             | Old value | New value                 | Notes                      |
| ----------------- | --------- | ------------------------- | -------------------------- |
| `--color-bg`      | `#1e2a30` | `#080808`                 | Near-black                 |
| `--color-surface` | `#253540` | `#111111`                 | Card/panel bg              |
| `--color-mist`    | `#e8e4d8` | `#f5ede0`                 | Warm cream — primary text  |
| `--color-fog`     | `#9ab5c2` | `#8a7a6a`                 | Warm gray — secondary text |
| `--color-accent`  | `#d4842a` | `#d4842a`                 | Unchanged                  |
| `--color-teal`    | `#5a9eae` | `#5a9eae`                 | Unchanged                  |
| `--font-mono`     | _(new)_   | `'Space Mono', monospace` | New token                  |

---

## Typography

- **Font:** Space Mono, loaded via Astro's built-in font system using `fontProviders.google()`
- **Weights:** 400 (regular), 700 (bold)
- **CSS variable:** `--font-mono`
- **Applied:** `font-family: var(--font-mono)` on `html` — Space Mono everywhere, no exceptions
- **Headings/labels:** always `text-transform: uppercase` with heavy `letter-spacing`

**`astro.config.mjs` change:**

Add `fontProviders` to the existing `defineConfig` import, then add a top-level `fonts` key alongside `site`, `output`, `adapter`, etc.:

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
    site: "https://portlandbikepolo.com",
    output: "static",
    adapter: cloudflare(),
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Space Mono",
            cssVariable: "--font-mono",
            weights: [400, 700],
            styles: ["normal"],
        },
    ],
    vite: { plugins: [tailwindcss()] },
    integrations: [react(), markdoc(), keystatic()],
});
```

Note: `fonts` is a stable top-level key in Astro 5.7+. No `experimental` flag required for Astro 5.17.x.

**`BaseLayout.astro` change:** import and add `<Font>` in `<head>`:

```astro
---
import { Font } from 'astro:fonts';
---
<head>
  <!-- existing head content -->
  <Font cssVariable="--font-mono" preload />
</head>
```

---

## Global Visual Rules

- `border-radius: 0` — no rounded corners anywhere on the site, including the skip link in `BaseLayout.astro` (remove `focus:rounded` from skip link classes)
- **Major dividers:** `2px solid var(--color-mist)` (nav bottom, footer top, list headers)
- **Panel/card borders:** `1px solid #222`
- **Section accent stripe:** `border-left: 5px solid var(--color-accent)` on hero text blocks
- **Colored card left-borders:** accent (orange) for primary, teal for secondary, fog (`var(--color-fog)`) for tertiary
- **Film grain:** SVG `feTurbulence` fixed pseudo-element on `html::after`, opacity `0.045`, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 9999`

```css
html {
    font-family: var(--font-mono);
}

html::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
    mix-blend-mode: overlay;
}
```

---

## Interaction Effects

All transitions use `ease` timing. CSS only — no JS required.

### 1. Nav link underline slide

```css
.nav-link {
    position: relative;
    padding-bottom: 3px;
    transition: color 0.2s ease;
}
.nav-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--color-accent);
    transition: width 0.25s ease;
}
.nav-link:hover::after,
.nav-link[aria-current="page"]::after {
    width: 100%;
}
```

Remove the existing `aria-[current=page]:border-b-2` and `aria-[current=page]:border-accent` Tailwind classes from nav links — the `::after` pseudo-element replaces them.

### 2. Card hover

- `border-color` brightens on `hover` (0.2s ease)
- `border-left-color` shifts to `#e89a3a` (brighter accent)
- `background` shifts to `#0d0d0d`
- Card link `letter-spacing` opens from `0.1em` → `0.2em` (0.2s ease)

### 3. Button effects

- **Primary:** `background` brightens to `#e89a3a` on hover (0.2s ease)
- **Ghost:** pseudo-element `::before` (cream `#f5ede0` fill) wipes left-to-right via `translateX(-101% → 0)` on hover; text and border color shift to match dark bg

### 4. List row hover stripe

- `::before` pseudo-element: `position: absolute; left: 0; width: 0 → 3px; background: var(--color-accent)` (0.2s ease)
- Row `padding-left` increases slightly on hover (0.2s ease)
- Row `background` shifts to `#0d0d0d`
- List row container must be `position: relative`

---

## Component Specs

### `SiteNavbar`

- Background: `var(--color-bg)` — flush, no surface tint
- Bottom border: `2px solid var(--color-mist)`
- Logo: Space Mono 700, uppercase, `letter-spacing: 0.2em`, cream color
- Nav links: fog color at rest, cream on hover, accent when `aria-current="page"`
- Active state: accent color + underline via effect #1 (remove old `border-b-2` Tailwind active classes)
- Mobile menu: full-screen `bg-bg`, large uppercase links, `border-bottom: 1px solid #1a1a1a` between each link, small monospace location text at bottom

### `HeroSection`

- Background photo stays — it showcases the sport
- Overlay darkened: `bg-black/75` (up from `/60`)
- Remove logo image: delete `import logo from "@assets/images/logo_light_outline.svg"` and the `<Image>` tag that renders it
- Text block: `border-left: 5px solid var(--color-accent)` accent stripe
- Eyebrow: literal string `// PORTLAND, OREGON · EST. 2007` in accent color, `letter-spacing: 0.3em`, all caps
- `<h1>`: Space Mono 700, uppercase, large, `line-height: 0.95`, cream
- Body text: fog color, `line-height: 1.8`
- Primary CTA: accent fill, effect #3 (brightens on hover)
- Secondary CTA (Tournaments): change from teal border/text to cream ghost button — `border: 1px solid #333`, `color: var(--color-fog)`, cream wipe on hover (effect #3)

### `InfoCards`

- Container: `border: 1px solid #222`, remove `gap-4` (set `gap: 0`)
- Cards divided by `border-right: 1px solid #222`; last card gets `border-right: none`
- Left-border per card:
    - Come Play: `border-left: 3px solid var(--color-accent)` — label color: accent
    - Next Tournament: `border-left: 3px solid var(--color-teal)` — label color: teal
    - What Is Bike Polo: `border-left: 3px solid #333` — label color: `var(--color-fog)` (warm gray, readable against dark bg)
- Remove `border-t-4` top-border classes (replaced by left-borders)
- Remove `rounded-sm` from all cards
- Labels: `0.38rem`, `letter-spacing: 0.2em`, uppercase, 700
- Values: Space Mono 700, cream
- Card hover effect (#2) on each card

### `TournamentCard`

- Outer: `border: 1px solid #222`, no `rounded`
- Header bar: accent background, black text, uppercase label + year
- Title: large uppercase 700, cream
- Meta section: `border-top: 1px solid #222`, cells divided by `border-right: 1px solid #222`
- Cover image kept where present

### `TournamentList` (index page)

- Container: `border: 1px solid #222`
- Header row: `border-bottom: 2px solid var(--color-mist)`, uppercase, cream, `letter-spacing: 0.2em`
- Each row: `border-bottom: 1px solid #1a1a1a`, name left + date/cta right, `position: relative`
- Row hover effect (#4)

### `InstagramFeed`

- Container and image cells: `border: 1px solid #222`, no rounded corners
- Any labels or captions: Space Mono, uppercase, fog color
- No background tint

### `SiteFooter`

- `border-top: 2px solid var(--color-mist)`
- Flush `bg-bg` background, no surface tint
- Logo + address left, nav links right — both monospace uppercase, fog color
- No rounded corners

### `SupportedVendors`

- Bordered grid: `border: 1px solid #222` on container and cells
- No rounded corners on vendor logos or containers

### Content pages (`about`, `play`, `coc`, `tournaments/index`, `tournaments/[id]`)

- Page heading: small uppercase label (fog, `letter-spacing: 0.2em`) above large bold heading (cream)
- Body prose: fog-colored text, `border-left: 2px solid #222` on text blocks
- Stat/info grids: `border: 1px solid #222` with `border-right: 1px solid #222` cell dividers, last cell `border-right: none`
- Consistent with global token and effect system

---

## Implementation Approach

**Token swap + restyle** — keep all existing Astro component structure, data fetching, and logic intact. Only change:

1. CSS tokens and global rules in `global.css`
2. Font config in `astro.config.mjs` + `BaseLayout.astro`
3. Tailwind classes and inline styles within each component
4. Film grain on `html::after` in `global.css`

No structural changes to pages, layouts, or content collections.

---

## Files to Modify

| File                                    | Change                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `astro.config.mjs`                      | Add `fontProviders` import + Space Mono `fonts` config                  |
| `src/styles/global.css`                 | Update tokens, add film grain, reset border-radius, set font-family     |
| `src/layouts/BaseLayout.astro`          | Add `Font` import + `<Font>` tag, remove `focus:rounded` from skip link |
| `src/components/SiteNavbar.astro`       | Restyle per spec, replace active border with `::after` underline        |
| `src/components/HeroSection.astro`      | Restyle per spec, remove logo image import and render                   |
| `src/components/InfoCards.astro`        | Restyle per spec, remove gap, switch top-borders to left-borders        |
| `src/components/TournamentCard.astro`   | Restyle per spec                                                        |
| `src/components/TournamentList.astro`   | Restyle per spec, add row hover effect                                  |
| `src/components/InstagramFeed.astro`    | Remove rounded corners, add `border: 1px solid #222`                    |
| `src/components/SiteFooter.astro`       | Restyle per spec                                                        |
| `src/components/SupportedVendors.astro` | Remove rounded corners, add bordered grid                               |
| `src/pages/about.astro`                 | Restyle per content page spec                                           |
| `src/pages/play.astro`                  | Restyle per content page spec                                           |
| `src/pages/coc.astro`                   | Restyle per content page spec                                           |
| `src/pages/tournaments/index.astro`     | Restyle page wrapper per content page spec                              |
| `src/pages/tournaments/[id].astro`      | Restyle per content page spec                                           |
| `src/pages/404.astro`                   | Restyle to match global style                                           |
