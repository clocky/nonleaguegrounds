require("dotenv").config();

const dayjs = require("dayjs");
const yaml = require("js-yaml");
const path = require("path");
const prettier = require("prettier");
const ordinal = require("ordinal");
const commaNumber = require("comma-number");
const distFrom = require("distance-from");
const { minify } = require("terser");
const Image = require("@11ty/eleventy-img");
const slugify = require("slugify");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const purgeCssPlugin = require("eleventy-plugin-purgecss");
const converter = require("number-to-words");

module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin);
  if (process.env.ELEVENTY_ENV === "prod") {
    eleventyConfig.addPlugin(purgeCssPlugin, {
      config: "./purgecss.config.js",
      quiet: false,
    });
  }

  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  /** Watch SASS files for changes */
  eleventyConfig.addWatchTarget("./src/sass/");

  /** Watch data source file for changes */
  eleventyConfig.addWatchTarget("./src/_data/");

  /* Copy over static images and webfonts */
  eleventyConfig.addPassthroughCopy("./src/img/*.jpg");
  eleventyConfig.addPassthroughCopy({ "./src/img/favicon": "/" });
  eleventyConfig.addPassthroughCopy({
    "./node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2":
      "/webfonts",
  });

  /** Add team crest image handler shortcode */
  eleventyConfig.addNunjucksAsyncShortcode("hero", heroShortcode);

  /** Add team crest image handler shortcode */
  eleventyConfig.addNunjucksAsyncShortcode("crest", crestShortcode);

  /** Add Bing aerial image handler shortcode */
  eleventyConfig.addNunjucksAsyncShortcode("aerial", aerialShortcode);

  /** Add a filter to format inline dates for <time> tags */
  const formatDate = (date, format) => dayjs(date).format(format);
  eleventyConfig.addFilter("date", formatDate);

  let yearsAgo = (year) => dayjs().diff(dayjs(year, "YYYY"), "year");
  eleventyConfig.addFilter("ago", yearsAgo);

  /** Show numbers as 1st, 2nd, 3rd etc. */
  eleventyConfig.addFilter("ordinal", (num) => ordinal(parseInt(num)));

  /** Format number with thousands separators, i.e. 1000 = 1,000 */
  eleventyConfig.addFilter("commaNumber", (num) => commaNumber(num));

  /** Convert number to words, e.g. 19 = ninetenn */
  eleventyConfig.addFilter("toWords", (num) => converter.toWords(num));

  converter.toWords(13);
  eleventyConfig.addFilter("json", (json) => JSON.stringify(json, null, 4));

  /** Return the distance between two sets of lat,long co-ordinates */
  eleventyConfig.addShortcode("distance", (a, b, x, y) => {
    let distance = new distFrom([a, b]).to([x, y]).in("mi");
    return distance.toFixed(1);
  });

  /** Transform HTML, CSS and JSON into readable layouts */
  eleventyConfig.addTransform("prettier", function (content, outputPath) {
    const extname = path.extname(outputPath);
    switch (extname) {
      case ".html":
        return prettier.format(content, { printWidth: 512, parser: "html" });

      case ".css":
        return prettier.format(content, { printWidth: 80, parser: "css" });

      case ".json":
        return prettier.format(content, { printWidth: 128, parser: "json" });
      default:
        return content;
    }
  });

  /** Minify JS files inline */
  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        // Fail gracefully.
        callback(null, code);
      }
    }
  );

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};

async function heroShortcode(src, alt) {
  let metadata = await Image(src, {
    widths: [320, 640, 1280, 1440],
    formats: ["avif", "jpeg"],
    outputDir: "./dist/img/hero/",
    urlPath: "/img/hero",
    cacheOptions: {
      duration: "4w",
      directory: "./.cache/img",
      removeUrlQueryParams: false,
    },
  });
  let imageAttributes = {
    alt,
    class: "hero-background is-transparent",
    sizes:
      "(max-width: 319px) 240px, (max-width: 639px) 320px, (max-width: 1279px) 640px, (max-width: 1439px) 1280px, 1440px",
    loading: "lazy",
    decoding: "async",
  };
  return Image.generateHTML(metadata, imageAttributes);
}

async function aerialShortcode(lat, lon, name) {
  if (!!lat && !!lon) {
    const src = `https://dev.virtualearth.net/REST/v1/Imagery/Map/Aerial/${lat},${lon}/18?mapSize=1280,720&mapLayer=Basemap,Buildings&format=jpeg&mapMetadata=0&key=${process.env.BING_MAPS_API_KEY}`;
    name = slugify(name, { lower: true, customReplacements: [["'", ""]] });
    let metadata = await Image(src, {
      widths: [240, 320, 640],
      formats: ["avif", "jpeg"],
      outputDir: "./dist/img/aerial/",
      urlPath: "/img/aerial/",
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${width}w.${format}`;
      },
      cacheOptions: {
        duration: "4w",
        directory: "./.cache/bing",
        removeUrlQueryParams: false,
      },
    });
    let imageAttributes = {
      alt: `Bing aerial image of ${name}`,
      sizes:
        "(max-width: 319px) 240px, (max-width: 639px) 320px, (max-width: 1279px) 640px",
      loading: "lazy",
      decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
  }
}

async function crestShortcode(src, alt, name) {
  name = slugify(name, { lower: true, customReplacements: [["'", ""]] });
  let metadata = await Image(src, {
    widths: [48, 96, 128],
    formats: ["webp", "png"],
    outputDir: "./dist/img/crests",
    urlPath: "/img/crests",
    filenameFormat: function (id, src, width, format, options) {
      return `${name}-${width}w.${format}`;
    },
    cacheOptions: {
      duration: "4w",
      directory: "./.cache/api-sports",
      removeUrlQueryParams: false,
    },
  });

  let imageAttributes = {
    alt,
    sizes: "(min-width: 24px) 24px 48px 96px 128px",
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
