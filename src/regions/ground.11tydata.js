const slugify = require("slugify");

module.exports = {
  layout: "base.webc",
  tags: ["ground"],
  eleventyComputed: {
    permalink: ({ ground }) =>
      `regions/${slugify(ground.areaServed.toLowerCase())}/${slugify(
        ground.name.toLowerCase()
      )}/index.html`,
  },
};
