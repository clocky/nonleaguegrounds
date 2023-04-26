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
      "@context": "https://schema.org",
      "@type": _type,
      name, 
      slug,
      alternateName, 
      slogan,
      legalName,
      identifier,
      telephone,
      email,
      location -> { 
        address{
          streetAddress, 
          addressLocality, 
          addressRegion, 
          postalCode
        } 
      },
      url,
      "logo": {
        "contentUrl": logo.asset->url,
      },
      foundingDate,
      description,
      priceRange,
      memberOf -> { 
        name, 
        slug, 
        alternateName, 
        tier 
      },

      owns[]-> { 
        name, offers, color[],
        "image": image.asset->url, 
        manufacturer-> { 
          name, url, "logo": logo.asset->url 
        }
      }
    } | order(name asc)
  `;
  const params = {};

  return await client.fetch(query, params);
};
