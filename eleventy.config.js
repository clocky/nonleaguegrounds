const dayjs = require("dayjs")
const yaml = require("js-yaml")
const ordinal = require("ordinal")
const commaNumber = require("comma-number")
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc")
const { eleventyImagePlugin } = require("@11ty/eleventy-img")
const htmlmin = require("html-minifier")
const converter = require("number-to-words")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: ["src/_components/**/*.webc", "npm:@11ty/eleventy-img/*.webc"],
  })

  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ["webp", "jpeg"],
    urlPath: "/img/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  })

  eleventyConfig.addTransform("htmlmin", function (content) {
    // Prior to Eleventy 2.0: use this.outputPath instead
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: false,
        preserveLineBreaks: true,
        removeRedundantAttributes: false,
        removeEmptyAttributes: true,
        removeEmptyElements: false,
        collapseBooleanAttributes: true,
      })
      return minified
    }

    return content
  })

  /** Add loader for YAML files */
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents))

  /** Add passthrough copy for static assets */
  eleventyConfig.addPassthroughCopy({ "src/assets/styles/": "css" })
  eleventyConfig.addPassthroughCopy({ "src/assets/scripts/": "js" })

  /** Add a filter to format inline dates for <time> tags */
  eleventyConfig.addJavaScriptFunction("date", (date, format) =>
    dayjs(date).format(format)
  )

  /* Filter to convert integer to ordinal, ie. 2 = 2nd */
  eleventyConfig.addJavaScriptFunction("ordinal", (num) => ordinal(num))

  /* Filter to convert integer to ordinal, ie. 2 = 2nd */
  eleventyConfig.addJavaScriptFunction("words", (num) =>
    converter.toWordsOrdinal(num)
  )

  /* Filter to convert integer to comma number, ie. 1000 = 1,000 */
  eleventyConfig.addJavaScriptFunction("commaNumber", (num) => commaNumber(num))

  /** Add a filter to relative dates for <time> tags */
  eleventyConfig.addJavaScriptFunction("ago", (year) =>
    dayjs().diff(dayjs(year, "YYYY"), "year")
  )

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_templates",
    },
  }
}
