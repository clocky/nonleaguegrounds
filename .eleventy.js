const dayjs = require("dayjs");
const path = require("path");
const prettier = require("prettier");
const yaml = require("js-yaml");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const EleventyFetch = require("@11ty/eleventy-fetch");
const distFrom = require("distance-from");
const purgeCssPlugin = require("eleventy-plugin-purgecss");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");

module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_ENV === "prod") {
    eleventyConfig.addPlugin(purgeCssPlugin, {
      config: "./purgecss.config.js",
      quiet: false,
    });
  }

  /** Check for broken external links */
  /** Apple URL's always seem to 302, so we ignore them */
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    broken: "warn",
    redirect: "warn",
    cacheDuration: "1w",
    excludeUrls: ["https://maps.apple.com/*", "https://www.facebook.com/*", "https://www.youtube.com/channel/*"],
  });

  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  /** Watch SASS files for changes */
  eleventyConfig.addWatchTarget("./src/sass/");

  /** Watch data source file for changes */
  eleventyConfig.addWatchTarget("./src/_data/");

  eleventyConfig.addPassthroughCopy("./src/img/*.jpg");
  eleventyConfig.addPassthroughCopy({ "./src/img/favicon": "/" });

  /** Add a filter to format inline dates for <time> tags */
  const formatDate = (date, format) => dayjs(date).format(format);
  eleventyConfig.addFilter("date", formatDate);

  eleventyConfig.addFilter("ordinal", (num) => ordinal(num));
  eleventyConfig.addFilter("commaNumber", (num) => commaNumber(num));

  eleventyConfig.addShortcode("distance", (a, b, x, y) => {
    let distance = new distFrom([a, b]).to([x, y]).in("mi");
    return distance.toFixed(1);
  });

  /** Add a filter to format inline dates for <time> tags */
  let yearsAgo = (year) => dayjs().diff(dayjs(year, "YYYY"), "year");
  eleventyConfig.addFilter("ago", yearsAgo);

  if (process.env.ELEVENTY_ENV === "development") {
    eleventyConfig.addTransform("prettier", function (content, outputPath) {
      const extname = path.extname(outputPath);
      switch (extname) {
        case ".html":
          return prettier.format(content, { printWidth: 512, parser: "html" });

        case ".css":
          return prettier.format(content, { printWidth: 80, parser: "css" });

        case ".yaml":
          return prettier.format(content, { printWidth: 80, parser: "yaml" });

        case ".json":
          return prettier.format(content, { printWidth: 80, parser: "json" });

        case ".xml":
          return prettier.format(content, { printWidth: 256, parser: "html" });

        default:
          return content;
      }
    });
  }

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
