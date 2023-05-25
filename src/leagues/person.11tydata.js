const slugify = require("slugify")

module.exports = {
  layout: "base.webc",
  tags: ["league"],
  pagination: {
    data: "people",
    size: 1,
    alias: "person",
  },
  eleventyComputed: {
    title: ({ person }) => person.name,
    permalink: ({ person }) =>
      `/leagues/${person.worksFor.memberOf.slug.current}/${person.worksFor.slug.current}/${person.slug.current}/index.html`,
  },
}
