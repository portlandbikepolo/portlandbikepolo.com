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
        provider: fontProviders.google(),
        name: "Space Mono",
        cssVariable: "--font-mono",
        weights: [400, 700],
        styles: ["normal"],
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), markdoc(), keystatic()],
});
