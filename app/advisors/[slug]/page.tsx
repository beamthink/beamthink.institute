import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { sanityClient, urlForImage } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextComponents, PortableTextMarkComponentProps } from "@portabletext/react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// --- Import necessary Lucide React icons ---
import { Brain, MessageCircle, User, Volume2, VolumeX, Plus, Send, Download, Heart, Share, Play, TrendingUp, DollarSign, BookOpen, FileText, ExternalLink, Network, Globe, Info, Mail, Phone, Upload, Mic, MicOff, ChevronRight, Pause, ArrowLeft, Calendar, Quote, Camera } from "lucide-react";
// Import shadcn/ui components needed
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- INTERFACES (DEFINITIONS FOR YOUR DATA STRUCTURES) ---

// Interface for basic data from Supabase's ai_advisors table (Aligned with SQL)
interface SupabaseAdvisor {
  id: string; // UUID in Supabase
  slug: string;
  full_name: string;
  role: string;
  bio: string; // Short bio
  avatar: string; // URL string
  sanity_person_id?: string | null; // The link to Sanity (TEXT in Supabase)
  specialties?: string[] | null; // TEXT[] in Supabase
  // Note: birthYear, deathYear, totalContributions are NOT in your current ai_advisors SQL schema.
  // They will be undefined if fetched from Supabase.
}

// Interface for rich data from Sanity's Person document (Aligned with person.ts schema)
interface SanityPersonData {
  _id: string;
  _type: "person"; // MUST match the schema's name in studio-beam-memorials/schemas/person.ts
  fullName?: string; // As per your person.ts schema
  detailedBio?: any; // PortableText (type 'array', of: [{type: 'block'}])
  quotes?: string[]; // array, of: [{type: 'text'}]
  timeline?: Array<{ // array, of: [{type: 'object', fields: [...]}]
    year: number;
    title: string;
    description: string;
    category: string;
  }>;
  media?: Array<{ // array, of: [{type: 'object', fields: [...]}]
    _type: string; // e.g., 'object' for the container object
    title?: string;
    description?: string;
    type?: string; // e.g., 'Image', 'Video', 'Audio', 'Document' - from schema field
    url?: string; // For external videos/audio
    asset?: { _ref: string; url?: string; originalFilename?: string; }; // `asset->{url}` in GROQ dereferences to this
    alt?: string; // For image alt text
    tags?: string[];
    uploadedBy?: string;
    uploadedAt?: string;
    approved?: boolean;
  }>;
  contributions?: Array<{ // array, of: [{type: 'object', fields: [...]}]
    _type: string; // e.g., 'object' for the container object
    type?: string; // e.g., 'memory', 'quote', 'document', 'media' - from schema field
    title?: string;
    content?: string;
    contributorName?: string;
    contributorEmail?: string;
    submittedAt?: string; // datetime string
    approved?: boolean;
    tags?: string[];
    media?: string[]; // If contributions have their own media (e.g. references to other assets)
  }>;
  chatPersonality?: string;
  voiceCharacteristics?: string;
  keyWorks?: string[]; // array, of: [{type: 'string'}]
  birthYear?: number; // From Sanity person.ts
  deathYear?: number; // From Sanity person.ts
  // specialties?: string[]; // Specialties are in SupabaseAdvisor, not SanityPersonData per current schema
}

// Combined interface for the page's data
interface AdvisorPageData {
  supabaseData: SupabaseAdvisor;
  sanityData: SanityPersonData | null; // Sanity data is optional
}

// --- DATA FETCHING FUNCTIONS ---
async function getAdvisorData(slug: string): Promise<AdvisorPageData | null> {
  // --- Step 1: Fetch basic advisor data from Supabase ---
  // Ensure the supabase client is correctly initialized from lib/supabase.ts
  const { data: supabaseAdvisor, error: supabaseError } = await supabase
    .from('ai_advisors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (supabaseError && supabaseError.code !== 'PGRST116') { // PGRST116 is 'No rows found'
    console.error('Supabase fetch error for advisor:', supabaseError);
    return null;
  }
  if (!supabaseAdvisor) {
    console.log(`Advisor "${slug}" not found in Supabase.`);
    return null;
  }

  // --- Step 2: Fetch rich memorial data from Sanity using sanity_person_id ---
  let sanityPerson: SanityPersonData | null = null;
  if (supabaseAdvisor.sanity_person_id) {
    try {
      // Query Sanity for the full Person document using its _id AND _type="person"
      const sanityQuery = `*[_type == "person" && _id == $personId][0]{
        _id,
        fullName,
        detailedBio,
        quotes,
        timeline[]{year, title, description, category},
        media[]{_type, title, description, type, url, asset->{_id, url, originalFilename}, alt, tags, uploadedBy, uploadedAt, approved}, // Fetch 'type' and 'alt' for media
        contributions[]{_type, title, content, contributorName, contributorEmail, submittedAt, approved, tags, media[]},
        chatPersonality,
        voiceCharacteristics,
        keyWorks,
        birthYear,
        deathYear,
        // specialties, // specialties are from SupabaseAdvisor, not SanityPersonData per current schema
      }`;
      sanityPerson = await sanityClient.fetch(sanityQuery, { personId: supabaseAdvisor.sanity_person_id });

      if (!sanityPerson) {
        console.warn(`Sanity Person document not found for ID: ${supabaseAdvisor.sanity_person_id}. Rich content will be missing.`);
      }
    } catch (sanityFetchError) {
      console.error('Error fetching rich data from Sanity:', sanityFetchError);
    }
  } else {
    console.warn(`Supabase advisor "${slug}" has no sanity_person_id. Rich content will be missing.`);
  }

  return { supabaseData: supabaseAdvisor, sanityData: sanityPerson };
}

// --- PORTABLE TEXT COMPONENTS (for rendering rich text from Sanity) ---
const portableTextComponents: PortableTextComponents = {
  types: {
    // Correctly type the value for Sanity images within PortableText
    image: ({value}: {value: SanityImageSource & {alt?: string, asset?: {_ref: string}}}) => {
      if (!value.asset) return null;
      return (
        <Image
          className="w-full h-auto my-4 rounded-lg"
          src={urlForImage(value).width(800).url()}
          alt={value.alt || 'Image'}
          width={800}
          height={450}
          priority
        />
      );
    },
    // You can add custom types if you have them in blockContent (e.g., videoAsset for embedded videos)
    // videoAsset: ({value}: {value: any}) => { /* ...render video asset... */ },
  },
  marks: {
    link: ({children, value}: PortableTextMarkComponentProps<{ href: string; _type: string }>) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value?.href} rel={rel} className="text-blue-500 hover:underline">
          {children}
        </a>
      );
    },
  },
};

// --- NEXT.JS PAGE COMPONENT ---
export default async function AdvisorPage({ params }: { params: { slug: string } }) {
  console.log("🚀 AdvisorPage rendering for slug:", params.slug);

  const { supabaseData: advisor, sanityData: richAdvisorData } = await getAdvisorData(params.slug);

  if (!advisor) { // If basic advisor not found in Supabase
    console.log("❌ No advisor data found, showing 404");
    notFound(); // Triggers Next.js's not-found page
  }

  console.log("✅ Rendering memorial for:", advisor.full_name);

  // Fallback for avatar if Supabase doesn't have it or it's not a URL
  const advisorAvatar = advisor.avatar && advisor.avatar.startsWith('http') ? advisor.avatar : "/placeholder.svg";

  return (
    <div className="container mx-auto p-6 bg-gray-950 text-white rounded-lg shadow-xl my-8">
      {/* Advisor Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 border-b border-gray-700 pb-8">
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32 border-4 border-gray-600">
            <AvatarImage src={advisorAvatar} alt={advisor.full_name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              {advisor.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-white mb-2">{advisor.full_name}</h1>
          <p className="text-xl text-gray-400 mb-2">{advisor.role}</p>
          <p className="text-gray-400 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {/* Changed from Camera to Calendar icon, as per the original plan */}
            AI Memorial Agent
          </p>

          {/* AI Advisor Specialties from Sanity data (if available) or Supabase (if it's in both) */}
          {richAdvisorData?.specialties && richAdvisorData.specialties.length > 0 ? ( // Use Sanity data if available
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {richAdvisorData.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                  {specialty}
                </Badge>
              ))}
            </div>
          ) : advisor.specialties && advisor.specialties.length > 0 ? ( // Fallback to Supabase data if available
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {advisor.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                  {specialty}
                </Badge>
              ))}
            </div>
          ) : null}

          {/* Actions - Chat and View */}
          <div className="flex gap-2 justify-center md:justify-start">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
              <MessageCircle className="h-4 w-4 mr-2" /> Chat with AI
            </Button>
            {/* This button could be for general Contact, or specific features */}
          </div>
        </div>
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
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Biography</CardTitle>
            </CardHeader>
            <CardContent>
              {richAdvisorData?.detailedBio ? ( // Use detailedBio from Sanity
                <div className="prose prose-invert max-w-none">
                  <PortableText value={richAdvisorData.detailedBio} components={portableTextComponents} />
                </div>
              ) : (
                // Fallback to basic.detailed_bio (from Supabase if available)
                // Note: basic.detailed_bio from Supabase is a string, not PortableText
                basic.detailed_bio ? (
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {basic.detailed_bio.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-300 leading-relaxed">
                    <p>Detailed biography content will be available once Sanity is configured and linked, or populated.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Life & Career Timeline</CardTitle>
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
                // Fallback to mock data if no detailed.timeline from Sanity
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">No timeline events yet.</p>
                  <p className="text-gray-500 text-sm">Contribute timeline events using the floating action button.</p>
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
                <Quote className="h-5 w-5" />
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
                // Fallback to mock data if no detailed.quotes from Sanity
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
          <LiveContributionsFeed advisorSlug={advisor.slug} refreshTrigger={refreshTrigger} />
        </TabsContent>

        {/* Legacy Tab */}
        <TabsContent value="legacy">
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Impact & Influence</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholders for actual data */}
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
