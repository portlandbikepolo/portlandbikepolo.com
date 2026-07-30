// astro.config.mjs
// @ts-check
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
  experimental: {
    fonts: [
      {
        // Space Grotesk is the site's sole typeface (sibling of the outgoing
        // Space Mono — keeps a thread to the prior identity). Variable weight
        // range 300–700 ships as a single self-hosted file per subset.
        provider: fontProviders.google(),
        name: "Space Grotesk",
        cssVariable: "--font-space-grotesk",
        weights: ["300 700"],
        styles: ["normal"],
        display: "swap",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    markdoc(),
    ...(process.env.SKIP_KEYSTATIC ? [] : [keystatic()]),
  ],
});
