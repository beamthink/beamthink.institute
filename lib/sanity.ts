import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// Validate and clean project ID
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const cleanProjectId = projectId ? projectId.replace(/[^a-z0-9-]/g, "").toLowerCase() : "placeholder-project"

export const sanityClient = createClient({
  projectId: cleanProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
})

// Add error logging for debugging
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set")
}

if (!process.env.SANITY_API_TOKEN) {
  console.warn("SANITY_API_TOKEN is not set")
}

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// Sanity Schema Types
export interface SanityProject {
  _id: string
  _type: "project"
  title: string
  summary: string
  description: string
  status: "planning" | "active" | "archived"
  projectType: string
  nodeId: string
  podId: string
  budget: number
  raised: number
  media?: {
    asset: {
      _ref: string
      _type: "reference"
    }
  }[]
  _createdAt: string
  _updatedAt: string
}

export interface SanityAdvisor {
  _id: string
  _type: "aiAdvisor"
  slug: {
    current: string
  }
  fullName: string
  role: string
  bio: string
  detailedBio: string
  avatar: {
    asset: {
      _ref: string
      _type: "reference"
    }
  }
  specialties: string[]
  isActive: boolean
  _createdAt: string
  _updatedAt: string
}

export interface SanityNode {
  _id: string
  _type: "node"
  name: string
  ngo: string
  pod: string
  mission: string
  location: {
    city: string
    status: string
    lotSize: string
    type: string
    coordinates: string
    description: string
  }
  _createdAt: string
  _updatedAt: string
}
