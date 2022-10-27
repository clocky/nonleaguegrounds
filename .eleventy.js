const path = require("path");
const prettier = require("prettier");
const yaml = require("js-yaml");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = function (eleventyConfig) {
  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  /** Watch SASS files for changes */
  eleventyConfig.addWatchTarget("./src/sass/");

  /** Watch data source file for changes */
  eleventyConfig.addWatchTarget("./src/_data/");

  eleventyConfig.addPassthroughCopy("./src/img");

  eleventyConfig.addFilter("ordinal", (num) => ordinal(num));
  eleventyConfig.addFilter("commaNumber", (num) => commaNumber(num));

  eleventyConfig.addAsyncShortcode("latitude", async function (postcode) {
    const fetch = await fetchPostcode(postcode);
    if (!fetch) {
      return "";
    }
    return `${fetch.result.latitude}`;
  });

  eleventyConfig.addAsyncShortcode("longitude", async function (postcode) {
    const fetch = await fetchPostcode(postcode);
    if (!fetch) {
      return "";
    }
    return `${fetch.result.longitude}`;
  });

  eleventyConfig.addTransform("prettier", function (content, outputPath) {
    const extname = path.extname(outputPath);
    switch (extname) {
      case ".html":
        const parser = extname.replace(/^./, "");
        return prettier.format(content, { parser });

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

async function fetchPostcode(postcode) {
  if (!postcode) {
    return;
  }
  const url = `https://api.postcodes.io/postcodes/${postcode}`;
  return EleventyFetch(url, {
    duration: "90d", // 90 days
    type: "json",
  });
}
