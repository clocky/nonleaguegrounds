const slugify = require("slugify")

module.exports = {
  layout: "base.webc",
  tags: ["ground"],
  eleventyComputed: {
    title: ({ ground }) => ground.name,
    permalink: ({ ground }) =>
      `regions/${ground.areaServed.slug.current}/${ground.slug.current}/index.html`,
  },
}
