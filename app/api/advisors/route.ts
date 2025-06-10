import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("🔍 Fetching advisors from Supabase...")

    // Fetch from Supabase only for now (Sanity integration can be added later)
    const { data: supabaseAdvisors, error: supabaseError } = await supabase
      .from("ai_advisors")
      .select("*")
      .eq("is_active", true)

    if (supabaseError) {
      console.error("❌ Supabase error:", supabaseError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: supabaseError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Found", supabaseAdvisors?.length || 0, "advisors")

    // Transform and normalize data to match the expected interface
    const advisors = (supabaseAdvisors || []).map((advisor) => ({
      id: advisor.id,
      slug: advisor.slug,
      fullName: advisor.full_name, // Transform full_name to fullName
      role: advisor.role,
      bio: advisor.bio,
      detailedBio: advisor.detailed_bio, // Transform detailed_bio to detailedBio
      avatar: advisor.avatar || "/placeholder.svg?height=120&width=120",
      specialties: Array.isArray(advisor.specialties) ? advisor.specialties : [],
      isActive: advisor.is_active, // Transform is_active to isActive
      source: "supabase",
      // Add default values for missing fields
      quotes: [],
      timeline: [],
      media: [],
      contributions: [],
      totalContributions: 0,
      lastUpdated: new Date(advisor.updated_at || advisor.created_at || Date.now()),
    }))

    return NextResponse.json({
      advisors,
      count: advisors.length,
      message: "Advisors fetched successfully",
    })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
