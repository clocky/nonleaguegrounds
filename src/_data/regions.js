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
  const query = `
  *[_type == "AdministrativeArea" && count(*[_type == "StadiumOrArena" && areaServed._ref == ^._id]) >= 3] {
    name,
    alternateName,
    slug,
    description,
    identifier,
    image {
      "contentUrl": image.asset -> url
    },
    "geoContains": 
      *[_type == "StadiumOrArena" && references(^._id)] {
        _id,
        name, 
        slug,
        address,
        location {
          lat, lng
        },
        photo {
          _type,
          image {
            hotspot,
            asset -> 
          }
        },
        "subOrganization":
          *[_type == "SportsTeam" && references(^._id)] {
            name,
            alternateName,
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
