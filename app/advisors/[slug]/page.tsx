import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import AdvisorMemorial from "@/components/advisor-memorial"

interface AdvisorPageProps {
  params: {
    slug: string
  }
}

// Simplified data fetching with better error handling
async function getAdvisorData(slug: string) {
  try {
    console.log("🔍 Fetching advisor data for slug:", slug)

    // Get data from Supabase only
    const { data: advisor, error } = await supabase.from("ai_advisors").select("*").eq("slug", slug).single()

    console.log("📊 Supabase query result:", { data: advisor, error })

    if (error) {
      console.error("❌ Supabase error:", error)

      // If it's a "not found" error, return null
      if (error.code === "PGRST116") {
        return null
      }

      // For other errors, try to provide fallback data
      if (slug === "minerva-haugabrooks") {
        return {
          basic: {
            id: "fallback-minerva",
            slug: "minerva-haugabrooks",
            full_name: "Dr. Minerva Haugabrooks",
            role: "Community Development Strategist",
            bio: "AI agent specializing in community development, urban planning, and social impact assessment.",
            detailed_bio:
              "Dr. Minerva Haugabrooks was a pioneering community development strategist whose work fundamentally shaped how we understand the intersection of urban planning, social justice, and economic empowerment.",
            avatar: null,
            specialties: ["Community Development", "Urban Planning", "Cooperative Economics"],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sanity_person_id: null,
          },
          detailed: null,
        }
      }

      return null
    }

    if (!advisor) {
      console.error("❌ No advisor found with slug:", slug)
      return null
    }

    console.log("✅ Found advisor in Supabase:", advisor.full_name)

    // Ensure avatar is safe
    const safeAdvisor = {
      ...advisor,
      avatar: advisor.avatar?.startsWith("http") ? advisor.avatar : null,
    }

    return {
      basic: safeAdvisor,
      detailed: null, // We'll add Sanity data later
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

// Static generation for known advisors
export async function generateStaticParams() {
  try {
    console.log("📋 Generating static params...")

    // Return known advisor slugs for static generation
    return [{ slug: "minerva-haugabrooks" }, { slug: "james-smith" }]
  } catch (error) {
    console.error("❌ Error generating static params:", error)
    return []
  }
}
