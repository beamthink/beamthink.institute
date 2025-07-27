import { createClient } from "@sanity/client"

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || "production"

if (!projectId) {
  console.warn("⚠️ SANITY_PROJECT_ID is not set")
}

if (!process.env.SANITY_API_TOKEN) {
  console.warn("⚠️ SANITY_API_TOKEN is not set")
}

export const client = createClient({
  projectId: projectId || "placeholder-project",
  dataset,
  useCdn: false, // Get fresh data and enable token use
  apiVersion: "2021-10-21",
  token: process.env.SANITY_API_TOKEN, // Only use in server-side context!
})

export default client
