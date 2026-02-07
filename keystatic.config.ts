// keystatic.config.ts
import { config } from "@keystatic/core";
import { collections } from "./keystatic/collections";
import { singletons } from "./keystatic/singletons";

export default config({
  // storage: {
  //   kind: "cloud",
  // },
  // cloud: {
  //   project: "portlandbikepolo/portlandbikepolo-com",
  // },
  storage: {
    kind: "local",
  },
  collections: collections,
  singletons: singletons,
  ui: {
    brand: {
      name: "Portland Bike Polo",
    },
    navigation: {
      Content: ["tournaments"],
      Settings: ["about", "codeOfConduct", "play"],
    },
  },
});
