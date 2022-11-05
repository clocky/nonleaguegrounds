const dayjs = require("dayjs");
const path = require("path");
const prettier = require("prettier");
const yaml = require("js-yaml");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const EleventyFetch = require("@11ty/eleventy-fetch");
const distFrom = require("distance-from");

module.exports = function (eleventyConfig) {
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

  eleventyConfig.addAsyncShortcode("county", async function (postcode) {
    const response = await postcodesIO(postcode);
    let county = "";
    if (response && response.status === 200) {
      if (response.result.admin_county != null) {
        county = response.result.admin_county;
      }
    }
    return county;
  });

  eleventyConfig.addAsyncShortcode("country", async function (postcode) {
    const response = await postcodesIO(postcode);
    let country = "";
    let ISO3166 = "";
    if (response && response.status === 200) {
      if (response.result.country != null) {
        country = response.result.country;
      }
    }
    /* https://www.gov.uk/government/publications/open-standards-for-government/country-codes */
    switch (country) {
      case "England":
        ISO3166 = "GB-ENG";
        break;
      case "Wales":
        ISO3166 = "GB-WLS";
        break;
      case "Scotland":
        ISO3166 = "GB-SCT";
        break;
      case "Northern Ireland":
        ISO3166 = "GB-NIR";
        break;
      default:
        ISO3166 = "GB";
    }
    return ISO3166;
  });

  eleventyConfig.addAsyncShortcode("region", async function (postcode) {
    postcode = postcode.replace(/\s/g, "");
    const response = await postcodesIO(postcode);
    let region = "";
    if (response && response.status === 200) {
      if (response.result.region != null) {
        region = response.result.region;
      } else {
        /* Backup for Welsh teams */
        region = response.result.country;
      }
    }
    return region;
  });

  eleventyConfig.addAsyncShortcode("district", async function (postcode) {
    const response = await postcodesIO(postcode);
    let district = "";
    if (response && response.status === 200) {
      district = response.result.admin_district;
    }
    return district;
  });

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
