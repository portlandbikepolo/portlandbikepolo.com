import * as path from "path";

/** @type {import('vite').UserConfig} */
export default {
  root: "src",
  resolve: {
    alias: {
      "/node_modules/preline/dist/preline.js": path.resolve(
        __dirname,
        "./node_modules/preline/dist/preline.js",
      ),
    },
  },
};
