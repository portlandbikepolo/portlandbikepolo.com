/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/preline/dist/*.js"],
  theme: {
    fontFamily: {
      brand: ["Urbanist", "system-ui", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("preline/plugin"),
  ],
};
