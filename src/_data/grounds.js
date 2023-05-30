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
    *[ _type == "StadiumOrArena"] {
      name, 
      alternateName,
      slug,
      maximumAttendeeCapacity, 
      photo {
        _type,
        image {
          asset->
        }
      },
      address {
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry
      },
      location {
        lat,
        lng
      },
      areaServed -> {
        name,
        slug,
      },
      description,
      priceRange,
      "subOrganization":
        *[_type == "SportsTeam" && references(^._id)] {
          name, slug,
          memberOf -> {
            name, slug, additionalProperty
          }
        } | order(memberOf.additionalProperty asc),
    } | order(maximumAttendeeCapacity desc)
  `
  const params = {}

  return await client.fetch(query, params)
}
