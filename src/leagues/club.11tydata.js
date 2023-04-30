const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["club"],
  eleventyComputed: {
    title: ({ club }) => club.name,
    permalink: ({ club }) =>
      `leagues/${club.memberOf.slug.current}/${club.slug.current}/index.html`,
  },
};
