const dayjs = require("dayjs");
const yaml = require("js-yaml");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const distFrom = require("distance-from");
const eleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");

/* Additional Vite plugin for image optimization */
const { ViteImageOptimizer } = require("vite-plugin-image-optimizer");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: "src/components/**/*.webc",
  });
  /** Load Vite plugin */
  eleventyConfig.addPlugin(eleventyVitePlugin, {
    viteOptions: {
      assetsInclude: ["**/*.manifest"],
      publicDir: "src/public",
      build: {
        mode: "production",
        sourcemap: false,
        manifest: true,
        rollupOptions: {
          output: {
            dir: "dist",
            assetFileNames: "assets/[ext]/[name].[hash][extname]",
            chunkFileNames: "assets/js/[name]-[hash].js",
            entryFileNames: "assets/js/[name]-[hash].js",
          },
        },
      },
      plugins: [
        ViteImageOptimizer({
          jpg: {
            quality: 50,
          },
        }),
      ],
    },
  });

  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  /** Add passthrough copy for static assets */
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images/*.png": "/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images/*.ico": "/" });
  eleventyConfig.addPassthroughCopy({ "src/sass/": "/css" });

  /** Add a filter to format inline dates for <time> tags */
  eleventyConfig.addFilter("date", (date, format) =>
    dayjs(date).format(format)
  );

  /* Filter to convert integer to ordinal, ie. 2 = 2nd */
  eleventyConfig.addFilter("ordinal", (num) => ordinal(num));

  /* Filter to convert integer to comma number, ie. 1000 = 1,000 */
  eleventyConfig.addFilter("commaNumber", (num) => commaNumber(num));

  /* Filter to calculate distance between two points */
  eleventyConfig.addShortcode("distance", (a, b, x, y) => {
    let distance = new distFrom([a, b]).to([x, y]).in("mi");
    return distance.toFixed(1);
  });

  /** Add a filter to format inline dates for <time> tags */
  eleventyConfig.addFilter("ago", (year) =>
    dayjs().diff(dayjs(year, "YYYY"), "year")
  );

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
