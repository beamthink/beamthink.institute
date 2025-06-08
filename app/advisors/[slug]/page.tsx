import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { sanityClient } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import AdvisorMemorial from "@/components/advisor-memorial"

interface AdvisorPageProps {
  params: {
    slug: string
  }
}

// Fetch advisor data from both Supabase and Sanity
async function getAdvisorData(slug: string) {
  try {
    // Get basic data from Supabase
    const { data: supabaseAdvisor, error } = await supabase.from("ai_advisors").select("*").eq("slug", slug).single()

    if (error || !supabaseAdvisor) {
      return null
    }

    // Get rich content from Sanity using the linked person ID
    let sanityPerson = null
    if (supabaseAdvisor.sanity_person_id) {
      // Check if Sanity is properly configured
      const hasValidSanityConfig =
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder-project"

      if (hasValidSanityConfig) {
        try {
          sanityPerson = await sanityClient.fetch(
            `*[_type == "person" && _id == $personId][0]{
              _id,
              fullName,
              detailedBio,
              birthYear,
              deathYear,
              specialties,
              keyWorks,
              quotes,
              timeline,
              media[]{
                _key,
                title,
                description,
                type,
                asset->{
                  _id,
                  url,
                  metadata
                }
              },
              contributions[]{
                _key,
                type,
                title,
                content,
                contributorName,
                contributorEmail,
                submittedAt,
                approved,
                tags
              },
              chatPersonality,
              voiceCharacteristics
            }`,
            { personId: supabaseAdvisor.sanity_person_id },
          )
        } catch (sanityError) {
          console.error("Sanity fetch error:", sanityError)
          console.error("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
          console.error("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET)
          // Continue with null sanityPerson
        }
      } else {
        console.warn("Sanity not configured - using basic data only")
      }
    }

    return {
      basic: supabaseAdvisor,
      detailed: sanityPerson,
    }
  } catch (error) {
    console.error("Error fetching advisor data:", error)
    return null
  }
}

export async function generateMetadata({ params }: AdvisorPageProps): Promise<Metadata> {
  const advisorData = await getAdvisorData(params.slug)

  if (!advisorData) {
    return {
      title: "Advisor Not Found",
    }
  }

  return {
    title: `${advisorData.basic.full_name} - BEAM OS Memorial`,
    description: advisorData.basic.bio,
    openGraph: {
      title: `${advisorData.basic.full_name} Memorial`,
      description: advisorData.basic.bio,
      images: [advisorData.basic.avatar],
    },
  }
}

export default async function AdvisorPage({ params }: AdvisorPageProps) {
  const advisorData = await getAdvisorData(params.slug)

  if (!advisorData) {
    notFound()
  }

  return <AdvisorMemorial advisorData={advisorData} />
}

// Generate static params for known advisors
export async function generateStaticParams() {
  const { data: advisors } = await supabase.from("ai_advisors").select("slug").eq("is_active", true)

  return (advisors || []).map((advisor) => ({
    slug: advisor.slug,
  }))
}
