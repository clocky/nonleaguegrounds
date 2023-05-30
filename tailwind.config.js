/** @type {import('tailwindcss').Config} */
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
      sans: ["Mona Sans", "sans-serif"],
    },
    container: {
      center: true,
    },
  },
  plugins: [require("tailwindcss-3d")],
}
