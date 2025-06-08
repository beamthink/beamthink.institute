// Debug script to check if advisor data exists
// Usage: npx tsx scripts/debug-advisor-data.ts

import { supabase } from "../lib/supabase"

console.log("🔍 Debugging Advisor Data...\n")

async function checkAdvisorData() {
  try {
    // Check if ai_advisors table exists and has data
    console.log("📊 CHECKING SUPABASE DATA:")
    const { data: advisors, error } = await supabase.from("ai_advisors").select("*")

    if (error) {
      console.log("❌ Supabase error:", error.message)
      return
    }

    console.log("✅ Found", advisors?.length || 0, "advisors in Supabase")

    if (advisors && advisors.length > 0) {
      advisors.forEach((advisor) => {
        console.log(`📝 Advisor: ${advisor.full_name}`)
        console.log(`   Slug: ${advisor.slug}`)
        console.log(`   Sanity ID: ${advisor.sanity_person_id || "Not set"}`)
        console.log(`   Active: ${advisor.is_active}`)
        console.log("")
      })
    }

    // Check specific advisor
    console.log("🎯 CHECKING SPECIFIC ADVISOR:")
    const { data: minerva, error: minervaError } = await supabase
      .from("ai_advisors")
      .select("*")
      .eq("slug", "minerva-haugabrooks")
      .single()

    if (minervaError) {
      console.log("❌ Error finding Minerva:", minervaError.message)
    } else if (minerva) {
      console.log("✅ Found Minerva Haugabrooks:")
      console.log("   Full name:", minerva.full_name)
      console.log("   Slug:", minerva.slug)
      console.log("   Sanity Person ID:", minerva.sanity_person_id)
    } else {
      console.log("❌ Minerva Haugabrooks not found")
    }
  } catch (error) {
    console.log("❌ Script error:", error)
  }
}

checkAdvisorData()
