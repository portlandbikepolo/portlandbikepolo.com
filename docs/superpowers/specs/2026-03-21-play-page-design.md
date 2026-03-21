# /play Page Design

**Date:** 2026-03-21
**Branch:** astro_refactor

## Overview

Expand the `/play` page from its current stub into a useful beginner guide. The page helps newcomers understand what bike polo is, when and where to show up, what to bring, and where to buy gear.

## Content Sections

Stacked single-column layout (`max-w-2xl mx-auto`), consistent with the existing About page.

1. **Page header** — `// Get Involved` label + `Play` h1 (uppercase via CSS `uppercase` class)
2. **Intro** — beginner-friendly overview of hardcourt bike polo (welcoming tone)
3. **When & Where** — pickup schedule list + `map.png` displayed below as a `<figure>` with location address as `<figcaption>`
4. **What to Bring** — equipment list (helmet, bike; mallet optional for first-timers)
5. **What Kind of Bike** — short prose on what bikes work, plus a featured frame callout linking to the Enforcer 13
6. **Get Your Gear** — Hecklers Alley featured callout: logo, blurb text, site link, and a styled CTA link to the Complete Mallet product

## Keystatic Schema

The `play` singleton in `keystatic/singletons.ts` is expanded. The existing `content` markdoc field is replaced. `intro` becomes the new `contentField`.

Updated `format`:
```ts
format: { contentField: "intro" }
```

### Fields

| Field | Keystatic type | Purpose |
|---|---|---|
| `intro` | `fields.markdoc` | Beginner overview — designated `contentField` |
| `schedule` | `fields.array(fields.object({ day: fields.text({ label: "Day" }), description: fields.text({ label: "Description" }) }), { label: "Schedule", itemLabel: (props) => props.fields.day.value ?? "Day" })` | Pickup days and descriptions |
| `location` | `fields.object({ name: fields.text({ label: "Venue name" }), address: fields.text({ label: "Address" }) })` | Venue name and address shown under the map |
| `equipment` | `fields.text({ label: "Equipment", multiline: true })` | Plain text equipment list (rendered with `whitespace-pre-line`) |
| `bikeType` | `fields.text({ label: "Bike type", multiline: true })` | Plain text bike guidance (rendered with `whitespace-pre-line`) |
| `hecklersAlleyBlurb` | `fields.text({ label: "Hecklers Alley blurb", multiline: true })` | Short plain-text vendor callout |

**Hardcoded in `.astro`** (not CMS-managed):
- `map.png` — imported from `@assets/images/map.png`, alt: `"Map of Alberta Park in Portland, OR"`
- Hecklers Alley logo — imported from `@assets/images/brands/hecklers_alley.webp`, alt: `"Hecklers Alley"`, displayed at `height={48}` with `class="h-12 w-auto"`
- Hecklers Alley site URL: `https://hecklersalley.com/`
- Complete Mallet product URL: `https://hecklersalley.com/collections/mallet-parts/products/complete-mallet?variant=41418374217791`
- Product name: `Complete Setup Bike Polo Mallet`
- Enforcer 13 frame URL: `https://www.enforcerbikes.com/enforcer-13`
- Product name: `Enforcer 13`
- Enforcer Bikes site URL: `https://www.enforcerbikes.com/`

## Implementation

### Files to modify

- `keystatic/singletons.ts` — expand `play` singleton schema, set `format: { contentField: "intro" }`
- `src/content/play/index.mdoc` — rewrite with new frontmatter fields and initial content
- `src/pages/play.astro` — rebuild page using both `createReader` and `getEntry` + `render()`
- `src/content.config.ts` — no changes needed

### `play.astro` data access

Two APIs are used, following patterns already established in the codebase:

```ts
import { Image } from "astro:assets";
import { getEntry, render } from "astro:content";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import mapImage from "@assets/images/map.png";
import hecklersLogo from "@assets/images/brands/hecklers_alley.webp";

// Structured fields — via Keystatic reader (same pattern as index.astro)
const reader = createReader(process.cwd(), keystaticConfig);
const playData = await reader.singletons.play.read();
if (!playData) throw new Error("Play content not found");

// Intro markdoc — via Astro content collection (same pattern as about.astro)
// Slug follows the same established pattern: about/index.mdoc → "about", play/index.mdoc → "play"
const entry = await getEntry("keystatic", "play");
if (!entry) throw new Error("Play entry not found");
const { Content: Intro } = await render(entry);
```

`playData` provides: `schedule`, `location`, `equipment`, `bikeType`, `hecklersAlleyBlurb`
`Intro` provides: the rendered markdoc intro component

### Template structure

```astro
<BaseLayout title="Play — Portland Bike Polo">
  <div class="max-w-2xl mx-auto px-4 py-16">

    <!-- header -->
    <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Get Involved</p>
    <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-8">Play</h1>

    <!-- intro -->
    <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none mb-12">
      <Intro />
    </div>

    <!-- when & where -->
    <section class="mb-12">
      <p class="text-fog text-xs font-bold uppercase tracking-[0.2em] mb-4">// When & Where</p>
      <ul class="text-mist text-sm leading-relaxed list-none flex flex-col gap-1 mb-6">
        {playData.schedule.map(({ day, description }) => (
          <li><span class="text-fog">{day}</span> — {description}</li>
        ))}
      </ul>
      <figure>
        <Image src={mapImage} alt="Map of Alberta Park in Portland, OR" class="w-full rounded" />
        <figcaption class="text-fog text-xs mt-2">
          {playData.location.name} — {playData.location.address}
        </figcaption>
      </figure>
    </section>

    <!-- what to bring -->
    <section class="mb-12">
      <p class="text-fog text-xs font-bold uppercase tracking-[0.2em] mb-4">// What to Bring</p>
      <p class="text-fog text-sm leading-relaxed whitespace-pre-line">{playData.equipment}</p>
    </section>

    <!-- what kind of bike -->
    <section class="mb-12">
      <p class="text-fog text-xs font-bold uppercase tracking-[0.2em] mb-4">// What Kind of Bike</p>
      <p class="text-fog text-sm leading-relaxed whitespace-pre-line mb-6">{playData.bikeType}</p>
      <!-- Enforcer 13 featured frame callout -->
      <div class="border-l-[3px] border-[#333] p-6 flex flex-col gap-3">
        <p class="text-fog text-xs font-bold uppercase tracking-[0.2em]">Featured Frame</p>
        <p class="text-mist font-bold">Enforcer 13</p>
        <a href="https://www.enforcerbikes.com/enforcer-13"
           target="_blank" rel="noopener noreferrer"
           class="text-accent text-xs font-bold uppercase tracking-[0.1em]">
          View at Enforcer Bikes →
        </a>
      </div>
    </section>

    <!-- get your gear -->
    <section class="border-l-[3px] border-accent p-8 flex flex-col gap-5">
      <p class="text-fog text-xs font-bold uppercase tracking-[0.2em]">// Get Your Gear</p>
      <Image src={hecklersLogo} alt="Hecklers Alley" height={48} class="h-12 w-auto" />
      <p class="text-fog text-sm leading-relaxed">{playData.hecklersAlleyBlurb}</p>
      <a href="https://hecklersalley.com/"
         target="_blank" rel="noopener noreferrer"
         class="text-accent text-xs font-bold uppercase tracking-[0.1em]">
        Shop Hecklers Alley →
      </a>
      <a href="https://hecklersalley.com/collections/mallet-parts/products/complete-mallet?variant=41418374217791"
         target="_blank" rel="noopener noreferrer"
         class="text-accent text-xs font-bold uppercase tracking-[0.1em]">
        Complete Setup Bike Polo Mallet →
      </a>
    </section>

  </div>
</BaseLayout>
```

### `src/content/play/index.mdoc` frontmatter shape

```yaml
---
schedule:
  - day: Fridays
    description: Afternoon pick-up, all levels welcome
  - day: Saturdays
    description: Afternoon, pro-level
  - day: Sundays
    description: General pick-up, all welcome
location:
  name: Alberta Park
  address: NE Killingsworth St & NE 22nd Ave, Portland, OR
equipment: |
  Helmet (required)
  Bike (any type — see below)
  Mallet (optional for first visit — we have loaners)
bikeType: |
  Any bike works for pick-up. Fixed gear and single-speed bikes are most common,
  but geared bikes, mountain bikes, and beater bikes are all welcome.
  Remove reflectors and anything that can snag a mallet.
hecklersAlleyBlurb: |
  Hecklers Alley is our go-to shop for bike polo gear. Based in the polo community,
  they stock mallets, balls, and everything you need to get started.
---

Hardcourt bike polo is a fast-paced, welcoming sport played on bikes in a fenced court.
Come as you are — no experience needed. Show up, grab a loaner mallet, and jump in.
```

## Out of Scope

- No new components (everything in `play.astro`)
- No changes to `InfoCards.astro` or the homepage teaser
