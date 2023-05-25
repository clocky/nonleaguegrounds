const slugify = require("slugify")

module.exports = {
  layout: "base.webc",
  tags: ["league"],
  pagination: {
    data: "leagues",
    size: 1,
    alias: "league",
  },
  eleventyComputed: {
    title: ({ league }) => league.name,
    permalink: ({ league }) => `leagues/${league.slug.current}/index.html`,
  },
}
