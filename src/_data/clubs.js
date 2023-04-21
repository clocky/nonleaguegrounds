require("dotenv").config();
const { createClient } = require("@sanity/client");

const projectId = process.env.SANITY_PROJECT;

const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2022-01-12",
  useCdn: false,
});

module.exports = async function () {
  const query = `
*[ _type == "SportsTeam" ] {
      name, 
      alternateName, 
      slogan, 
        slug,
      telephone,
      location -> { streetAddress, addressLocality, addressRegion, postalCode },
      url,
      "logo": logo.asset->url,
      foundingDate,
      description,
      priceRange,
      memberOf -> { name, slug }
    } | order(name asc)
  `;
  const params = {};

  return await client.fetch(query, params);
};
