const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["league"],
  eleventyComputed: {
    permalink: ({ league }) =>
      `leagues/${slugify(league.name.toLowerCase())}/index.html`,
  },
};
