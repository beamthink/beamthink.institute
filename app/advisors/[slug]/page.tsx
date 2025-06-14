import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { sanityClient } from "@/lib/sanity"
import AdvisorMemorialClient from "@/components/advisor-memorial-client"
import Image from "next/image"
import type { PortableTextComponents, PortableTextMarkComponentProps } from "@portabletext/react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlForImage } from "@/lib/sanity"

// --- INTERFACES (DEFINITIONS FOR YOUR DATA STRUCTURES) ---

// Interface for basic data from Supabase's ai_advisors table (Aligned with SQL)
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

// Interface for rich data from Sanity's Person document (Aligned with person.ts schema)
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

// Combined interface for the page's data
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

// Move portableTextComponents to a separate file
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource & { alt?: string; asset?: { _ref: string } } }) => {
      if (!value.asset) return null
      return (
        <Image
          className="w-full h-auto my-4 rounded-lg"
          src={urlForImage(value).url() || "/placeholder.svg"}
          alt={value.alt || "Image"}
          width={800}
          height={450}
          priority
        />
      )
    },
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<{ href: string; _type: string }>) => {
      const rel = !value?.href?.startsWith("/") ? "noreferrer noopener" : undefined
      return (
        <a href={value?.href} rel={rel} className="text-blue-500 hover:underline">
          {children}
        </a>
      )
    },
  },
}

// Server Component
export default async function AdvisorPage({ params }: { params: { slug: string } }) {
  console.log("🚀 AdvisorPage rendering for slug:", params.slug)
  
  const advisorData = await getAdvisorData(params.slug)

  if (!advisorData) {
    console.log("❌ No advisor data found, showing 404")
    notFound()
  }
// test commit to verify git identity
  const { supabaseData: advisor, sanityData: richAdvisorData } = advisorData

  console.log("✅ Rendering memorial for:", advisor.full_name)

  return (
    <AdvisorMemorialClient
      advisorData={{
        basic: advisor,
        detailed: richAdvisorData,
      }}
    />
  )
}
