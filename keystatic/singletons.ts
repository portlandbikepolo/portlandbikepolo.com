// keystatic.config.ts
import { fields, singleton } from "@keystatic/core";

const codeOfConduct = singleton({
  label: "Code of Conduct",
  path: "src/content/code-of-conduct/",
  format: { contentField: "codeOfConduct" },
  schema: {
    codeOfConduct: fields.markdoc({
      label: "Content",
      description: "Content on the Code of Conduct page",
    }),
  },
});

const about = singleton({
  label: "About",
  path: "src/content/about/",
  format: { contentField: "content" },
  schema: {
    content: fields.markdoc({
      label: "Content",
      description: "Content on the about page",
    }),
  },
});

const play = singleton({
  label: "Play",
  path: "src/content/play/",
  format: { contentField: "content" },
  schema: {
    content: fields.markdoc({
      label: "Content",
      description: "Content on the play page",
    }),
  },
});

export const singletons = { about, codeOfConduct, play };
