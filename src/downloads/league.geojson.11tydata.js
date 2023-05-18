module.exports = {
  pagination: {
    data: "leagues",
    size: 1,
    alias: "league",
  },
  eleventyComputed: {
    permalink: ({ league }) => `downloads/${league.slug.current}.geojson`,
  },
}
