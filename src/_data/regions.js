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
  *[_type == "AdministrativeArea"] {
    name,
    slug,
    identifier,
    "geoContains": 
      *[_type == "StadiumOrArena" && references(^._id)] {
        _id,
        name, 
        slug,
        address,
        image {
          "contentUrl": image.asset->url,
          "crop": image.crop,
          "hotspot": image.hotspot,
          "caption": image.caption,
          "license": image.license,
          "author": image.author,
        },
        "subOrganization":
          *[_type == "SportsTeam" && references(^._id)] {
            name,
            slug,
            memberOf-> {
              slug
            }
          } 
      } | order(name asc)
    } | order(identifier asc)
`
  const params = {}

  return await client.fetch(query, params)
}
