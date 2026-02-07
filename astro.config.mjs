import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	output: "static",

  experimental: {
    fonts: [
      {
        name: "Inter",
        cssVariable: "--ff-inter",
        provider: fontProviders.fontsource(),
        weights: [400, 700],
      },
    ],
  },

  integrations: [react(), markdoc(), keystatic()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});