module.exports = {
  layout: "base.webc",
  tags: ["region"],
  eleventyComputed: {
    title: ({ region }) => region.name,
    permalink: ({ region }) => `regions/${region.slug.current}/index.html`,
  },
}
