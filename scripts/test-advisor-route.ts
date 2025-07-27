// Test if the advisor route is working
// Usage: npx tsx scripts/test-advisor-route.ts

import { supabase } from "../lib/supabase"

console.log("🔍 Testing Advisor Route Data...\n")

async function testAdvisorRoute() {
  try {
    // Test the exact query the page uses
    console.log("📊 Testing Supabase query for 'minerva-haugabrooks':")

    const { data: advisor, error } = await supabase
      .from("ai_advisors")
      .select("*")
      .eq("slug", "minerva-haugabrooks")
      .single()

    console.log("Query result:", { data: advisor, error })

    if (error) {
      console.log("❌ Error:", error.message)
      console.log("Error details:", error)

      // Check if table exists
      console.log("\n🔍 Checking if table exists...")
      const { data: tables, error: tableError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "ai_advisors")

      if (tableError) {
        console.log("❌ Cannot check tables:", tableError.message)
      } else if (tables && tables.length > 0) {
        console.log("✅ Table 'ai_advisors' exists")

        // Check what data is in the table
        const { data: allAdvisors } = await supabase.from("ai_advisors").select("slug, full_name")
        console.log("📋 Available advisors:", allAdvisors)
      } else {
        console.log("❌ Table 'ai_advisors' does not exist")
      }
    } else if (advisor) {
      console.log("✅ Found advisor:", advisor.full_name)
      console.log("✅ Route should work!")
    } else {
      console.log("❌ No advisor found with slug 'minerva-haugabrooks'")
    }
  } catch (error) {
    console.log("❌ Test failed:", error)
  }
}

testAdvisorRoute()
