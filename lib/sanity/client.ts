import { createClient } from "@sanity/client"

// Validate and clean project ID
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const cleanProjectId = projectId ? projectId.replace(/[^a-z0-9-]/g, "").toLowerCase() : "placeholder-project"

export const client = createClient({
  projectId: cleanProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2025-06-13",
  token: process.env.SANITY_API_TOKEN,
})

// Add error logging for debugging
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set")
}

if (!process.env.SANITY_API_TOKEN) {
  console.warn("SANITY_API_TOKEN is not set")
}

// Export as default as well for compatibility
export default client
