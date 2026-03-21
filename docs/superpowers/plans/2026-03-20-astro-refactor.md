# Portland Bike Polo Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, accessible, mobile-first Astro static site for Portland Bike Polo with Keystatic CMS, Embla photo carousel, Instagram embed, and vendor support section.

**Architecture:** Astro static output with Tailwind v4 CSS-first config. React scoped to PhotoCarousel island (`client:visible`) and Keystatic admin only. Content managed via Keystatic singletons and collections; gallery images managed through a new `gallery` Keystatic singleton.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), Keystatic, Embla Carousel, `@astrojs/react`, `@astrojs/markdoc`

---

## File Map

| File | Action | Responsibility |
| --- | --- | --- |
| `astro.config.mjs` | Modify | Add Tailwind v4 Vite plugin |
| `src/styles/global.css` | Create | Color tokens via `@theme`, base styles, typography plugin |
| `src/layouts/BaseLayout.astro` | Create | Skip link, `<html lang>`, color token injection, nav+footer shell |
| `src/components/SiteNavbar.astro` | Create | Logo, nav links, mobile hamburger with focus trap |
| `src/components/SiteFooter.astro` | Create | Nav links, Instagram link, non-profit statement, copyright |
| `keystatic/singletons.ts` | Modify | Add `gallery` singleton schema |
| `keystatic.config.ts` | Modify | Register gallery singleton in Keystatic UI |
| `src/content/gallery/index.yaml` | Create | Initial gallery data (6 polo photos) |
| `src/components/HeroSection.astro` | Create | Full-bleed background image with overlay and CTAs |
| `src/components/InfoCards.astro` | Create | Three cards: Come Play, Next Tournament, What Is Bike Polo |
| `src/components/PhotoCarousel.tsx` | Create | Embla React island with autoplay, pause/play, keyboard nav |
| `src/components/InstagramFeed.astro` | Create | Instagram embed script + always-visible fallback link |
| `src/components/SupportedVendors.astro` | Create | Vendor logo strip (Enforcer Bikes, Hecklers Alley) |
| `src/components/TournamentCard.astro` | Create | Single tournament card with image, date, venue, link |
| `src/components/TournamentList.astro` | Create | Grid of TournamentCards, sorted, with empty state |
| `src/pages/index.astro` | Create | Homepage: assemble all sections, load gallery from Keystatic |
| `src/pages/about.astro` | Create | About page: Keystatic singleton content |
| `src/pages/play.astro` | Create | Play page: Keystatic singleton content |
| `src/pages/coc.astro` | Create | Code of Conduct page: Keystatic singleton content |
| `src/pages/tournaments/index.astro` | Create | Tournament listing page |
| `src/pages/tournaments/[id].astro` | Create | Tournament detail page |
| `src/pages/404.astro` | Create | Not found page |

---

## Task 1: Configure Tailwind v4 and global styles

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Add Tailwind Vite plugin to Astro config**

```js
// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), markdoc(), keystatic()],
});
```

- [ ] **Step 2: Create global CSS with color tokens and base styles**

```css
/* src/styles/global.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";

@theme {
  --color-bg: #1e2a30;
  --color-surface: #253540;
  --color-mist: #e8e4d8;
  --color-fog: #9ab5c2;
  --color-accent: #d4842a;
  --color-teal: #5a9eae;
}

html {
  background-color: var(--color-bg);
  color: var(--color-mist);
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

Note: In Tailwind v4 `@theme`, color tokens become utilities: `bg-bg`, `bg-surface`, `text-mist`, `text-fog`, `text-accent`, `text-teal`, `border-accent`, `border-teal`, etc.

- [ ] **Step 3: Verify Astro config compiles**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/styles/global.css
git commit -m "feat: configure tailwind v4 with color tokens"
```

---

## Task 2: Add gallery Keystatic singleton

**Files:**
- Modify: `keystatic/singletons.ts`
- Modify: `keystatic.config.ts`
- Create: `src/content/gallery/index.yaml`

- [ ] **Step 1: Add gallery singleton to `keystatic/singletons.ts`**

```ts
// keystatic/singletons.ts
import { fields, singleton } from "@keystatic/core";

// ... existing singletons (codeOfConduct, about, play) unchanged ...

const gallery = singleton({
  label: "Gallery",
  path: "src/content/gallery/",
  schema: {
    images: fields.array(
      fields.object({
        image: fields.image({
          label: "Photo",
          directory: "src/assets/images/polo",
          publicPath: "../../assets/images/polo/",
        }),
        alt: fields.text({
          label: "Alt text",
          description:
            "Describe what's happening in the photo — required for accessibility",
        }),
      }),
      {
        label: "Photos",
        itemLabel: (props) => props.fields.alt.value || "Photo",
      }
    ),
  },
});

export const singletons = { about, codeOfConduct, play, gallery };
```

- [ ] **Step 2: Register gallery in `keystatic.config.ts`**

```ts
// keystatic.config.ts
import { config } from "@keystatic/core";
import { collections } from "./keystatic/collections";
import { singletons } from "./keystatic/singletons";

export default config({
  storage: { kind: "local" },
  collections: collections,
  singletons: singletons,
  ui: {
    brand: { name: "Portland Bike Polo" },
    navigation: {
      Content: ["tournaments", "gallery"],
      Settings: ["about", "codeOfConduct", "play"],
    },
  },
});
```

- [ ] **Step 3: Create initial gallery content file**

```yaml
# src/content/gallery/index.yaml
images:
  - image: polo_01.webp
    alt: Players jostling for position during a Portland Bike Polo match
  - image: polo_02.webp
    alt: A polo player taking a shot on goal
  - image: polo_03.webp
    alt: Two players racing for the ball at midcourt
  - image: polo_04.webp
    alt: A goalie defending the net during a club match
  - image: polo_05.webp
    alt: Players clustered around the ball in tight court action
  - image: polo_06.webp
    alt: A polo player maneuvering around an opponent
```

- [ ] **Step 4: Verify types**

```bash
pnpm astro check
```

Expected: no errors

Note on `src/content.config.ts`: The gallery is read at build time via `createReader` from `@keystatic/core/reader` (see Task 10), not via `getCollection`. No changes to `content.config.ts` are required — the Keystatic reader bypasses Astro's content layer entirely for this singleton.

- [ ] **Step 5: Commit**

```bash
git add keystatic/singletons.ts keystatic.config.ts src/content/gallery/index.yaml
git commit -m "feat: add gallery Keystatic singleton with initial polo photos"
```

---

## Task 3: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import SiteNavbar from "@components/SiteNavbar.astro";
import SiteFooter from "@components/SiteFooter.astro";
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
  </head>
  <body class="bg-bg text-mist">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:rounded focus:font-bold"
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

Note: `@components/*`, `@layouts/*`, `@styles/*` path aliases are already configured in `tsconfig.json`.

- [ ] **Step 2: Verify (SiteNavbar and SiteFooter stubs needed — create empty ones first)**

Create temporary stubs so astro check passes:

```astro
<!-- src/components/SiteNavbar.astro -->
<nav aria-label="Main navigation"></nav>
```

```astro
<!-- src/components/SiteFooter.astro -->
<footer></footer>
```

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/SiteNavbar.astro src/components/SiteFooter.astro
git commit -m "feat: add BaseLayout with skip link and placeholder nav/footer"
```

---

## Task 4: SiteNavbar

**Files:**
- Modify: `src/components/SiteNavbar.astro` (replace stub)

- [ ] **Step 1: Implement SiteNavbar**

```astro
---
// src/components/SiteNavbar.astro
import { Image } from "astro:assets";
import logo from "@assets/images/logo_light_outline.svg";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/play", label: "Play" },
  { href: "/tournaments", label: "Tournaments" },
];

const currentPath = Astro.url.pathname;
---

<header class="sticky top-0 z-40 bg-surface border-b border-surface">
  <nav
    aria-label="Main navigation"
    class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
  >
    <a
      href="/"
      aria-label="Portland Bike Polo — Home"
      class="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    >
      <Image src={logo} alt="" width={120} height={40} />
    </a>

    <!-- Desktop nav -->
    <ul class="hidden md:flex gap-8 list-none" role="list">
      {
        navLinks.map(({ href, label }) => (
          <li>
            <a
              href={href}
              aria-current={currentPath.startsWith(href) ? "page" : undefined}
              class="text-fog hover:text-mist text-sm tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded
                     aria-[current=page]:text-accent aria-[current=page]:border-b-2 aria-[current=page]:border-accent pb-0.5"
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
      class="md:hidden p-2 text-fog hover:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    >
      <svg
        id="icon-open"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
      <svg
        id="icon-close"
        class="hidden"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div
    id="mobile-menu"
    class="hidden md:hidden fixed inset-0 top-16 bg-bg z-30 flex flex-col p-8 gap-6"
  >
    {
      navLinks.map(({ href, label }) => (
        <a
          href={href}
          aria-current={currentPath.startsWith(href) ? "page" : undefined}
          class="text-mist text-2xl font-bold tracking-wide uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded
                 aria-[current=page]:text-accent"
        >
          {label}
        </a>
      ))
    }
  </div>
</header>

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
      // Remove handler when menu closes
      if (menu.classList.contains("hidden")) {
        el.removeEventListener("keydown", handler);
      }
    });
  }
</script>
```

- [ ] **Step 2: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteNavbar.astro
git commit -m "feat: add SiteNavbar with mobile hamburger and focus trap"
```

---

## Task 5: SiteFooter

**Files:**
- Modify: `src/components/SiteFooter.astro` (replace stub)

- [ ] **Step 1: Implement SiteFooter**

```astro
---
// src/components/SiteFooter.astro
const year = new Date().getFullYear();

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/play", label: "Play" },
  { href: "/tournaments", label: "Tournaments" },
];
---

<footer class="bg-surface border-t border-bg mt-16">
  <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">

    <!-- Nav links -->
    <nav aria-label="Footer navigation">
      <ul class="flex flex-wrap gap-6 list-none" role="list">
        {navLinks.map(({ href, label }) => (
          <li>
            <a
              href={href}
              class="text-fog hover:text-mist text-sm uppercase tracking-wide transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
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
      class="text-teal hover:text-mist text-sm transition-colors w-fit
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    >
      Follow @portlandbikepolo on Instagram ↗
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
    <p class="text-fog text-xs">© {year} Portland Bike Polo</p>
  </div>
</footer>
```

- [ ] **Step 2: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteFooter.astro
git commit -m "feat: add SiteFooter with non-profit statement and copyright"
```

---

## Task 6: HeroSection

**Files:**
- Create: `src/components/HeroSection.astro`

- [ ] **Step 1: Create HeroSection**

```astro
---
// src/components/HeroSection.astro
import { getImage } from "astro:assets";
import heroBg from "@assets/images/polo/polo_01.webp";

const optimizedBg = await getImage({ src: heroBg, format: "webp", width: 1920 });
---

<section
  class="relative flex items-end min-h-svh md:min-h-[80vh]"
  style={`background-image: url('${optimizedBg.src}'); background-size: cover; background-position: center;`}
  aria-label="Hero"
>
  <!-- Dark overlay -->
  <div class="absolute inset-0 bg-black/60" aria-hidden="true"></div>

  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 pt-32 flex flex-col gap-4">
    <p class="text-accent text-xs font-bold tracking-[0.2em] uppercase">
      Portland, Oregon · Est. 2007
    </p>

    <h1
      class="text-mist font-black leading-none tracking-tight"
      style="font-size: clamp(2rem, 5vw, 4rem);"
    >
      Hardcourt Bike Polo<br />
      <span class="text-teal">In the Rain</span>
    </h1>

    <p class="text-fog text-lg max-w-md leading-relaxed">
      We play every week at Alberta Park. All skill levels welcome — just bring
      a bike and a helmet.
    </p>

    <div class="flex flex-wrap gap-3 mt-2">
      <a
        href="/play"
        class="bg-accent text-bg px-6 py-3 text-sm font-bold uppercase tracking-widest rounded
               hover:opacity-90 transition-opacity
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist"
      >
        Come Play
      </a>
      <a
        href="/tournaments"
        class="border border-teal text-teal px-6 py-3 text-sm font-bold uppercase tracking-widest rounded
               hover:bg-teal/10 transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        Tournaments →
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.astro
git commit -m "feat: add full-bleed HeroSection with CTAs"
```

---

## Task 7: InfoCards

**Files:**
- Create: `src/components/InfoCards.astro`

The Next Tournament card reads from the `tournaments` content collection at build time.

- [ ] **Step 1: Create InfoCards**

```astro
---
// src/components/InfoCards.astro
import { getCollection } from "astro:content";

// Get next upcoming tournament (earliest startDate >= today at build time)
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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

    <!-- Come Play -->
    <article class="bg-surface border-t-4 border-accent p-6 flex flex-col gap-3 rounded-sm">
      <h2 class="text-accent text-xs font-bold uppercase tracking-widest">Come Play</h2>
      <ul class="text-mist text-sm leading-relaxed list-none flex flex-col gap-1">
        <li><span class="text-fog">Fridays</span> — afternoon pick-up, all levels</li>
        <li><span class="text-fog">Saturdays</span> — afternoon, pro-level</li>
        <li><span class="text-fog">Sundays</span> — general pick-up, all welcome</li>
      </ul>
      <p class="text-fog text-xs">Alberta Park, Portland, OR</p>
      <a
        href="/play"
        class="text-accent text-sm font-bold mt-auto hover:underline
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        How to show up →
      </a>
    </article>

    <!-- Next Tournament -->
    <article class="bg-surface border-t-4 border-teal p-6 flex flex-col gap-3 rounded-sm">
      <h2 class="text-teal text-xs font-bold uppercase tracking-widest">Next Tournament</h2>
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
            class="text-teal text-sm font-bold mt-auto hover:underline
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
          >
            Details →
          </a>
        </>
      ) : (
        <p class="text-fog text-sm">Stay tuned — more tournaments coming soon.</p>
      )}
    </article>

    <!-- What Is Bike Polo -->
    <article class="bg-surface border-t-4 border-fog p-6 flex flex-col gap-3 rounded-sm">
      <h2 class="text-fog text-xs font-bold uppercase tracking-widest">What Is Bike Polo?</h2>
      <p class="text-mist text-sm leading-relaxed">
        Three players, one goal, one mallet. Hardcourt bike polo is fast,
        physical, and welcoming — played on bikes in a fenced court.
      </p>
      <a
        href="/about"
        class="text-fog text-sm font-bold mt-auto hover:text-mist hover:underline transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        Learn more →
      </a>
    </article>

  </div>
</section>
```

- [ ] **Step 2: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/InfoCards.astro
git commit -m "feat: add InfoCards with play schedule and next tournament"
```

---

## Task 8: PhotoCarousel

**Files:**
- Create: `src/components/PhotoCarousel.tsx`

- [ ] **Step 1: Install Embla React bindings**

`embla-carousel` and `embla-carousel-autoplay` are already installed, but the React adapter is separate:

```bash
pnpm add embla-carousel-react
```

- [ ] **Step 2: Create PhotoCarousel React component**

```tsx
// src/components/PhotoCarousel.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

export default function PhotoCarousel({ photos }: Props) {
  if (photos.length === 0) return null;

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    prefersReducedMotion ? [] : [autoplayPlugin.current]
  );

  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);

  const togglePlayback = useCallback(() => {
    const ap = emblaApi?.plugins()?.autoplay;
    if (!ap) return;
    if (ap.isPlaying()) {
      ap.stop();
      setIsPlaying(false);
    } else {
      ap.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Pause on focus within the carousel
  const handleFocus = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop();
  }, [emblaApi]);

  const handleBlur = useCallback(() => {
    if (isPlaying) emblaApi?.plugins()?.autoplay?.play();
  }, [emblaApi, isPlaying]);

  return (
    <section
      aria-label="Portland Bike Polo photo gallery"
      role="region"
      className="relative bg-bg"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleFocus}
      onMouseLeave={() => {
        if (isPlaying) emblaApi?.plugins()?.autoplay?.play();
      }}
    >
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          {photos.map((photo, i) => (
            <div key={i} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: "100%", height: "480px", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={scrollPrev}
          aria-label="Previous photo"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#e8e4d8",
            border: "none",
            width: "44px",
            height: "44px",
            fontSize: "1.5rem",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          ‹
        </button>

        {!prefersReducedMotion && (
          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            style={{
              background: "rgba(0,0,0,0.6)",
              color: "#e8e4d8",
              border: "none",
              width: "44px",
              height: "44px",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        )}

        <button
          onClick={scrollNext}
          aria-label="Next photo"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#e8e4d8",
            border: "none",
            width: "44px",
            height: "44px",
            fontSize: "1.5rem",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/PhotoCarousel.tsx
git commit -m "feat: add Embla PhotoCarousel with autoplay, pause/play, a11y controls"
```

---

## Task 9: InstagramFeed and SupportedVendors

**Files:**
- Create: `src/components/InstagramFeed.astro`
- Create: `src/components/SupportedVendors.astro`

- [ ] **Step 1: Create InstagramFeed**

```astro
---
// src/components/InstagramFeed.astro
---

<section
  aria-label="Portland Bike Polo on Instagram"
  class="max-w-6xl mx-auto px-4 py-16"
>
  <h2 class="text-mist text-2xl font-black uppercase tracking-wider mb-8">
    Follow Along
  </h2>

  <!-- Instagram embed — replace with an official embed block from instagram.com/portlandbikepolo -->
  <div
    class="bg-surface rounded-sm p-4 min-h-[300px] flex items-center justify-center mb-4"
    aria-label="Portland Bike Polo Instagram feed"
  >
    <!-- Paste official Instagram embed code here.
         Example using blockquote embed from instagram.com:
         1. Go to any post on @portlandbikepolo
         2. Click ··· > Embed
         3. Copy the blockquote + script tag and paste here -->
    <p class="text-fog text-sm">Instagram feed goes here</p>
  </div>

  <!-- Always-visible fallback link -->
  <a
    href="https://instagram.com/portlandbikepolo"
    target="_blank"
    rel="noopener noreferrer"
    class="text-teal text-sm hover:text-mist transition-colors
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
  >
    @portlandbikepolo on Instagram ↗
  </a>

  <script async src="//www.instagram.com/embed.js"></script>
</section>
```

- [ ] **Step 2: Create SupportedVendors**

```astro
---
// src/components/SupportedVendors.astro
import { Image } from "astro:assets";
import enforcerLogo from "@assets/images/brands/enforcer.svg";
import hecklersLogo from "@assets/images/brands/hecklers_alley.webp";

const vendors = [
  {
    name: "Enforcer Bikes",
    href: "https://www.enforcerbikes.com/",
    logo: enforcerLogo,
    isWebp: false,
  },
  {
    name: "Hecklers Alley",
    href: "https://hecklersalley.com/",
    logo: hecklersLogo,
    isWebp: true,
  },
];
---

<section
  aria-label="Vendors we support"
  class="bg-surface py-12"
>
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-fog text-xs font-bold uppercase tracking-widest mb-8 text-center">
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
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
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

- [ ] **Step 3: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/InstagramFeed.astro src/components/SupportedVendors.astro
git commit -m "feat: add InstagramFeed and SupportedVendors components"
```

---

## Task 10: Homepage

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create homepage, reading gallery from Keystatic**

Gallery images live in `src/assets/` and are processed by Vite — they cannot be referenced as plain paths from a React island. Use `import.meta.glob` to eagerly import all polo images, then `getImage()` to get their build-time-resolved URLs, then pass those to the React carousel.

```astro
---
// src/pages/index.astro
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroSection from "@components/HeroSection.astro";
import InfoCards from "@components/InfoCards.astro";
import PhotoCarousel from "@components/PhotoCarousel";
import InstagramFeed from "@components/InstagramFeed.astro";
import SupportedVendors from "@components/SupportedVendors.astro";
import { createReader } from "@keystatic/core/reader";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);
const gallery = await reader.singletons.gallery.read();

// Eagerly import all polo images so Vite processes them
const poloImages = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/polo/*.{webp,jpg,jpeg,png}",
  { eager: true }
);

// Resolve each gallery entry to an optimized URL
const photos = (
  await Promise.all(
    (gallery?.images ?? []).map(async (img) => {
      const key = `../assets/images/polo/${img.image}`;
      const mod = poloImages[key];
      if (!mod) return null;
      const optimized = await getImage({ src: mod.default, width: 1200, format: "webp" });
      return { src: optimized.src, alt: img.alt };
    })
  )
).filter((p): p is { src: string; alt: string } => p !== null);
---

<BaseLayout>
  <HeroSection />
  <InfoCards />
  <PhotoCarousel photos={photos} client:visible />
  <InstagramFeed />
  <SupportedVendors />
</BaseLayout>
```

- [ ] **Step 2: Run build to verify full page renders**

```bash
pnpm build
```

Expected: build completes with no errors. Check `dist/index.html` exists.

- [ ] **Step 3: Spot-check in dev**

```bash
pnpm dev
```

Open `http://localhost:4321` and verify:
- Hero renders with background image and overlay
- Three info cards show, Next Tournament populates or shows fallback
- Carousel section present
- Instagram section present
- Vendor logos present in footer strip

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble homepage with all sections"
```

---

## Task 11: Content pages (About, Play, Code of Conduct)

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/play.astro`
- Create: `src/pages/coc.astro`

All three follow the same pattern. Create them together.

- [ ] **Step 1: Create about.astro**

```astro
---
// src/pages/about.astro
import BaseLayout from "@layouts/BaseLayout.astro";
import { getEntry, render } from "astro:content";

const entry = await getEntry("keystatic", "about/index");
if (!entry) throw new Error("About content not found");
const { Content } = await render(entry);
---

<BaseLayout title="About — Portland Bike Polo">
  <div class="max-w-2xl mx-auto px-4 py-16">
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight mb-8">About</h1>
    <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
      <Content />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create play.astro**

```astro
---
// src/pages/play.astro
import BaseLayout from "@layouts/BaseLayout.astro";
import { getEntry, render } from "astro:content";

const entry = await getEntry("keystatic", "play/index");
if (!entry) throw new Error("Play content not found");
const { Content } = await render(entry);
---

<BaseLayout title="Play — Portland Bike Polo">
  <div class="max-w-2xl mx-auto px-4 py-16">
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight mb-8">Play</h1>
    <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
      <Content />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create coc.astro**

```astro
---
// src/pages/coc.astro
import BaseLayout from "@layouts/BaseLayout.astro";
import { getEntry, render } from "astro:content";

const entry = await getEntry("keystatic", "code-of-conduct/index");
if (!entry) throw new Error("Code of Conduct content not found");
const { Content } = await render(entry);
---

<BaseLayout title="Code of Conduct — Portland Bike Polo">
  <div class="max-w-2xl mx-auto px-4 py-16">
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight mb-8">
      Code of Conduct
    </h1>
    <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent max-w-none">
      <Content />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Run type check and build**

```bash
pnpm astro check && pnpm build
```

Expected: no errors, all three pages in `dist/`

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/play.astro src/pages/coc.astro
git commit -m "feat: add About, Play, and Code of Conduct content pages"
```

---

## Task 12: TournamentCard and TournamentList

**Files:**
- Create: `src/components/TournamentCard.astro`
- Create: `src/components/TournamentList.astro`

- [ ] **Step 1: Create TournamentCard**

```astro
---
// src/components/TournamentCard.astro
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

<article class="bg-surface rounded-sm overflow-hidden group">
  <a
    href={`/tournaments/${tournament.id}`}
    aria-label={title}
    class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
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
    <div class="p-5 flex flex-col gap-2">
      <p class="text-accent text-xs font-bold uppercase tracking-widest">
        {formatDateRange(new Date(startDate), new Date(endDate))}
      </p>
      <h3 class="text-mist font-bold text-lg leading-tight">{title}</h3>
      <p class="text-fog text-sm">{venue}</p>
    </div>
  </a>
</article>
```

- [ ] **Step 2: Create TournamentList**

```astro
---
// src/components/TournamentList.astro
import { getCollection } from "astro:content";
import TournamentCard from "@components/TournamentCard.astro";

const tournaments = await getCollection("tournaments");

// Sort descending: newest startDate first (archive view)
const sorted = tournaments.sort(
  (a, b) =>
    new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime()
);
---

{sorted.length > 0 ? (
  <ul
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
    role="list"
  >
    {sorted.map((t) => (
      <li>
        <TournamentCard tournament={t} />
      </li>
    ))}
  </ul>
) : (
  <p class="text-fog">No tournaments yet — check back soon.</p>
)}
```

- [ ] **Step 3: Run type check**

```bash
pnpm astro check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/TournamentCard.astro src/components/TournamentList.astro
git commit -m "feat: add TournamentCard and TournamentList components"
```

---

## Task 13: Tournament pages

**Files:**
- Create: `src/pages/tournaments/index.astro`
- Create: `src/pages/tournaments/[id].astro`

- [ ] **Step 1: Create tournament index page**

```astro
---
// src/pages/tournaments/index.astro
import BaseLayout from "@layouts/BaseLayout.astro";
import TournamentList from "@components/TournamentList.astro";
---

<BaseLayout title="Tournaments — Portland Bike Polo">
  <div class="max-w-6xl mx-auto px-4 py-16">
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight mb-10">
      Tournaments
    </h1>
    <TournamentList />
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create tournament detail page**

```astro
---
// src/pages/tournaments/[id].astro
import { getCollection, render } from "astro:content";
import { Image } from "astro:assets";
import BaseLayout from "@layouts/BaseLayout.astro";
import type { GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const tournaments = await getCollection("tournaments");
  return tournaments.map((t) => ({
    params: { id: t.id },
    props: { tournament: t },
  }));
};

const { tournament } = Astro.props;
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
    <div class="aspect-video mb-8 overflow-hidden rounded-sm">
      <Image
        src={cover}
        alt={title}
        width={1200}
        height={675}
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Header -->
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight mb-3">
      {title}
    </h1>
    <p class="text-fog text-sm mb-1">
      {formatDateRange(new Date(startDate), new Date(endDate))}
    </p>
    <p class="text-fog text-sm mb-8">{venue}</p>

    <hr class="border-surface mb-8" />

    <!-- Body content -->
    <div class="prose prose-invert prose-p:text-fog prose-headings:text-mist prose-a:text-accent prose-strong:text-mist max-w-none">
      <Content />
    </div>

    <!-- Back link -->
    <a
      href="/tournaments"
      class="inline-block mt-12 text-fog text-sm hover:text-mist transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    >
      ← All Tournaments
    </a>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Run type check and build**

```bash
pnpm astro check && pnpm build
```

Expected: no errors; `dist/tournaments/index.html` and individual tournament pages exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tournaments/index.astro src/pages/tournaments/[id].astro
git commit -m "feat: add tournament index and detail pages"
```

---

## Task 14: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create 404 page**

```astro
---
// src/pages/404.astro
import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout title="Page Not Found — Portland Bike Polo">
  <div class="max-w-2xl mx-auto px-4 py-32 flex flex-col items-center text-center gap-6">
    <p class="text-accent text-xs font-bold uppercase tracking-widest">404</p>
    <h1 class="text-mist text-4xl font-black uppercase tracking-tight">
      Page Not Found
    </h1>
    <p class="text-fog">
      That page doesn't exist. Maybe it got mallet'd.
    </p>
    <a
      href="/"
      class="bg-accent text-bg px-6 py-3 text-sm font-bold uppercase tracking-widest rounded
             hover:opacity-90 transition-opacity
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist"
    >
      Go Home
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Run final build**

```bash
pnpm build
```

Expected: clean build, no TypeScript errors, no missing asset errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

## Task 15: Final verification

- [ ] **Step 1: Run full type check**

```bash
pnpm astro check
```

Expected: 0 errors

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

Expected: clean build

- [ ] **Step 3: Preview production build and verify checklist**

```bash
pnpm preview
```

Open `http://localhost:4321` and verify:

**Homepage:**
- [ ] Skip link appears on focus (Tab from address bar)
- [ ] Sticky nav visible, logo links to home
- [ ] Mobile hamburger opens/closes, Escape closes, focus trap works
- [ ] Hero photo fills viewport, text legible over overlay
- [ ] Three info cards render with correct schedule and tournament data
- [ ] Photo carousel renders, prev/next work, pause/play toggles autoplay
- [ ] Instagram section visible with fallback link
- [ ] Vendor logos present, grayscale → color on hover
- [ ] Footer has nav links, Instagram link, non-profit statement, tax ID, copyright year

**Other pages:**
- [ ] `/about`, `/play`, `/coc` — content renders, heading hierarchy correct
- [ ] `/tournaments` — tournament cards grid renders
- [ ] `/tournaments/[id]` — detail page with cover image and content
- [ ] `/404` — navigate to a bad URL, custom page shows

**Accessibility:**
- [ ] Tab through all interactive elements — focus rings visible on all
- [ ] `aria-current="page"` correct on active nav link
- [ ] Screen reader test: skip link, nav landmark, main landmark, footer landmark

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Portland Bike Polo site refactor"
```
