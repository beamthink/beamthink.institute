import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { sanityClient, urlForImage } from "@/lib/sanity"
import Link from "next/link"
import Image from "next/image"
import { PortableText, type PortableTextComponents, type PortableTextMarkComponentProps } from "@portabletext/react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import QuickContributeFAB from "@/components/quick-contribute-fab"
import LiveContributionsFeed from "@/components/live-contributions-feed"
import { ArrowLeft } from "lucide-react" // Import ArrowLeft icon

// --- Import necessary Lucide React icons for the page ---
import { MessageCircle, Camera } from "lucide-react"
// Import shadcn/ui components needed
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// --- INTERFACES (DEFINITIONS FOR YOUR DATA STRUCTURES) ---

// Interface for basic data from Supabase's ai_advisors table (Aligned with SQL)
interface SupabaseAdvisor {
  id: string
  slug: string
  full_name: string
  role: string
  bio: string // Short bio
  avatar: string // URL string
  sanity_person_id?: string | null // The link to Sanity

  // Fields below are in v0.dev's generated code, but NOT in your current Supabase SQL schema.
  // They will be undefined if fetched from Supabase.
  // To use them from Supabase, you'd need to ADD these columns to your Supabase ai_advisors table.
  // For now, they are marked optional and will be sourced from Sanity where available.
  specialties?: string[] | null
  totalContributions?: number | null
  birthYear?: number | null
  deathYear?: number | null
}

// Interface for rich data from Sanity's Person document (Aligned with person.ts schema)
interface SanityPersonData {
  _id: string
  _type: "person" // MUST match the schema's name in studio-beam-memorials/schemas/person.ts
  fullName?: string // As per your person.ts schema
  detailedBio?: any // PortableText
  timeline?: Array<{ year: number; title: string; description: string; category: string }>
  quotes?: string[] // Array of strings as per schema
  media?: Array<{
    // Matches schema's media array structure
    _type: string // e.g., 'image', 'video', 'audio', 'document'
    title?: string
    description?: string
    url?: string // For external videos/audio
    // Asset reference (common for image/file types in Sanity)
    asset?: { _ref: string; url?: string; originalFilename?: string } // `asset->{url}` in GROQ dereferences to this
    tags?: string[]
    uploadedBy?: string
    uploadedAt?: string
    approved?: boolean
  }>
  contributions?: Array<{
    _type: string // e.g., 'memory', 'quote', 'document', 'media'
    title?: string
    content?: string
    contributorName?: string
    contributorEmail?: string
    submittedAt?: string // datetime string
    approved?: boolean
    tags?: string[]
  }>
  chatPersonality?: string
  voiceCharacteristics?: string
  keyWorks?: string[]
}

// Combined interface for the page's data
interface AdvisorPageData {
  supabaseData: SupabaseAdvisor
  sanityData: SanityPersonData | null // Sanity data is optional
}

// --- DATA FETCHING FUNCTIONS ---
async function getAdvisorData(slug: string): Promise<AdvisorPageData | null> {
  // --- Step 1: Fetch basic advisor data from Supabase ---
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

  // --- Step 2: Fetch rich memorial data from Sanity using sanity_person_id ---
  let sanityPerson: SanityPersonData | null = null
  if (supabaseAdvisor.sanity_person_id) {
    try {
      // Query Sanity for the full Person document using its _id
      const sanityQuery = `*[_type == "person" && _id == $personId][0]{
        _id,
        fullName,
        detailedBio,
        quotes,
        timeline[]{year, title, description, category},
        media[]{_type, title, description, url, asset->{_id, url, originalFilename}, tags, uploadedBy, uploadedAt, approved},
        contributions[]{_type, title, content, contributorName, contributorEmail, submittedAt, approved, tags},
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

// --- PORTABLE TEXT COMPONENTS (for rendering rich text from Sanity) ---
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource & { alt?: string; asset?: { _ref: string } } }) => {
      if (!value.asset) return null
      return (
        <Image
          className="w-full h-auto my-4 rounded-lg"
          src={urlForImage(value).width(800).url() || "/placeholder.svg"}
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

// --- NEXT.JS PAGE COMPONENT ---
export default async function AdvisorPage({ params }: { params: { slug: string } }) {
  console.log("🚀 AdvisorPage rendering for slug:", params.slug)

  const advisorData = await getAdvisorData(params.slug)

  if (!advisorData) {
    console.log("❌ No advisor data found, showing 404")
    notFound()
  }

  const { supabaseData: advisor, sanityData: richAdvisorData } = advisorData

  console.log("✅ Rendering memorial for:", advisor.full_name)

  // Fallback for avatar if Supabase doesn't have it or it's not a URL
  const advisorAvatar = advisor.avatar && advisor.avatar.startsWith("http") ? advisor.avatar : "/placeholder.svg"

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/?advisor=${advisor.slug}`} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with {advisor.full_name.split(" ")[0]}
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl" />
          <Card className="relative bg-gray-900/50 border-gray-700 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 border-4 border-gray-600">
                    <AvatarImage src={advisorAvatar || "/placeholder.svg"} alt={advisor.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                      {advisor.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{advisor.full_name}</h1>
                      <p className="text-xl text-gray-300 mb-2">{advisor.role}</p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        AI Memorial Agent
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Living Memorial
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{advisor.bio}</p>

                  {/* AI Advisor Specialties from Supabase data */}
                  {advisor.specialties && advisor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {advisor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-800">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-gray-800">
              Quotes
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-gray-800">
              Live Feed
            </TabsTrigger>
            <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-800">
              Legacy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {richAdvisorData?.detailedBio ? (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <PortableText value={richAdvisorData.detailedBio} components={portableTextComponents} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Detailed biography content will be available once Sanity is configured and linked. In the meantime,
                    you can contribute memories, photos, and timeline events using the floating action button.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Life & Career Timeline</CardTitle>
                <p className="text-gray-400 text-sm">Community-contributed timeline events</p>
              </CardHeader>
              <CardContent>
                {richAdvisorData?.timeline && richAdvisorData.timeline.length > 0 ? (
                  <div className="space-y-6">
                    {richAdvisorData.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {event.year}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-white text-lg font-semibold mb-2">{event.title}</h3>
                          <p className="text-gray-300">{event.description}</p>
                          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400 capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No timeline events yet.</p>
                    <p className="text-gray-500 text-sm">Use the floating action button to add timeline events!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Notable Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {richAdvisorData?.quotes && richAdvisorData.quotes.length > 0 ? (
                  <div className="space-y-6">
                    {richAdvisorData.quotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                        <p className="text-gray-300 text-lg italic mb-2">"{quote}"</p>
                        <cite className="text-gray-400">— {advisor.full_name}</cite>
                      </blockquote>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No quotes available yet.</p>
                    <p className="text-gray-500 text-sm">Contribute memories that include memorable quotes!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Contributions Feed Tab */}
          <TabsContent value="contributions">
            <LiveContributionsFeed advisorSlug={advisor.slug} />
          </TabsContent>

          {/* Legacy Tab */}
          <TabsContent value="legacy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Impact & Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Living Memorial</h4>
                      <p className="text-gray-300 text-sm">
                        This memorial grows with community contributions - photos, memories, timeline events, and
                        documents.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">AI Agent</h4>
                      <p className="text-gray-300 text-sm">
                        Chat with the AI version to get insights based on their documented work and philosophy.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Community Archive</h4>
                      <p className="text-gray-300 text-sm">
                        A collaborative space where anyone can contribute to preserving and sharing their legacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">How to Contribute</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Add Photos</p>
                        <p className="text-gray-400 text-xs">Share historical photos or images</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Timeline Events</p>
                        <p className="text-gray-400 text-xs">Add important life milestones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Share Memories</p>
                        <p className="text-gray-400 text-xs">Personal stories and experiences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-orange-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Upload Documents</p>
                        <p className="text-gray-400 text-xs">Letters, articles, or papers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Contribute FAB */}
        <QuickContributeFAB
          advisorSlug={advisor.slug}
          advisorName={advisor.full_name}
          onContributionAdded={() => {
            // Refresh the page or trigger a re-fetch
            window.location.reload()
          }}
        />
      </div>
    </div>
  )
}
