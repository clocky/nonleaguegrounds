const dayjs = require("dayjs");
const path = require("path");
const prettier = require("prettier");
const yaml = require("js-yaml");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const distFrom = require("distance-from");
const purgeCssPlugin = require("eleventy-plugin-purgecss");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const Image = require("@11ty/eleventy-img");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const slugify = require("slugify");
const EleventyFetch = require("@11ty/eleventy-fetch");
require("dotenv").config();
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_ENV === "production") {
    eleventyConfig.addPlugin(purgeCssPlugin, {
      config: "./purgecss.config.js",
      quiet: false,
    });
  }

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPlugin(brokenLinksPlugin, {
    broken: "warn",
    redirect: "warn",
    cacheDuration: "1w",
    /* 
       All of these 'fail' due to 429 rate limit or 302 moved errors
       but still have valid content.
    */
    excludeUrls: [
      "https://maps.apple.com/*", // Redirects to /place?q and 404's
      "https://www.facebook.com/*", // Gives a 302 error with Location:
      "https://www.youtube.com/channel/*",
      "https://twitter.com/*",
      "https://soundcloud.com/*", // Gives a 302 error
      "https://www.instagram.com/*", // Gives a 429 error
      "https://altrinchamfc.com/*", // Avoid cdn.shopify.com error
      "https://service.gov.uk/*", //  Claims "INVALID URI" but works
    ],
  });

  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addWatchTarget("./src/_data/");

  /**
   * Pass through copy
   */

  eleventyConfig.addPassthroughCopy({
    "node_modules/@fortawesome/fontawesome-free/webfonts": "webfonts",
  });
  eleventyConfig.addPassthroughCopy("./src/js/*.js");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  /**
   * Filters
   */

  const formatDate = (date, format) => dayjs(date).format(format);
  eleventyConfig.addFilter("date", formatDate);
  eleventyConfig.addFilter("ordinal", (num) => ordinal(num));
  eleventyConfig.addFilter("commaNumber", (num) => commaNumber(num));

  /**
   * Shortcodes
   */
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addShortcode("distance", (a, b, x, y) => {
    let distance = new distFrom([a, b]).to([x, y]).in("mi");
    return distance.toFixed(1);
  });

  eleventyConfig.addShortcode(
    "staticmap",
    function (
      address,
      width = 500,
      height = 500,
      zoom = 13,
      scale = 1,
      maptype = "roadmap"
    ) {
      const google = new URL("https://maps.googleapis.com/maps/api/staticmap");
      google.searchParams.set("center", address);
      google.searchParams.set("size", `${width}x${height}`);
      google.searchParams.set("zoom", zoom);
      google.searchParams.set("scale", scale);
      google.searchParams.set("maptype", maptype);
      google.searchParams.set("key", GOOGLE_MAPS_KEY);
      return google;
    }
  );

  eleventyConfig.addNunjucksAsyncShortcode("tweet", async function (tweet) {
    const url = new URL("https://publish.twitter.com/oembed");
    url.searchParams.set("url", tweet.substring(0, tweet.length - 1));
    url.searchParams.set("limit", 1);
    url.searchParams.set("lang", "en");
    url.searchParams.set("chrome", "noborders nofooter noheader transparent");
    url.searchParams.set("dnt", true);
    url.searchParams.set("hide_thread", true);

    const response = await EleventyFetch(url.href, {
      duration: "1d", 
      type: "json",
    })

    return response.html;
  });

  /** Add a filter to format inline dates for <time> tags */
  let yearsAgo = (year) => dayjs().diff(dayjs(year, "YYYY"), "year");
  eleventyConfig.addFilter("ago", yearsAgo);

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

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

async function imageShortcode(src, widths, formats, alt, sizes, urlPath) {
  const slug = slugify(alt, { lower: true, strict: true });
  let metadata = await Image(src, {
    widths: widths,
    urlPath: `/img/${urlPath}`,
    outputDir: `dist/img/${urlPath}`,
    formats: formats,
    cacheDuration: "1y",
    filenameFormat: function (id, src, width, format, options, alt) {
      return `${slug}-${width}w.${format}`;
    },
  });

  let imageAttributes = {
    alt,
    sizes,
    class: "hero-background is-transparent",
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
