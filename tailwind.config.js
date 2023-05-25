/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.webc"],
  theme: {
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
