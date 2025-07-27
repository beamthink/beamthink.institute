// Test Supabase connection and data
// Usage: npx tsx scripts/test-supabase-connection.ts

import { supabase } from "../lib/supabase"

console.log("🔍 Testing Supabase Connection...\n")

async function testConnection() {
  try {
    // Test basic connection
    console.log("📊 TESTING CONNECTION:")
    const { data, error } = await supabase.from("ai_advisors").select("count").single()

    if (error) {
      console.log("❌ Connection failed:", error.message)
      return
    }

    console.log("✅ Supabase connection successful")

    // Test advisor data
    console.log("\n📝 TESTING ADVISOR DATA:")
    const { data: advisors, error: advisorError } = await supabase.from("ai_advisors").select("*")

    if (advisorError) {
      console.log("❌ Error fetching advisors:", advisorError.message)
      return
    }

    console.log("✅ Found", advisors?.length || 0, "advisors")

    if (advisors && advisors.length > 0) {
      advisors.forEach((advisor) => {
        console.log(`\n👤 ${advisor.full_name}`)
        console.log(`   Slug: ${advisor.slug}`)
        console.log(`   Specialties: ${advisor.specialties?.join(", ") || "None"}`)
        console.log(`   Sanity ID: ${advisor.sanity_person_id || "Not set"}`)
      })
    }

    // Test specific query
    console.log("\n🎯 TESTING SPECIFIC QUERY:")
    const { data: minerva, error: minervaError } = await supabase
      .from("ai_advisors")
      .select("*")
      .eq("slug", "minerva-haugabrooks")
      .single()

    if (minervaError) {
      console.log("❌ Error finding Minerva:", minervaError.message)
    } else if (minerva) {
      console.log("✅ Found Minerva successfully")
      console.log("   Data structure looks good:", typeof minerva.specialties)
    }
  } catch (error) {
    console.log("❌ Test failed:", error)
  }
}

testConnection()
