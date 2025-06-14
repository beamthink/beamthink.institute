import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url" // ADD THIS IMPORT
import type { SanityImageSource } from "@sanity/image-url/lib/types/types" // ADD THIS IMPORT

// --- Sanity Client Configuration ---
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID // Use projectId directly
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-13" // Consistent API version
const token = process.env.SANITY_API_READ_TOKEN || undefined // Use read token for client-side fetches

if (!projectId || !dataset) {
  console.warn("SANITY_CLIENT_WARNING: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is not set.")
}
if (!token && process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
  console.warn("SANITY_CLIENT_WARNING: SANITY_API_READ_TOKEN (or SANITY_API_TOKEN) is not set for production client. Draft mode/some queries may fail.")
}

export const sanityClient = createClient({ // Renamed client to sanityClient for consistency
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for client-side fetches for speed
  token, // Use read token here
})

// --- Image URL Builder ---
const builder = imageUrlBuilder(sanityClient) // Use the new sanityClient instance

export function urlForImage(source: SanityImageSource) { // ADD THIS EXPORTED FUNCTION
  return builder.image(source)
}

// --- Frontend TypeScript Interfaces for Sanity Data (Keep these here if you want) ---
// These should reflect the *actual* names and types from your schemas in `sanity-schemas/`
// Ensure these match your backend schemas (e.g., 'person', 'project', 'ngoPod')

export interface SanityPerson {
  _id: string;
  _type: "person"; // MUST match the schema's name in studio/schemas/person.ts
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  bio?: string;
  detailedBio?: any; // PortableText
  avatar?: { asset: { _ref: string; _type: "reference" } }; // Assuming this is how avatar is stored
  specialties?: string[];
  isActive?: boolean;
  timeline?: Array<{ year: number; title: string; description: string; category: string }>;
  media?: Array<{ _type: string; title?: string; description?: string; url?: string; asset?: { _ref: string; url?: string; originalFilename?: string }; tags?: string[]; uploadedBy?: string; uploadedAt?: string }>;
  contributions?: Array<{ _type: string; title?: string; content?: string; contributorName?: string; submittedAt?: string; tags?: string[]; }>;
  quotes?: string[];
}

export interface SanityProject {
  _id: string;
  _type: "project";
  name: string;
  slug: { current: string };
  summary: string;
  description: any; // PortableText
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
  _type: "ngoPod"; // MUST match the schema's name in studio/schemas/ngoPod.ts
  name: string;
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
