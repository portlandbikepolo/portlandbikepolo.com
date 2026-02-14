import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const keystatic = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content" }),
  schema: z.object({}),
});

const tournaments = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/tournaments" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cover: image(),
      startDate: z.date(),
      endDate: z.date(),
      venue: z.string(),
    }),
});

export const collections = { keystatic, tournaments };
