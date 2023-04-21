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
*[ _type == "SportsOrganization" ] {
      name,
      alternateName,
      "logo": logo.asset->url,
      slug,
      tier,
      members[] -> { name, slug, slogan, "logo": logo.asset->url }
    } | order(tier asc)
  `;
  const params = {};

  return await client.fetch(query, params);
};
