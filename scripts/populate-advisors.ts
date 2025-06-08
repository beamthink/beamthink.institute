// Script to populate advisor data if missing
// Usage: npx tsx scripts/populate-advisors.ts

import { supabase } from "../lib/supabase"

console.log("🔧 Populating Advisor Data...\n")

const advisorData = [
  {
    slug: "minerva-haugabrooks",
    full_name: "Dr. Minerva Haugabrooks",
    role: "Community Development Strategist",
    bio: "AI agent specializing in community development, urban planning, and social impact assessment. Provides strategic insights for sustainable community initiatives.",
    detailed_bio:
      "Dr. Minerva Haugabrooks was a pioneering community development strategist whose work fundamentally shaped how we understand the intersection of urban planning, social justice, and economic empowerment. Born in 1945 in rural Alabama, she witnessed firsthand the challenges facing underserved communities and dedicated her life to developing innovative, community-centered solutions.",
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
    detailed_bio:
      "James D. Smith was a visionary technologist who dedicated his career to bridging the digital divide and ensuring that technology served community empowerment rather than displacement. Born in Detroit in 1960, he grew up witnessing both the decline of traditional manufacturing and the early promise of the computer revolution.",
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

async function populateAdvisors() {
  try {
    // Check if advisors already exist
    const { data: existing } = await supabase.from("ai_advisors").select("slug")
    const existingSlugs = existing?.map((a) => a.slug) || []

    for (const advisor of advisorData) {
      if (existingSlugs.includes(advisor.slug)) {
        console.log(`⏭️  Skipping ${advisor.full_name} - already exists`)
        continue
      }

      const { data, error } = await supabase.from("ai_advisors").insert(advisor).select().single()

      if (error) {
        console.log(`❌ Error inserting ${advisor.full_name}:`, error.message)
      } else {
        console.log(`✅ Inserted ${advisor.full_name}`)
      }
    }

    console.log("\n🎉 Advisor population complete!")
  } catch (error) {
    console.log("❌ Population error:", error)
  }
}

populateAdvisors()
