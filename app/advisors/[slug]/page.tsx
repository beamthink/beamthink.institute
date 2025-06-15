// app/advisors/[slug]/page.tsx

import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { sanityClient } from "@/lib/sanity"
import AdvisorMemorialClient from "@/components/advisor-memorial-client"

// --- INTERFACES (DEFINITIONS FOR YOUR DATA STRUCTURES) ---
// (Keep your existing interfaces here)

interface SupabaseAdvisor {
  id: string // UUID in Supabase
  slug: string
  full_name: string
  role: string
  bio: string // Short bio
  avatar: string // URL string
  sanity_person_id?: string | null // The link to Sanity (TEXT in Supabase)
  specialties?: string[] | null // TEXT[] in Supabase
  totalContributions?: number | null // The total number of contributions (TEXT in Supabase)
  birthYear?: number | null // The birth year of the advisor (TEXT in Supabase)
  deathYear?: number | null // The death year of the advisor (TEXT in Supabase)
}

interface SanityPersonData {
  _id: string
  _type: "person" // MUST match the schema's name in studio-beam-memorials/schemas/person.ts
  fullName?: string // As per your person.ts schema
  detailedBio?: any // PortableText (type 'array', of: [{type: 'block'}])
  quotes?: string[] // array, of: [{type: 'text'}]
  timeline?: Array<{
    // array, of: [{type: 'object', fields: [...]}]
    year: number
    title: string
    description: string
    category: string
  }>
  media?: Array<{
    // array, of: [{type: 'object', fields: [...]}]
    _type: string // e.g., 'object' for the container object
    title?: string
    description?: string
    type?: string // e.g., 'Image', 'Video', 'Audio', 'Document' - from schema field
    url?: string // For external videos/audio
    asset?: { _ref: string; url?: string; originalFilename?: string } // `asset->{url}` in GROQ dereferences to this
    alt?: string // For image alt text
    tags?: string[]
    uploadedBy?: string
    uploadedAt?: string
    approved?: boolean
  }>
  contributions?: Array<{
    // array, of: [{type: 'object', fields: [...]}]
    _type: string // e.g., 'object' for the container object
    type?: string // e.g., 'memory', 'quote', 'document', 'media' - from schema field
    title?: string
    content?: string
    contributorName?: string
    contributorEmail?: string
    submittedAt?: string // datetime string
    approved?: boolean
    tags?: string[]
    media?: string[] // If contributions have their own media (e.g. references to other assets)
  }>
  chatPersonality?: string
  voiceCharacteristics?: string
  keyWorks?: string[] // array, of: [{type: 'string'}]
}

interface AdvisorPageData {
  supabaseData: SupabaseAdvisor
  sanityData: SanityPersonData | null // Sanity data is optional
}


// --- DATA FETCHING FUNCTIONS ---
async function getAdvisorData(slug: string): Promise<AdvisorPageData | null> {
  const { data: supabaseAdvisor, error: supabaseError } = await supabase
    .from("ai_advisors")
    .select("*")
    .eq("slug", slug)
    .single()

  if (supabaseError && supabaseError.code !== "PGRST116") {
    // PGRST116 is 'No rows found'
    console.error("Supabase fetch error for advisor:", supabaseError)
    return null
  }
  if (!supabaseAdvisor) {
    console.log(`Advisor "${slug}" not found in Supabase.`)
    return null
  }

  let sanityPerson: SanityPersonData | null = null
  if (supabaseAdvisor.sanity_person_id) {
    try {
      const sanityQuery = `*[_type == "person" && _id == $personId][0]{
        _id,
        fullName,
        detailedBio,
        quotes,
        timeline[]{year, title, description, category},
        media[]{_type, title, description, type, url, asset->{_id, url, originalFilename}, alt, tags, uploadedBy, uploadedAt, approved},
        contributions[]{_type, title, content, contributorName, contributorEmail, submittedAt, approved, tags, media[]},
        chatPersonality,
        voiceCharacteristics,
        keyWorks,
      }`
      sanityPerson = await sanityClient.fetch(sanityQuery, { personId: supabaseAdvisor.sanity_person_id })

      if (!sanityPerson) {
        console.warn(
          `Sanity Person document not found for ID: ${supabaseAdvisor.sanity_person_id}. Rich content will be missing.`,
        )
      }
    } catch (sanityFetchError) {
      console.error("Error fetching rich data from Sanity:", sanityFetchError)
    }
  } else {
    console.warn(`Supabase advisor "${slug}" has no sanity_person_id. Rich content will be missing.`)
  }

  return { supabaseData: supabaseAdvisor, sanityData: sanityPerson }
}

// --- NEXT.JS PAGE COMPONENT (SERVER COMPONENT) ---
export default async function AdvisorPage({
  params,
}: {
  params: { slug: string }
}) {
  // Create a promise that resolves with the params
  const resolvedParams = await Promise.resolve(params)
  const { slug } = resolvedParams

  // Wrap the data fetching in a try-catch block
  try {
    console.log("🚀 AdvisorPage rendering for slug:", slug)

    const advisorData = await getAdvisorData(slug)
    if (!advisorData) {
      throw new Error(`No advisor found for slug: ${slug}`)
    }

    console.log("✅ Rendering memorial for:", advisorData.supabaseData.full_name)

    return (
      <div className="min-h-screen bg-gray-900">
        <AdvisorMemorialClient
          advisorData={{
            basic: advisorData.supabaseData,
            detailed: advisorData.sanityData,
          }}
        />
      </div>
    )
  } catch (error) {
    console.error("Error in AdvisorPage:", error)
    // Return a proper error UI
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Advisor</h1>
          <p className="text-gray-400">Unable to load the requested advisor's memorial.</p>
        </div>
      </div>
    )
  }
}