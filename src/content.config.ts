import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const keystatic = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content" }),
  schema: z.object({}),
});

export const collections = { keystatic };
