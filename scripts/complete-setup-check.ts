// Complete setup verification script
// Usage: npx tsx scripts/complete-setup-check.ts

import { supabase } from "../lib/supabase"

console.log("🔧 BEAM OS Complete Setup Check\n")

// 1. Check environment variables
console.log("📋 ENVIRONMENT VARIABLES:")
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing")
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing")
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing")

// 2. Test Supabase connection
console.log("\n🔌 TESTING SUPABASE CONNECTION:")
try {
  const { data, error } = await supabase.from("ai_advisors").select("count")

  if (error) {
    console.log("❌ Connection failed:", error.message)
    console.log("🔧 SOLUTION: Check your Supabase credentials in .env.local")
  } else {
    console.log("✅ Supabase connection working")
  }
} catch (connectionError) {
  console.log("❌ Connection error:", connectionError)
}

// 3. Check if ai_advisors table exists and has data
console.log("\n📊 CHECKING AI_ADVISORS TABLE:")
try {
  const { data: advisors, error } = await supabase.from("ai_advisors").select("*")

  if (error) {
    console.log("❌ Table error:", error.message)

    if (error.message.includes("relation") && error.message.includes("does not exist")) {
      console.log("🔧 SOLUTION: You need to create the ai_advisors table")
      console.log("   Run the SQL script: scripts/create-ai-advisors-table.sql")
    }
  } else if (!advisors || advisors.length === 0) {
    console.log("⚠️  Table exists but no data found")
    console.log("🔧 SOLUTION: You need to populate the table with advisor data")
    console.log("   Run: npx tsx scripts/populate-advisors.ts")
  } else {
    console.log("✅ Found", advisors.length, "advisors")
    advisors.forEach((advisor) => {
      console.log(`   - ${advisor.full_name} (${advisor.slug})`)
    })
  }
} catch (tableError) {
  console.log("❌ Table check failed:", tableError)
}

// 4. Test specific advisor query
console.log("\n🎯 TESTING MINERVA QUERY:")
try {
  const { data: minerva, error } = await supabase
    .from("ai_advisors")
    .select("*")
    .eq("slug", "minerva-haugabrooks")
    .single()

  if (error) {
    console.log("❌ Query failed:", error.message)
  } else if (minerva) {
    console.log("✅ Minerva found - memorial page should work!")
    console.log("   URL: /advisors/minerva-haugabrooks")
  } else {
    console.log("❌ Minerva not found")
  }
} catch (queryError) {
  console.log("❌ Query error:", queryError)
}

console.log("\n🎯 NEXT STEPS:")
console.log("1. If connection failed: Check .env.local file")
console.log("2. If table missing: Run the SQL script to create it")
console.log("3. If no data: Run the populate script")
console.log("4. Then try: /advisors/minerva-haugabrooks")
