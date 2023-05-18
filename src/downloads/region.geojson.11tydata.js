module.exports = {
  pagination: {
    data: "regions",
    size: 1,
    alias: "region",
  },
  eleventyComputed: {
    permalink: ({ region }) => `downloads/${region.slug.current}.geojson`,
  },
}
