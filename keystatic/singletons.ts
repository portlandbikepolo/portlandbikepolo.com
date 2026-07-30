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
  format: { contentField: "intro" },
  schema: {
    intro: fields.markdoc({
      label: "Intro",
      description: "Beginner overview of bike polo shown at the top of the page",
    }),
    schedule: fields.array(
      fields.object({
        day: fields.text({ label: "Day" }),
        format: fields.text({ label: "Format" }),
        description: fields.text({ label: "Description" }),
        newcomer: fields.checkbox({
          label: "New-player friendly",
          defaultValue: false,
        }),
      }),
      {
        label: "Schedule",
        itemLabel: (props) => props.fields.day.value ?? "Day",
      }
    ),
    location: fields.object({
      name: fields.text({ label: "Venue name" }),
      address: fields.text({ label: "Address" }),
    }),
    equipment: fields.text({
      label: "Equipment",
      multiline: true,
      description: "What to bring — one item per line",
    }),
    bikeType: fields.text({
      label: "Bike type",
      multiline: true,
      description: "What kind of bike works for pickup",
    }),
    hecklersAlleyBlurb: fields.text({
      label: "Hecklers Alley blurb",
      multiline: true,
      description: "Short vendor callout text for the Get Your Gear section",
    }),
  },
});

const heroSlideshow = singleton({
  label: "Hero Slideshow",
  path: "src/content/hero-slideshow/",
  schema: {
    images: fields.array(
      fields.image({
        label: "Photo",
        directory: "src/assets/images/polo",
        publicPath: "../../assets/images/polo/",
      }),
      {
        label: "Photos",
        itemLabel: (props) => props.value?.filename ?? "Photo",
      }
    ),
  },
});

export const singletons = { about, codeOfConduct, play, heroSlideshow };
