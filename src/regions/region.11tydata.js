module.exports = {
  layout: "base.webc",
  pagination: {
    data: "regions",
    size: 1,
    alias: "region",
  },
  eleventyComputed: {
    title: ({ region }) => region.name,
    tags: ({ region }) => [region.name, "region"],
    permalink: ({ region }) => `regions/${region.slug.current}/index.html`,
  },
}
