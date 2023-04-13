const slugify = require("slugify");

module.exports = {
  layout: "base",
  tags: ["ground"],
  eleventyComputed: {
    permalink: ({ ground }) =>
      `regions/${slugify(ground.areaServed.name.toLowerCase())}/${slugify(ground.name.toLowerCase())}/index.html`,
  },
};
