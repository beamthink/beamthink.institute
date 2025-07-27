// Utility to demonstrate how data is combined
import { supabase } from "./supabase"
import { sanityClient } from "./sanity"

export async function getCompleteAdvisorData(slug: string) {
  // 1. Get basic data from Supabase (fast, always available)
  const { data: basicData } = await supabase.from("ai_advisors").select("*").eq("slug", slug).single()

  if (!basicData) return null

  // 2. Get rich content from Sanity (optional, enhanced experience)
  let richContent = null
  if (basicData.sanity_person_id) {
    try {
      richContent = await sanityClient.fetch(`*[_type == "person" && _id == $personId][0]`, {
        personId: basicData.sanity_person_id,
      })
    } catch (error) {
      console.log("Sanity content not available, using basic data only")
    }
  }

  return {
    basic: basicData, // Always from Supabase
    rich: richContent, // From Sanity (optional)
  }
}

// Example of what you'd see in each system:
export const exampleDataDistribution = {
  supabase: {
    purpose: "Core application data",
    example: {
      slug: "minerva-haugabrooks",
      full_name: "Dr. Minerva Haugabrooks",
      role: "Community Development Strategist",
      bio: "AI agent specializing in community development...",
      specialties: ["Community Development", "Urban Planning"],
      sanity_person_id: "minerva-haugabrooks-person",
    },
  },
  sanity: {
    purpose: "Rich memorial content",
    example: {
      _id: "minerva-haugabrooks-person",
      detailedBio: "Rich text with formatting, links, etc.",
      timeline: [
        {
          year: 1945,
          title: "Born in Rural Alabama",
          description: "Detailed description with context...",
        },
      ],
      media: [
        {
          title: "Dr. Haugabrooks at Community Meeting",
          type: "image",
          asset: { url: "https://..." },
        },
      ],
    },
  },
}
