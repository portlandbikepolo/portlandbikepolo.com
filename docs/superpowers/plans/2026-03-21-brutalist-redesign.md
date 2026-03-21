# Brutalist Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the entire Portland Bike Polo site to a brutalist aesthetic — pure dark background, warm cream text, monospace typography (Space Mono), stark borders, film grain texture, and four CSS hover effects.

**Architecture:** Token-swap + restyle approach — all existing Astro component structure, data fetching, and logic stays intact. Only CSS custom properties, Tailwind classes, and inline styles change. Font loaded via Astro's built-in font system. No new files created, no structural changes to pages or content collections.

**Tech Stack:** Astro 5.17, Tailwind CSS v4, Space Mono via `astro:fonts` / `fontProviders.google()`

---

## Verification commands

Each task ends with a build check. Run from the project root:

```bash
# Type-check + build (full verification)
npm run build

# Dev server for visual inspection
npm run dev
```

`npm run build` runs `astro check && astro build`. A passing build means no TypeScript errors and no broken imports.

---

## Task 1: Design tokens, global CSS, and font setup

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`

This task establishes the foundation everything else builds on. Do this first — subsequent tasks restyle components using the updated tokens.

- [ ] **Step 1: Add Space Mono font to astro.config.mjs**

  Add `fontProviders` to the import and a `fonts` array as a top-level key:

  ```js
  // astro.config.mjs
  import { defineConfig, fontProviders } from "astro/config";
  import tailwindcss from "@tailwindcss/vite";
  import react from "@astrojs/react";
  import markdoc from "@astrojs/markdoc";
  import keystatic from "@keystatic/astro";
  import cloudflare from "@astrojs/cloudflare";

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
    vite: {
      plugins: [tailwindcss()],
    },
    integrations: [react(), markdoc(), keystatic()],
  });
  ```

- [ ] **Step 2: Add Font preload to BaseLayout.astro**

  Add the import and `<Font>` tag in `<head>`. Also remove `focus:rounded` from the skip link (global `border-radius: 0` makes it redundant):

  ```astro
  ---
  import SiteNavbar from "@components/SiteNavbar.astro";
  import SiteFooter from "@components/SiteFooter.astro";
  import { Font } from "astro:fonts";
  import "@styles/global.css";

  interface Props {
    title?: string;
    description?: string;
  }

  const {
    title = "Portland Bike Polo",
    description = "Hardcourt bike polo in Portland, Oregon. All skill levels welcome.",
  } = Astro.props;

  const canonicalURL = new URL(Astro.url.pathname, Astro.site);
  ---

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalURL} />
      <title>{title}</title>
      <Font cssVariable="--font-mono" preload />
    </head>
    <body class="bg-bg text-mist">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to main content
      </a>

      <SiteNavbar />

      <main id="main-content">
        <slot />
      </main>

      <SiteFooter />
    </body>
  </html>
  ```

- [ ] **Step 3: Update global.css — tokens, font, grain, border-radius reset**

  Replace the entire `global.css` content:

  ```css
  /* src/styles/global.css */
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  @plugin "@tailwindcss/forms";

  @theme {
    --color-bg: #080808;
    --color-surface: #111111;
    --color-mist: #f5ede0;
    --color-fog: #8a7a6a;
    --color-accent: #d4842a;
    --color-teal: #5a9eae;
    --font-mono: var(--font-space-mono), monospace;
  }

  *,
  *::before,
  *::after {
    border-radius: 0 !important;
  }

  html {
    background-color: var(--color-bg);
    color: var(--color-mist);
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

  /* Visually hidden but focusable — for skip link */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0.5rem 1rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
  ```

  Note: Astro's font system exposes the CSS variable as `--font-space-mono` (kebab-cased font name). The `--font-mono` theme token references it.

- [ ] **Step 4: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes with no errors. If you see a `Font` import error, confirm Astro version is 5.7+ (`cat package.json | grep '"astro"'`).

- [ ] **Step 5: Commit**

  ```bash
  git add astro.config.mjs src/styles/global.css src/layouts/BaseLayout.astro
  git commit -m "feat: add Space Mono font and brutalist design tokens"
  ```

---

## Task 2: SiteNavbar

**Files:**
- Modify: `src/components/SiteNavbar.astro`

Key changes: white bottom border, cream logo, remove Tailwind active-border classes, replace with CSS `::after` underline slide effect, mobile menu border treatment.

- [ ] **Step 1: Replace SiteNavbar.astro**

  ```astro
  ---
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/play", label: "Play" },
    { href: "/tournaments", label: "Tournaments" },
  ];

  const currentPath = Astro.url.pathname;
  ---

  <header class="sticky top-0 z-40 bg-bg border-b-2 border-mist">
    <nav
      aria-label="Main navigation"
      class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
    >
      <a
        href="/"
        class="text-mist font-bold text-sm uppercase tracking-[0.2em] hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Portland Bike Polo
      </a>

      <!-- Desktop nav -->
      <ul class="hidden md:flex gap-8 list-none" role="list">
        {
          navLinks.map(({ href, label }) => (
            <li>
              <a
                href={href}
                aria-current={currentPath.startsWith(href) ? "page" : undefined}
                class="nav-link text-fog text-sm tracking-wide uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {label}
              </a>
            </li>
          ))
        }
      </ul>

      <!-- Mobile hamburger -->
      <button
        id="menu-btn"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Open navigation menu"
        class="md:hidden p-2 text-fog hover:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <svg id="icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg id="icon-close" class="hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div
      id="mobile-menu"
      class="hidden md:hidden fixed inset-0 top-16 bg-bg z-30 flex flex-col p-8 gap-0"
    >
      {
        navLinks.map(({ href, label }) => (
          <a
            href={href}
            aria-current={currentPath.startsWith(href) ? "page" : undefined}
            class="text-mist text-2xl font-bold tracking-wide uppercase border-b border-[#1a1a1a] py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent aria-[current=page]:text-accent"
          >
            {label}
          </a>
        ))
      }
      <p class="text-fog text-xs uppercase tracking-[0.15em] mt-auto">
        Alberta Park · Portland, OR
      </p>
    </div>
  </header>

  <style>
    .nav-link {
      position: relative;
      padding-bottom: 3px;
      transition: color 0.2s ease;
      color: var(--color-fog);
    }
    .nav-link:hover {
      color: var(--color-mist);
    }
    .nav-link[aria-current="page"] {
      color: var(--color-accent);
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
  </style>

  <script>
    const btn = document.getElementById("menu-btn")!;
    const menu = document.getElementById("mobile-menu")!;
    const iconOpen = document.getElementById("icon-open")!;
    const iconClose = document.getElementById("icon-close")!;

    function openMenu() {
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close navigation menu");
      menu.classList.remove("hidden");
      iconOpen.classList.add("hidden");
      iconClose.classList.remove("hidden");
      trapFocus(menu);
    }

    function closeMenu() {
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open navigation menu");
      menu.classList.add("hidden");
      iconOpen.classList.remove("hidden");
      iconClose.classList.add("hidden");
      btn.focus();
    }

    btn.addEventListener("click", () => {
      btn.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });

    function trapFocus(el: HTMLElement) {
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest("[hidden]"));

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      first?.focus();

      el.addEventListener("keydown", function handler(e: KeyboardEvent) {
        if (e.key !== "Tab") return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
        if (menu.classList.contains("hidden")) {
          el.removeEventListener("keydown", handler);
        }
      });
    }
  </script>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. Visually: nav has white bottom border, logo is cream, links have underline-slide on hover.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/SiteNavbar.astro
  git commit -m "feat: restyle SiteNavbar to brutalist design"
  ```

---

## Task 3: HeroSection

**Files:**
- Modify: `src/components/HeroSection.astro`

Key changes: remove logo image, darken overlay, add accent left-border stripe on text block, update eyebrow text, update button styles.

- [ ] **Step 1: Replace HeroSection.astro**

  ```astro
  ---
  import { getImage } from "astro:assets";
  import heroBg from "@assets/images/polo/polo_01.webp";

  const optimizedBg = await getImage({
    src: heroBg,
    format: "webp",
    width: 1920,
  });
  ---

  <section
    class="relative flex items-center justify-center min-h-svh md:min-h-[80vh]"
    style={`background-image: url('${optimizedBg.src}'); background-size: cover; background-position: center;`}
    aria-label="Hero"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/75" aria-hidden="true"></div>

    <!-- Content -->
    <div
      class="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col gap-4 items-start"
    >
      <div class="border-l-[5px] border-accent pl-5 flex flex-col gap-4">
        <p class="text-accent text-xs font-bold tracking-[0.3em] uppercase">
          // PORTLAND, OREGON · EST. 2007
        </p>

        <h1
          class="text-mist font-bold uppercase leading-none"
          style="font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 0.95;"
        >
          Hardcourt<br />Bike Polo
        </h1>

        <p class="text-fog text-base max-w-md" style="line-height: 1.8;">
          We play every week at Alberta Park. All skill levels welcome — just bring
          a bike and a helmet.
        </p>

        <div class="flex flex-wrap gap-3 mt-2">
          <a
            href="/play"
            class="btn-primary bg-accent text-bg px-6 py-3 text-sm font-bold uppercase tracking-widest
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist"
          >
            Come Play →
          </a>
          <a
            href="/tournaments"
            class="btn-ghost border border-[#333] text-fog px-6 py-3 text-sm font-bold uppercase tracking-widest relative overflow-hidden
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist"
          >
            <span class="relative z-10">Tournaments</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <style>
    .btn-primary {
      transition: background-color 0.2s ease;
    }
    .btn-primary:hover {
      background-color: #e89a3a;
    }

    .btn-ghost::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--color-mist);
      transform: translateX(-101%);
      transition: transform 0.25s ease;
      z-index: 0;
    }
    .btn-ghost:hover::before {
      transform: translateX(0);
    }
    .btn-ghost:hover {
      color: var(--color-bg);
      border-color: var(--color-mist);
    }
  </style>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. No `logo` import errors. Visually: hero has orange left-border stripe, no logo image, darker overlay, ghost button wipes cream on hover.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/HeroSection.astro
  git commit -m "feat: restyle HeroSection to brutalist design"
  ```

---

## Task 4: InfoCards

**Files:**
- Modify: `src/components/InfoCards.astro`

Key changes: remove `gap-4` and `rounded-sm`, switch from top-borders to left-borders, add card hover effect via `<style>`.

- [ ] **Step 1: Replace InfoCards.astro**

  ```astro
  ---
  import { Image } from "astro:assets";
  import { getCollection } from "astro:content";

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const allTournaments = await getCollection("tournaments");
  const nextTournament = allTournaments
    .filter((t) => new Date(t.data.startDate) >= today)
    .sort(
      (a, b) =>
        new Date(a.data.startDate).getTime() -
        new Date(b.data.startDate).getTime()
    )[0] ?? null;

  function formatDateRange(start: Date, end: Date): string {
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const startStr = start.toLocaleDateString("en-US", opts);
    const endStr = end.toLocaleDateString("en-US", { day: "numeric" });
    const year = end.getFullYear();
    return `${startStr}–${endStr}, ${year}`;
  }
  ---

  <section aria-label="Key information" class="max-w-6xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 border border-[#222]">

      <!-- Come Play -->
      <article class="info-card border-l-[3px] border-accent p-6 flex flex-col gap-3 md:border-r md:border-r-[#222]">
        <h2 class="text-accent text-xs font-bold uppercase tracking-[0.2em]">Come Play</h2>
        <ul class="text-mist text-sm leading-relaxed list-none flex flex-col gap-1">
          <li><span class="text-fog">Fridays</span> — afternoon pick-up, all levels</li>
          <li><span class="text-fog">Saturdays</span> — afternoon, pro-level</li>
          <li><span class="text-fog">Sundays</span> — general pick-up, all welcome</li>
        </ul>
        <p class="text-fog text-xs">Alberta Park, Portland, OR</p>
        <a
          href="/play"
          class="info-card-link text-accent text-xs font-bold mt-auto uppercase tracking-[0.1em]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          How to show up →
        </a>
      </article>

      <!-- Next Tournament -->
      <article class="info-card border-l-[3px] border-teal flex flex-col overflow-hidden md:border-r md:border-r-[#222]">
        {nextTournament?.data.cover && (
          <div class="aspect-video overflow-hidden">
            <Image
              src={nextTournament.data.cover}
              alt={nextTournament.data.title}
              width={600}
              height={338}
              class="w-full h-full object-cover"
            />
          </div>
        )}
        <div class="p-6 flex flex-col gap-3 flex-1">
          <h2 class="text-teal text-xs font-bold uppercase tracking-[0.2em]">Next Tournament</h2>
          {nextTournament ? (
            <>
              <p class="text-mist font-bold text-lg leading-tight">{nextTournament.data.title}</p>
              <p class="text-fog text-sm">
                {formatDateRange(
                  new Date(nextTournament.data.startDate),
                  new Date(nextTournament.data.endDate)
                )}
              </p>
              <p class="text-fog text-xs">{nextTournament.data.venue}</p>
              <a
                href={`/tournaments/${nextTournament.id}`}
                class="info-card-link text-teal text-xs font-bold mt-auto uppercase tracking-[0.1em]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                Details →
              </a>
            </>
          ) : (
            <p class="text-fog text-sm">Stay tuned — more tournaments coming soon.</p>
          )}
        </div>
      </article>

      <!-- What Is Bike Polo -->
      <article class="info-card border-l-[3px] border-[#333] p-6 flex flex-col gap-3">
        <h2 class="text-fog text-xs font-bold uppercase tracking-[0.2em]">What Is Bike Polo?</h2>
        <p class="text-mist text-sm leading-relaxed">
          Three players, one goal, one mallet. Hardcourt bike polo is fast,
          physical, and welcoming — played on bikes in a fenced court.
        </p>
        <a
          href="/about"
          class="info-card-link text-fog text-xs font-bold mt-auto uppercase tracking-[0.1em]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Learn more →
        </a>
      </article>

    </div>
  </section>

  <style>
    .info-card {
      transition: background-color 0.2s ease, border-left-color 0.2s ease;
    }
    .info-card:hover {
      background-color: #0d0d0d;
      border-left-color: #e89a3a;
    }
    .info-card-link {
      transition: letter-spacing 0.2s ease;
    }
    .info-card:hover .info-card-link {
      letter-spacing: 0.2em;
    }
  </style>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. Visually: cards have left-border accents, hover brightens border and opens link spacing.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/InfoCards.astro
  git commit -m "feat: restyle InfoCards to brutalist design"
  ```

---

## Task 5: TournamentCard

**Files:**
- Modify: `src/components/TournamentCard.astro`

Key changes: remove `rounded-sm`, add bordered box structure with accent header bar, keep cover image.

- [ ] **Step 1: Replace TournamentCard.astro**

  ```astro
  ---
  import { Image } from "astro:assets";
  import type { CollectionEntry } from "astro:content";

  interface Props {
    tournament: CollectionEntry<"tournaments">;
  }

  const { tournament } = Astro.props;
  const { title, cover, startDate, endDate, venue } = tournament.data;

  function formatDateRange(start: Date, end: Date): string {
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const startStr = start.toLocaleDateString("en-US", opts);
    const endStr = end.toLocaleDateString("en-US", { day: "numeric" });
    const year = end.getFullYear();
    return `${startStr}–${endStr}, ${year}`;
  }
  ---

  <article class="border border-[#222] overflow-hidden group">
    <a
      href={`/tournaments/${tournament.id}`}
      aria-label={title}
      class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <!-- Header bar -->
      <div class="bg-accent px-4 py-2 flex justify-between items-center">
        <span class="text-bg text-xs font-bold uppercase tracking-[0.15em]">Tournament</span>
        <span class="text-bg text-xs font-bold">{new Date(endDate).getFullYear()}</span>
      </div>

      <!-- Cover image -->
      <div class="aspect-video overflow-hidden">
        <Image
          src={cover}
          alt={title}
          width={600}
          height={338}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <!-- Meta -->
      <div class="border-t border-[#222]">
        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-mist font-bold text-base uppercase leading-tight">{title}</h3>
          <div class="flex gap-0 border-t border-[#222] mt-1">
            <div class="flex-1 pt-2 pr-3 border-r border-[#222]">
              <p class="text-fog text-xs uppercase tracking-[0.1em]" style="font-size: 0.6rem;">Date</p>
              <p class="text-accent text-xs font-bold uppercase tracking-wide">
                {formatDateRange(startDate, endDate)}
              </p>
            </div>
            <div class="flex-1 pt-2 pl-3">
              <p class="text-fog text-xs uppercase tracking-[0.1em]" style="font-size: 0.6rem;">Venue</p>
              <p class="text-mist text-xs font-bold">{venue}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  </article>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. Visually: tournament cards have accent header bar, bordered structure, no rounded corners.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/TournamentCard.astro
  git commit -m "feat: restyle TournamentCard to brutalist design"
  ```

---

## Task 6: TournamentList + tournaments/index page

**Files:**
- Modify: `src/components/TournamentList.astro`
- Modify: `src/pages/tournaments/index.astro`

The list uses a bordered row layout with hover stripe effect. The index page gets a page heading restyle.

- [ ] **Step 1: Replace TournamentList.astro**

  ```astro
  ---
  import { getCollection } from "astro:content";
  import TournamentCard from "@components/TournamentCard.astro";

  const tournaments = await getCollection("tournaments");

  const sorted = tournaments.sort(
    (a, b) =>
      new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime()
  );
  ---

  {sorted.length > 0 ? (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sorted.map((t) => (
        <TournamentCard tournament={t} />
      ))}
    </div>
  ) : (
    <p class="text-fog uppercase tracking-[0.1em] text-sm">No tournaments yet — check back soon.</p>
  )}
  ```

- [ ] **Step 2: Replace tournaments/index.astro**

  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  import TournamentList from "@components/TournamentList.astro";
  ---

  <BaseLayout title="Tournaments — Portland Bike Polo">
    <div class="max-w-6xl mx-auto px-4 py-16">
      <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Archive</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-10">
        Tournaments
      </h1>
      <TournamentList />
    </div>
  </BaseLayout>
  ```

- [ ] **Step 3: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. Visually: tournament grid uses card layout, index page has brutalist heading with eyebrow label.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/TournamentList.astro src/pages/tournaments/index.astro
  git commit -m "feat: restyle TournamentList and tournaments index page"
  ```

---

## Task 7: SiteFooter

**Files:**
- Modify: `src/components/SiteFooter.astro`

Key changes: `border-t-2 border-mist`, remove `bg-surface`, remove `rounded` from links, monospace uppercase treatment.

- [ ] **Step 1: Replace SiteFooter.astro**

  ```astro
  ---
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/play", label: "Play" },
    { href: "/tournaments", label: "Tournaments" },
  ];
  ---

  <footer class="bg-bg border-t-2 border-mist mt-16">
    <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">

      <!-- Nav links -->
      <nav aria-label="Footer navigation">
        <ul class="flex flex-wrap gap-6 list-none" role="list">
          {navLinks.map(({ href, label }) => (
            <li>
              <a
                href={href}
                class="text-fog hover:text-mist text-xs uppercase tracking-[0.15em] transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <!-- Instagram -->
      <a
        href="https://instagram.com/portlandbikepolo"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal hover:text-mist text-xs uppercase tracking-[0.1em] transition-colors w-fit
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        @portlandbikepolo on Instagram ↗
      </a>

      <!-- Non-profit info -->
      <div class="text-fog text-xs leading-relaxed max-w-2xl flex flex-col gap-1">
        <p>
          Portland Bike Polo is a non-profit 501(c)(3) organization focused on
          building a competitive, diverse, and inclusive bike polo community in
          the Pacific Northwest.
        </p>
        <p>Federal Tax ID: #83-3435866</p>
      </div>

      <!-- Copyright -->
      <p class="text-fog text-xs uppercase tracking-[0.1em]">© {year} Portland Bike Polo</p>
    </div>
  </footer>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes. Visually: footer has `2px` cream top border, flush dark background.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/SiteFooter.astro
  git commit -m "feat: restyle SiteFooter to brutalist design"
  ```

---

## Task 8: SupportedVendors

**Files:**
- Modify: `src/components/SupportedVendors.astro`

Key changes: remove `bg-surface`, add `border: 1px solid #222` on container, remove `rounded` from links.

- [ ] **Step 1: Replace SupportedVendors.astro**

  ```astro
  ---
  import { Image } from "astro:assets";
  import enforcerLogo from "@assets/images/brands/enforcer.svg";
  import hecklersLogo from "@assets/images/brands/hecklers_alley.webp";

  const vendors = [
    {
      name: "Enforcer Bikes",
      href: "https://www.enforcerbikes.com/",
      logo: enforcerLogo,
    },
    {
      name: "Hecklers Alley",
      href: "https://hecklersalley.com/",
      logo: hecklersLogo,
    },
  ];
  ---

  <section aria-label="Vendors we support" class="border-t border-[#222] py-12">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-fog text-xs font-bold uppercase tracking-[0.2em] mb-8 text-center">
        Vendors We Support
      </h2>
      <div class="flex flex-wrap items-center justify-center gap-10">
        {vendors.map(({ name, href, logo }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (opens in a new tab)`}
            class="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src={logo}
              alt=""
              height={48}
              class="h-12 w-auto"
            />
          </a>
        ))}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/SupportedVendors.astro
  git commit -m "feat: restyle SupportedVendors to brutalist design"
  ```

---

## Task 9: InstagramFeed

**Files:**
- Modify: `src/components/InstagramFeed.astro`

The Instagram embed uses hardcoded inline styles (Instagram's own embed code) that cannot be changed. We only update the outer container and the fallback link.

- [ ] **Step 1: Update the outer container and fallback link in InstagramFeed.astro**

  Change line 9 (`<h2>`) — update classes:
  ```astro
  <h2 class="text-mist text-2xl font-bold uppercase tracking-[0.15em] mb-8">
    Follow Along
  </h2>
  ```

  Change the container `<div>` at line 14 — remove `rounded-sm`, change `bg-surface` to `bg-bg`, add `border border-[#222]`:
  ```astro
  <div
    class="bg-bg border border-[#222] p-4 min-h-[300px] flex items-center justify-center mb-4"
    aria-label="Portland Bike Polo Instagram feed"
  >
  ```

  Change the fallback link at line 145 — remove `rounded`, update color classes:
  ```astro
  <a
    href="https://instagram.com/portlandbikepolo"
    target="_blank"
    rel="noopener noreferrer"
    class="text-teal text-xs hover:text-mist transition-colors uppercase tracking-[0.1em]
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
  >
    @portlandbikepolo on Instagram ↗
  </a>
  ```

- [ ] **Step 2: Build and verify**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/InstagramFeed.astro
  git commit -m "feat: restyle InstagramFeed container to brutalist design"
  ```

---

## Task 10: Content pages

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/play.astro`
- Modify: `src/pages/coc.astro`
- Modify: `src/pages/tournaments/[id].astro`
- Modify: `src/pages/404.astro`

All four prose pages (`about`, `play`, `coc`) share identical structure. The tournament detail page and 404 page each have minor changes.

- [ ] **Step 1: Update about.astro, play.astro, and coc.astro**

  All three have the same pattern — replace the `<h1>` and add an eyebrow label. The prose `div` stays identical.

  **about.astro:**
  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  import { getEntry, render } from "astro:content";

  const entry = await getEntry("keystatic", "about");
  if (!entry) throw new Error("About content not found");
  const { Content } = await render(entry);
  ---

  <BaseLayout title="About — Portland Bike Polo">
    <div class="max-w-2xl mx-auto px-4 py-16">
      <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Info</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-8">About</h1>
      <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
        <Content />
      </div>
    </div>
  </BaseLayout>
  ```

  **play.astro:**
  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  import { getEntry, render } from "astro:content";

  const entry = await getEntry("keystatic", "play");
  if (!entry) throw new Error("Play content not found");
  const { Content } = await render(entry);
  ---

  <BaseLayout title="Play — Portland Bike Polo">
    <div class="max-w-2xl mx-auto px-4 py-16">
      <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Get Involved</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-8">Play</h1>
      <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
        <Content />
      </div>
    </div>
  </BaseLayout>
  ```

  **coc.astro:**
  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  import { getEntry, render } from "astro:content";

  const entry = await getEntry("keystatic", "code-of-conduct");
  if (!entry) throw new Error("Code of Conduct content not found");
  const { Content } = await render(entry);
  ---

  <BaseLayout title="Code of Conduct — Portland Bike Polo">
    <div class="max-w-2xl mx-auto px-4 py-16">
      <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Community</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-8">
        Code of Conduct
      </h1>
      <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
        <Content />
      </div>
    </div>
  </BaseLayout>
  ```

- [ ] **Step 2: Update tournaments/[id].astro**

  Remove `rounded-sm` from cover image wrapper, add eyebrow label above `<h1>`, change `<hr>` to use mist border, remove `rounded` from back link:

  ```astro
  ---
  import { getCollection, render } from "astro:content";
  import { Image } from "astro:assets";
  import BaseLayout from "@layouts/BaseLayout.astro";
  import type { GetStaticPaths, InferGetStaticPropsType } from "astro";

  export const getStaticPaths = (async () => {
    const tournaments = await getCollection("tournaments");
    return tournaments.map((t) => ({
      params: { id: t.id },
      props: { tournament: t },
    }));
  }) satisfies GetStaticPaths;

  type Props = InferGetStaticPropsType<typeof getStaticPaths>;

  const { tournament } = Astro.props as Props;
  const { title, cover, startDate, endDate, venue } = tournament.data;
  const { Content } = await render(tournament);

  function formatDateRange(start: Date, end: Date): string {
    const fmt = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${fmt.format(start)} – ${new Date(end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  }
  ---

  <BaseLayout title={`${title} — Portland Bike Polo`}>
    <article class="max-w-4xl mx-auto px-4 py-16">

      <!-- Cover image -->
      <div class="aspect-video mb-8 overflow-hidden">
        <Image
          src={cover}
          alt={title}
          width={1200}
          height={675}
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Header -->
      <p class="text-fog text-xs uppercase tracking-[0.2em] mb-2">// Tournament</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight mb-3">
        {title}
      </h1>
      <p class="text-fog text-sm mb-1">
        {formatDateRange(new Date(startDate), new Date(endDate))}
      </p>
      <p class="text-fog text-sm mb-8">{venue}</p>

      <hr class="border-[#222] mb-8" />

      <!-- Body content -->
      <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent prose-strong:text-mist max-w-none">
        <Content />
      </div>

      <!-- Back link -->
      <a
        href="/tournaments"
        class="inline-block mt-12 text-fog text-xs hover:text-mist transition-colors uppercase tracking-[0.1em]
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        ← All Tournaments
      </a>
    </article>
  </BaseLayout>
  ```

- [ ] **Step 3: Update 404.astro**

  Remove `rounded` from button:

  ```astro
  ---
  import BaseLayout from "@layouts/BaseLayout.astro";
  ---

  <BaseLayout title="Page Not Found — Portland Bike Polo">
    <div class="max-w-2xl mx-auto px-4 py-32 flex flex-col items-center text-center gap-6">
      <p class="text-accent text-xs font-bold uppercase tracking-[0.2em]">404</p>
      <h1 class="text-mist text-4xl font-bold uppercase tracking-tight">
        Page Not Found
      </h1>
      <p class="text-fog">
        That page doesn't exist. Maybe it got mallet'd.
      </p>
      <a
        href="/"
        class="bg-accent text-bg px-6 py-3 text-sm font-bold uppercase tracking-widest
               hover:bg-[#e89a3a] transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist"
      >
        Go Home
      </a>
    </div>
  </BaseLayout>
  ```

- [ ] **Step 4: Build and verify**

  ```bash
  npm run build
  ```

  Expected: build passes with no errors across all pages.

- [ ] **Step 5: Commit**

  ```bash
  git add src/pages/about.astro src/pages/play.astro src/pages/coc.astro src/pages/tournaments/[id].astro src/pages/404.astro
  git commit -m "feat: restyle content pages to brutalist design"
  ```

---

## Task 11: Final verification and .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .superpowers to .gitignore**

  Add this line to `.gitignore`:
  ```
  .superpowers/
  ```

- [ ] **Step 2: Full build + dev server visual check**

  ```bash
  npm run build
  npm run dev
  ```

  Walk through all pages in the dev server and verify:
  - [ ] Homepage: grain texture visible, hero has orange stripe, cards have left-border accents
  - [ ] Nav: white bottom border, underline slides in on hover, active state shows
  - [ ] Tournaments: card grid with accent header bars
  - [ ] About / Play / CoC: eyebrow label + uppercase heading
  - [ ] Tournament detail: no rounded cover image, brutalist header
  - [ ] 404: no rounded button
  - [ ] Footer: cream top border, flush dark background
  - [ ] Space Mono loaded on all pages

- [ ] **Step 3: Commit**

  ```bash
  git add .gitignore
  git commit -m "chore: add .superpowers to .gitignore"
  ```
