import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
  
// --- Sanity Client Configuration ---
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-13"
const token = process.env.SANITY_API_READ_TOKEN || undefined

if (!projectId || !dataset) {
  console.warn("SANITY_CLIENT_WARNING: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is not set.")
}
if (!token && process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
  console.warn("SANITY_CLIENT_WARNING: SANITY_API_READ_TOKEN (or SANITY_API_TOKEN) is not set for production client. Draft mode/some queries may fail.")
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
})

// --- Fix: Export the client as `sanityClient` too ---
export const sanityClient = client // 👈 THIS FIXES YOUR ERROR

// --- Image URL Builder ---
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// --- TypeScript Interfaces ---

export interface SanityPerson {
  _id: string;
  _type: "person";
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  bio?: string;
  detailedBio?: any;
  avatar?: { asset: { _ref: string; _type: "reference" } };
  specialties?: string[];
  isActive?: boolean;
  timeline?: Array<{ year: number; title: string; description: string; category: string }>;
  media?: Array<{ _type: string; title?: string; description?: string; url?: string; asset?: { _ref: string; url?: string; originalFilename?: string }; tags?: string[]; uploadedBy?: string; uploadedAt?: string }>;
  contributions?: Array<{ _type: string; title?: string; content?: string; contributorName?: string; submittedAt?: string; tags?: string[] }>;
  quotes?: string[];
}

export interface SanityProject {
  _id: string;
  _type: "project";
  name: string;
  slug: { current: string };
  summary: string;
  description: any;
  status: "planning" | "active" | "archived";
  projectType: string;
  nodeId: string;
  podId: string;
  budget: number;
  raised: number;
  media?: { asset: { _ref: string; _type: "reference" } }[];
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityNGOPod {
  _id: string;
  _type: "ngoPod";
  name: string;
  slug: { current: string };
  ngo: string;
  pod: string;
  mission: string;
  location: {
    city: string;
    status: string;
    lotSize: string;
    type: string;
    coordinates: string;
    description: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityWikiPage {
  _id: string;
  _type: "wikiPage";
  title: string;
  tags?: string[];
  category?: string;
  content: any[]; // Portable Text (block content)
  version?: number;
  updatedAt?: string;
}
