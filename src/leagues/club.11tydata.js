const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["club"],
  eleventyComputed: {
    permalink: ({ club }) =>
      `leagues/${club.memberOf.slug.current}/${club.slug.current}/index.html`,
  },
};
