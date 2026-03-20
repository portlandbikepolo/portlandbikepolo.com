// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  output: "static",

  experimental: {
    fonts: [],
  },

  integrations: [react(), markdoc(), keystatic()],
});
