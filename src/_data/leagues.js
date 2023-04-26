require("dotenv").config()
const { createClient } = require("@sanity/client")

const projectId = process.env.SANITY_PROJECT

const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2022-01-12",
  useCdn: false,
})

module.exports = async function () {
  /**
   * Fetches all leagues, and teams.
   * Ignores SportsOrganizations that do have a tier attribute (i.e. UEFA, FIFA, etc.)
   * Dynamically creates members array of teams that reference the league
   * Ignores drafts
   * Orders by tier, then by name
   **/
  const query = `
*[_type == "SportsOrganization" && additionalProperty != null ] {
  _id,
  name, alternateName,
  "logo": {
    "contentUrl": logo.asset->url,
  },
  slug,
  additionalProperty,
  "members": 
    *[_type == "SportsTeam" && references(^._id) && !(_id in path('drafts.**'))] { 
        name, alternateName, slogan, 
        slug,
        "logo": {
          "contentUrl": logo.asset->url
        }
    } | order(name asc)
} | order(additionalProperty asc, name asc)
  `
  const params = {}

  return await client.fetch(query, params)
}
