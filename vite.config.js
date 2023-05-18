const { defineConfig } = require("vite")

module.exports = defineConfig({
  root: "dist",
  server: {
    host: true,
  },
  clearScreen: false, // This is to show Eleventy output in the console along with Vite output
  build: {
    outDir: "../public", // The output directory is relative to the project root, so we need to put it back one folder to work
  },
})
