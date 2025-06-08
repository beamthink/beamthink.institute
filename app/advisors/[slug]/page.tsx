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
    console.log("🔍 Fetching advisor data for slug:", slug)

    // Get basic data from Supabase
    const { data: supabaseAdvisor, error } = await supabase.from("ai_advisors").select("*").eq("slug", slug).single()

    console.log("📊 Supabase query result:", { data: supabaseAdvisor, error })

    if (error) {
      console.error("❌ Supabase error:", error)
      return null
    }

    if (!supabaseAdvisor) {
      console.error("❌ No advisor found with slug:", slug)
      return null
    }

    console.log("✅ Found advisor in Supabase:", supabaseAdvisor.full_name)

    // Get rich content from Sanity using the linked person ID
    let sanityPerson = null
    if (supabaseAdvisor.sanity_person_id) {
      // Check if Sanity is properly configured
      const hasValidSanityConfig =
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder-project"

      console.log("🎨 Sanity config check:", {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        hasValidConfig: hasValidSanityConfig,
        personId: supabaseAdvisor.sanity_person_id,
      })

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
          console.log("✅ Sanity data fetched:", sanityPerson ? "Found" : "Not found")
        } catch (sanityError) {
          console.error("❌ Sanity fetch error:", sanityError)
          // Continue with null sanityPerson
        }
      } else {
        console.warn("⚠️  Sanity not configured - using basic data only")
      }
    } else {
      console.warn("⚠️  No sanity_person_id set for this advisor")
    }

    return {
      basic: supabaseAdvisor,
      detailed: sanityPerson,
    }
  } catch (error) {
    console.error("❌ Error fetching advisor data:", error)
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
  console.log("🚀 AdvisorPage rendering for slug:", params.slug)

  const advisorData = await getAdvisorData(params.slug)

  if (!advisorData) {
    console.log("❌ No advisor data found, showing 404")
    notFound()
  }

  console.log("✅ Rendering memorial for:", advisorData.basic.full_name)
  return <AdvisorMemorial advisorData={advisorData} />
}

// Generate static params for known advisors
export async function generateStaticParams() {
  try {
    const { data: advisors } = await supabase.from("ai_advisors").select("slug").eq("is_active", true)

    console.log(
      "📋 Generated static params for advisors:",
      advisors?.map((a) => a.slug),
    )

    return (advisors || []).map((advisor) => ({
      slug: advisor.slug,
    }))
  } catch (error) {
    console.error("❌ Error generating static params:", error)
    return []
  }
}
