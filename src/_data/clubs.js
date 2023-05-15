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
*[ _type == "SportsTeam" ] {
      _id,
      name, 
      alternateName,
      legalName,
      identifier,
      slogan, 
      slug,
      telephone,
      email,
      location -> {
        name,
        slug,
        areaServed -> {
          name,
          slug
        },
        address {
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
      coach[] -> {
        name,
        jobTitle,
        "image": {
          "contentUrl": image.asset->url,
          "hotspot": image.hotspot
        },
      },
      memberOf -> { 
        name, 
        slug, 
        alternateName, 
        additionalProperty 
      },
      owns[]-> { 
        name, 
        offers,
        color[],
        "image": image.asset->url, 
        manufacturer-> { 
          name, 
          url,
          "logo": logo.asset->url 
        } 
      },
      "alumni": 
        *[_type == "Person" && references(^._id)] {
          _id,
          name, 
          jobTitle,
          "image": {
            "contentUrl": image.asset->url,
            "hotspot": image.hotspot
          },
          "worksFor": 
            *[_type == "SportsTeam" && references(^._id)][0] {
              name,
              alternateName,
              slug,
              memberOf -> {
                slug
              }
            },
          },
       } | order(name asc)
  `
  const params = {}

  return await client.fetch(query, params)
}
