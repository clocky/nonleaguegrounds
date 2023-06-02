require("dotenv").config()
const { createClient } = require("@sanity/client")

const projectId = process.env.SANITY_PROJECT

const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2023-05-20",
  useCdn: false,
})

module.exports = async function () {
  /**
   * Fetches all leagues, and teams.
   * Ignores SportsOrganizations that do have a tier attribute (i.e. UEFA, FIFA, etc.)
   * Dynamically creates members array of teams that reference the league
   * Ignores drafts
   * Only shows leagues with a tier between 5 and 8
   * Orders by tier, then by name
   **/
  const query = `
*[_type == "SportsOrganization" && additionalProperty >= 5 && additionalProperty <= 8] {
  _id,
  name, 
  alternateName,
  logo {
    _type,
    hotspot,
    crop,
    asset->
  },
  slug,
  additionalProperty,
  "members": 
    *[_type == "SportsTeam" && references(^._id) && !(_id in path('drafts.**'))] { 
        name, alternateName, slogan, 
        slug,
        logo {
          _type,
          hotspot,
          crop,
          asset->
        },
        memberOf[]->{
          name, alternateName, slug
        }
    } | order(name asc)
} | order(additionalProperty asc, name asc)
  `
  const params = {}

  return await client.fetch(query, params)
}
