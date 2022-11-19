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
  /** Add PurgeCSS plugin */
  eleventyConfig.addPlugin(purgeCssPlugin, {
    config: "./purgecss.config.js",
    quiet: false,
  });

  /** Check for broken links */
  eleventyConfig.addPlugin(brokenLinksPlugin);

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

  eleventyConfig.addTransform("prettier", function (content, outputPath) {
    const extname = path.extname(outputPath);
    switch (extname) {
      case ".html":
        return prettier.format(content, { printWidth: 80, parser: "html" });

      case ".css":
        return prettier.format(content, { printWidth: 80, parser: "css" });

      default:
        return content;
    }
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};

async function postcodesIO(postcode) {
  if (!postcode) {
    return;
  }
  const url = `https://api.postcodes.io/postcodes/${postcode}`;
  return EleventyFetch(url, {
    duration: "1w",
    type: "json",
  });
}
