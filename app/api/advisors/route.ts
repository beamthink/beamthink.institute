import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sanityClient } from "@/lib/sanity"

export async function GET() {
  try {
    // Fetch from Supabase
    const { data: supabaseAdvisors, error: supabaseError } = await supabase
      .from("ai_advisors")
      .select("*")
      .eq("is_active", true)

    if (supabaseError) {
      console.error("Supabase error:", supabaseError)
    }

    // Fetch from Sanity
    const sanityAdvisors = await sanityClient.fetch(`
      *[_type == "aiAdvisor" && isActive == true] {
        _id,
        slug,
        fullName,
        role,
        bio,
        detailedBio,
        avatar,
        specialties,
        isActive,
        _createdAt,
        _updatedAt
      }
    `)

    // Combine and normalize data
    const advisors = [
      ...(supabaseAdvisors || []).map((advisor) => ({
        id: advisor.id,
        slug: advisor.slug,
        fullName: advisor.full_name,
        role: advisor.role,
        bio: advisor.bio,
        detailedBio: advisor.detailed_bio,
        avatar: advisor.avatar,
        specialties: advisor.specialties,
        isActive: advisor.is_active,
        source: "supabase",
      })),
      ...(sanityAdvisors || []).map((advisor: any) => ({
        id: advisor._id,
        slug: advisor.slug?.current || advisor.slug,
        fullName: advisor.fullName,
        role: advisor.role,
        bio: advisor.bio,
        detailedBio: advisor.detailedBio,
        avatar: advisor.avatar,
        specialties: advisor.specialties,
        isActive: advisor.isActive,
        source: "sanity",
      })),
    ]

    return NextResponse.json({ advisors })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch advisors" }, { status: 500 })
  }
}
