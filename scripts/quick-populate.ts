// Quick script to populate advisor data if the table exists but is empty
// Usage: npx tsx scripts/quick-populate.ts

import { supabase } from "../lib/supabase"

console.log("🚀 Quick Populate Advisors...\n")

const advisorData = [
  {
    slug: "minerva-haugabrooks",
    full_name: "Dr. Minerva Haugabrooks",
    role: "Community Development Strategist",
    bio: "AI agent specializing in community development, urban planning, and social impact assessment. Provides strategic insights for sustainable community initiatives.",
    detailed_bio: `Dr. Minerva Haugabrooks was a pioneering community development strategist whose work fundamentally shaped how we understand the intersection of urban planning, social justice, and economic empowerment. Born in 1945 in rural Alabama, she witnessed firsthand the challenges facing underserved communities and dedicated her life to developing innovative, community-centered solutions.

Her groundbreaking research on "Participatory Economic Development" introduced frameworks that prioritized community ownership and decision-making in development projects. Dr. Haugabrooks believed that sustainable change could only come from within communities themselves, with external support serving as a catalyst rather than a driving force.

Throughout her 40-year career, she advised on over 200 community development projects across the American South, establishing cooperative businesses, community land trusts, and participatory budgeting initiatives that continue to thrive today.`,
    avatar: "/placeholder.svg?height=120&width=120&text=Dr.+Minerva",
    specialties: [
      "Community Development",
      "Urban Planning",
      "Cooperative Economics",
      "Social Impact Assessment",
      "Participatory Democracy",
      "Community Land Trusts",
    ],
    is_active: true,
  },
  {
    slug: "james-smith",
    full_name: "James D. Smith",
    role: "Technology Integration Specialist",
    bio: "AI agent focused on technology solutions for community spaces, digital inclusion strategies, and innovative tools for collaborative work.",
    detailed_bio: `James D. Smith was a visionary technologist who dedicated his career to bridging the digital divide and ensuring that technology served community empowerment rather than displacement. Born in Detroit in 1960, he grew up witnessing both the decline of traditional manufacturing and the early promise of the computer revolution.

Smith's unique contribution was his understanding that technology alone could never solve community problems—but that the right technology, implemented with community input and ownership, could be a powerful tool for social change.`,
    avatar: "/placeholder.svg?height=120&width=120&text=James+Smith",
    specialties: [
      "Community Technology",
      "Digital Inclusion",
      "Open Source Development",
      "Community Networks",
      "Digital Literacy",
    ],
    is_active: true,
  },
]

async function quickPopulate() {
  try {
    console.log("🔍 Checking current data...")

    // Check what's already there
    const { data: existing, error: checkError } = await supabase.from("ai_advisors").select("slug, full_name")

    if (checkError) {
      console.log("❌ Error checking existing data:", checkError.message)
      return
    }

    console.log("📊 Found", existing?.length || 0, "existing advisors")

    // Insert each advisor if they don't exist
    for (const advisor of advisorData) {
      const exists = existing?.some((e) => e.slug === advisor.slug)

      if (exists) {
        console.log(`⏭️  Skipping ${advisor.full_name} - already exists`)
        continue
      }

      console.log(`📝 Inserting ${advisor.full_name}...`)

      const { data, error } = await supabase.from("ai_advisors").insert(advisor).select().single()

      if (error) {
        console.log(`❌ Error inserting ${advisor.full_name}:`, error.message)
      } else {
        console.log(`✅ Successfully inserted ${advisor.full_name}`)
      }
    }

    // Final check
    const { data: final } = await supabase.from("ai_advisors").select("slug, full_name")
    console.log("\n🎉 Final count:", final?.length || 0, "advisors")

    if (final && final.length > 0) {
      console.log("✅ Memorial pages should now work:")
      final.forEach((advisor) => {
        console.log(`   /advisors/${advisor.slug}`)
      })
    }
  } catch (error) {
    console.log("❌ Population failed:", error)
  }
}

quickPopulate()
