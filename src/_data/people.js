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
*[ _type == "Person" && !(_id in path("drafts.**")) && count(*[_type == "SportsTeam" && references(^._id)]) > 0] {
  "@type": _type,
  name,
  jobTitle,
  sameAs[],
  slug,
  description,
  url,
  mainEntityOfPage[],
  image {
      _type,
    hotspot,
    crop,
    asset->
  },
  "worksFor":
    *[_type == "SportsTeam" && references(^._id)][0] {
      "@type": _type,
      name,
      alternateName,
      slug,
      memberOf -> {
        "@type": _type,
        name,
        slug,
      },
    },
  "givenName": string::split(name, " ")[0],
  "familyName": string::split(name, " ")[1],
  "hasCredential": {
    "name": hasCredential->name,
    "recognizedBy": hasCredential->recognizedBy-> {
      "@type": _type,
      "name": name
    }
  },
  alumniOf[]->{
    "@type": _type,
    name,
    alternateName,
    slug,
    logo {
      _type,
      hotspot,
      crop,
      asset->
    },
    slogan,
    memberOf->
  } | order(name asc)
} | order(familyName asc)
`
  const params = {}

  return await client.fetch(query, params)
}
