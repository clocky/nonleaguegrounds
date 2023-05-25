require("dotenv").config()
const { createClient } = require("@sanity/client")

const projectId = process.env.SANITY_PROJECT

const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2022-01-12",
  useCdn: true,
})

module.exports = async function () {
  const query = `
*[_type == "SportsOrganization" && count(*[_type == "SportsTeam" && memberOf._ref == ^._id]) > 9 && additionalProperty >= 5] {
    name,
    additionalProperty,
    slug
} | order(additionalProperty asc, name asc)
  `
  const params = {}

  return await client.fetch(query, params)
}
