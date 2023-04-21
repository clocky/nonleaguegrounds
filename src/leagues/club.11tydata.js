const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["club"],
  eleventyComputed: {
    permalink: ({ club }) =>
      `leagues/${slugify(club.memberOf.name.toLowerCase())}/${slugify(club.name.toLowerCase())}/index.html`,
  },
};
