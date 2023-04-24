const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["league"],
  eleventyComputed: {
    permalink: ({ league }) => `leagues/${league.slug.current}/index.html`,
  },
};
