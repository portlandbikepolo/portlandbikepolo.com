import { fields, collection } from "@keystatic/core";

const tournaments = collection({
  label: "Tournaments",
  slugField: "title",
  path: "src/content/tournaments/*/",
  entryLayout: "content",
  format: { contentField: "content" },
  columns: ["startDate"],
  schema: {
    title: fields.slug({ name: { label: "Title" } }),
    cover: fields.image({
      label: "Cover",
      description: "Promo image",
    }),
    startDate: fields.date({
      label: "Start Date",
    }),
    endDate: fields.date({
      label: "End Date",
    }),
    venue: fields.text({
      label: "Location",
    }),
    content: fields.markdoc({ label: "Content" }),
  },
});

export const collections = { tournaments };
