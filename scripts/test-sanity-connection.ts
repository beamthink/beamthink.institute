// Test Sanity connection
// Usage: npx tsx scripts/test-sanity-connection.ts

import { createClient } from "@sanity/client"

console.log("🔍 Testing Sanity Connection...\n")

// Check environment variables
console.log("📊 ENVIRONMENT VARIABLES:")
console.log("NEXT_PUBLIC_SANITY_PROJECT_ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "❌ Missing")
console.log("NEXT_PUBLIC_SANITY_DATASET:", process.env.NEXT_PUBLIC_SANITY_DATASET || "❌ Missing")
console.log("SANITY_API_TOKEN:", process.env.SANITY_API_TOKEN ? "✅ Set" : "❌ Missing")

// Validate project ID format
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
if (projectId) {
  const isValid = /^[a-z0-9-]+$/.test(projectId)
  console.log("Project ID format:", isValid ? "✅ Valid" : "❌ Invalid")
  console.log("Project ID value:", projectId)
}

console.log("\n🔌 TESTING CONNECTION:")

if (!projectId || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.log("❌ Missing required environment variables")
  process.exit(1)
}

try {
  const client = createClient({
    projectId: projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
  })

  console.log("✅ Sanity client created successfully")

  // Test basic connection
  const result = await client.fetch('*[_type == "person"][0...3]')
  console.log("✅ Connection successful!")
  console.log("📄 Found", result.length, "person documents")

  if (result.length > 0) {
    console.log("📝 Sample document:", result[0]._id)
  } else {
    console.log("ℹ️  No person documents found - you'll need to create some in Sanity Studio")
  }
} catch (error: any) {
  console.log("❌ Connection failed:")
  console.log("Error:", error.message)

  if (error.message.includes("Unauthorized")) {
    console.log("\n💡 SOLUTION: Check your SANITY_API_TOKEN")
    console.log("   - Go to sanity.io/manage")
    console.log("   - Select your project")
    console.log("   - Go to API tab")
    console.log("   - Create a token with Editor permissions")
  }

  if (error.message.includes("not found")) {
    console.log("\n💡 SOLUTION: Check your project ID and dataset")
    console.log("   - Project ID should be:", projectId)
    console.log("   - Dataset should be:", process.env.NEXT_PUBLIC_SANITY_DATASET)
  }
}
