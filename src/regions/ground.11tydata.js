const slugify = require("slugify")
const commaNumber = require("comma-number")

module.exports = {
  layout: "base.webc",
  tags: ["ground"],
  pagination: {
    data: "grounds",
    size: 1,
    alias: "ground",
  },
  eleventyComputed: {
    title: ({ ground }) =>
      `${ground.name} | ${ground.subOrganization[0].name} | ${ground.areaServed.name} `,
    permalink: ({ ground }) =>
      `regions/${ground.areaServed.slug.current}/${ground.slug.current}/index.html`,
    description: ({ ground }) =>
      `Explore ${ground.name}, home to the non-league football team, ${
        ground.subOrganization[0].name
      }. Located in ${
        ground.address.addressRegion
      }, this English football ground boasts a capacity of ${commaNumber(
        ground.maximumAttendeeCapacity
      )}.`,
  },
}
