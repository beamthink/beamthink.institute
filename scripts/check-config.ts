// Run this script to check your environment configuration
// Usage: npx tsx scripts/check-config.ts

console.log("🔍 Checking BEAM OS Configuration...\n")

// Check Supabase Configuration
console.log("📊 SUPABASE CONFIGURATION:")
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing")
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing")
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing")

console.log("\n🎨 SANITY CONFIGURATION:")
console.log("NEXT_PUBLIC_SANITY_PROJECT_ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "❌ Missing")
console.log("NEXT_PUBLIC_SANITY_DATASET:", process.env.NEXT_PUBLIC_SANITY_DATASET || "❌ Missing")
console.log("SANITY_API_TOKEN:", process.env.SANITY_API_TOKEN ? "✅ Set" : "❌ Missing")

// Validate Sanity Project ID format
if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const isValid = /^[a-z0-9-]+$/.test(projectId)
  console.log("Project ID format:", isValid ? "✅ Valid" : "❌ Invalid (only a-z, 0-9, and - allowed)")

  if (!isValid) {
    console.log("Current Project ID:", projectId)
    console.log("Cleaned Project ID would be:", projectId.replace(/[^a-z0-9-]/g, "").toLowerCase())
  }
}

console.log("\n🔧 RECOMMENDATIONS:")

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.log("❌ Set up your Sanity project ID")
}

if (!process.env.SANITY_API_TOKEN) {
  console.log("❌ Create a Sanity API token with Editor permissions")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log("❌ Configure your Supabase project URL")
}

console.log("\n✅ Configuration check complete!")
