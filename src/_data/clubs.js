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
  const query = `
*[ _type == "SportsTeam"] {
      _id,
      name, 
      alternateName,
      legalName,
      identifier,
      nonProfitStatus,
      slogan, 
      slug,
      telephone,
      email,
      location -> {
        name,
        alternateName,
        slug,
        maximumAttendeeCapacity,
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
      facebook,
      twitter,
      youtube,
      instagram,
      "logo": {
        "contentUrl": logo.asset->url,
      },
      foundingDate,
      description,
      priceRange,
      coach[] -> {
        name,
        slug,
        jobTitle,
        "hasCredential": {
          "name": hasCredential->name,
          "recognizedBy": hasCredential->recognizedBy-> {
            "@type": _type,
            "name": name
          }
        },
       image {
          _type,
         hotspot,
         crop,
         asset->
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
        *[_type == "Person" && references(^._id)]|order(string::split(name, " ")[-1], asc) {
          _id,
          name, 
          slug,
          jobTitle,
          "hasCredential": {
            "name": hasCredential->name,
            "recognizedBy": hasCredential->recognizedBy-> {
              "@type": _type,
              "name": name
            }
          },
          image {
              _type,
            hotspot,
            crop,
            asset->
          },
          "worksFor": 
            *[_type == "SportsTeam" && references(^._id)][0] {
              name,
              slug,
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
