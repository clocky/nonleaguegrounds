/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["src/**/*.webc"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
    },
    fontFamily: {
      display: ["Space Grotesk", "sans-serif"],
      mono: ["Cascadia Code", "monospace"],
      sans: ["Inter var", ...defaultTheme.fontFamily.sans],
    },
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require("tailwindcss-3d")],
}
