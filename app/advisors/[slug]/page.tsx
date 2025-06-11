import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase"; 
import { sanityClient, urlForImage } from "@/lib/sanity"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PortableText, PortableTextComponents, PortableTextMarkComponentProps } from "@portabletext/react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types"; 
import { Badge } from "@/components/ui/badge"; 
import { Brain, MessageCircle, User, Volume2, VolumeX, Plus, Send, Download, Heart, Share, Play, TrendingUp, DollarSign, BookOpen, FileText, ExternalLink, Network, Globe, Info, Mail, Phone, Upload, Mic, MicOff, ChevronRight, Pause } from "lucide-react";


// Interface for basic data from Supabase's ai_advisors table
interface SupabaseAdvisor {
  id: string;
  slug: string;
  full_name: string;
  role: string;
  bio: string; // Short bio
  avatar: string;
  sanity_person_id?: string | null; // The link to Sanity
  specialties?: string[] | null; // Ensure this field exists if used in rendering
  totalContributions?: number | null; // Ensure this field exists if used in rendering
  birthYear?: number | null; // Ensure this field exists if used in rendering
  deathYear?: number | null; // Ensure this field exists if used in rendering
}

// Interface for rich data from Sanity's Person document
// This MUST accurately reflect the fields in your studio-beam-memorials/schemas/person.ts
interface SanityPersonData {
  _id: string;
  _type: "person"; // Ensure this matches your actual Sanity schema name
  fullName?: string; // If your Sanity Person schema uses fullName
  firstName?: string; // If your Sanity Person schema uses firstName
  lastName?: string; // If your Sanity Person schema uses lastName
  detailedBio?: any; // PortableText
  timeline?: Array<{ year: number; title: string; description: string; category: string }>;
  media?: Array<{ _type: string; title?: string; description?: string; url?: string; asset?: { _ref: string; url?: string; originalFilename?: string }; tags?: string[]; uploadedBy?: string; uploadedAt?: string }>;
  contributions?: Array<{ _type: string; title?: string; content?: string; contributorName?: string; submittedAt?: string; tags?: string[]; }>;
  quotes?: string[];
  // Add other rich fields from your Sanity Person schema that you want to display
}

// Combined interface for the page's data
interface AdvisorPageData {
  supabaseData: SupabaseAdvisor;
  sanityData: SanityPersonData | null; // Sanity data is optional
}

async function getAdvisorData(slug: string): Promise<AdvisorPageData | null> {
  // --- Fetch basic advisor data from Supabase ---
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

  // --- Fetch rich memorial data from Sanity using sanity_person_id ---
  let sanityPerson: SanityPersonData | null = null;
  if (supabaseAdvisor.sanity_person_id) {
    try {
      // Query Sanity for the full Person document using its _id
      const sanityQuery = `*[_type == "person" && _id == $personId][0]{
        _id,
        fullName, // Or firstName, lastName depending on your Sanity schema
        detailedBio,
        quotes,
        timeline[]{year, title, description, category},
        media[]{_type, title, description, url, asset->{_id, url, originalFilename}, tags, uploadedBy, uploadedAt, approved},
        contributions[]{_type, title, content, contributorName, submittedAt, approved, tags},
      }`;
      sanityPerson = await sanityClient.fetch(sanityQuery, { personId: supabaseAdvisor.sanity_person_id! });

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
    // You might also need to handle videoAsset if it's a type in your blockContent
    // videoAsset: ({value}: {value: any}) => { /* ...render video asset... */ },
  },
  marks: {
    link: ({children, value}: PortableTextMarkComponentProps<{ href: string; _type: string }>) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value?.href} rel={rel} className="text-blue-500 hover:underline">
          {children}
        </a>
      )
    },
  },
};

export default async function AdvisorPage({ params }: { params: { slug: string } }) {
  const { supabaseData: advisor, sanityData: richAdvisorData } = await getAdvisorData(params.slug);

  if (!advisor) { // If basic advisor not found in Supabase
    console.log("❌ No advisor data found, showing 404");
    notFound(); // Triggers Next.js's not-found page
  }

  console.log("✅ Rendering memorial for:", advisor.full_name); // This line is now correct

  // Fallback for avatar if Supabase doesn't have it or it's not a URL
  const advisorAvatar = advisor.avatar && advisor.avatar.startsWith('http') ? advisor.avatar : "/placeholder.svg";

  return (
    <div className="container mx-auto p-6 bg-gray-950 text-white rounded-lg shadow-xl my-8"> {/* Adjusted bg/text colors */}
      {/* Advisor Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 border-b border-gray-700 pb-8">
        <div className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden rounded-full shadow-lg flex-shrink-0">
          <Image
            src={advisorAvatar}
            alt={advisor.full_name}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-white mb-2">{advisor.full_name}</h1> {/* Adjusted text color */}
          <p className="text-xl text-gray-400 mb-2">{advisor.role}</p> {/* Adjusted text color */}
          <p className="text-gray-400 mb-4">{advisor.bio}</p> {/* Short bio from Supabase */}

          {/* AI Advisor Specialties from Supabase data */}
          {advisor.specialties && advisor.specialties.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {advisor.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="border-blue-500 text-blue-400">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions - Chat and View (from mock data in BeamOSDashboard) */}
          <div className="flex gap-2 justify-center md:justify-start">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
              <MessageCircle className="h-4 w-4 mr-2" /> Chat with AI
            </Button>
            {/* You'd link to the detailed Sanity page here, but we are on the Sanity page itself */}
            {/* This button could be for general Contact, or specific features */}
          </div>
        </div>
      </div>

      {/* Rich Content from Sanity Data (only if sanityData exists) */}
      {richAdvisorData ? (
          <div className="mt-8 space-y-8">
              {/* Detailed Biography */}
              {richAdvisorData.detailedBio && (
                  <div className="prose dark:prose-invert lg:prose-lg"> {/* Added dark:prose-invert for dark mode */}
                      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Detailed Biography</h2> {/* Adjusted text color */}
                      <PortableText value={richAdvisorData.detailedBio} components={portableTextComponents} />
                  </div>
              )}

              {/* Quotes */}
              {richAdvisorData.quotes && richAdvisorData.quotes.length > 0 && (
                  <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Notable Quotes</h2> {/* Adjusted text color */}
                      <div className="space-y-3">
                          {richAdvisorData.quotes.map((quote, index) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-4">
                                  <blockquote className="italic text-gray-300 text-sm mb-2">
                                      "{quote}"
                                  </blockquote>
                                  {/* Voice playback feature - needs local functions (speakText, isSpeaking, Volume2/X) */}
                                  {/* If you enable voice, ensure relevant state/functions are imported and passed or defined */}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Timeline */}
              {richAdvisorData.timeline && richAdvisorData.timeline.length > 0 && (
                  <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Life & Career Timeline</h2> {/* Adjusted text color */}
                      <div className="space-y-4">
                          {richAdvisorData.timeline.map((event, index) => (
                              <div key={index} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className={`w-3 h-3 rounded-full ${
                                          event.category === "education" ? "bg-blue-500" :
                                          event.category === "career" ? "bg-green-500" :
                                          event.category === "achievement" ? "bg-yellow-500" :
                                          event.category === "publication" ? "bg-purple-500" :
                                          "bg-gray-500"
                                        }`} />
                                      {index < richAdvisorData.timeline.length - 1 && <div className="w-px h-16 bg-gray-700 mt-2" />}
                                  </div>
                                  <div className="flex-1 pb-8">
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="text-white font-semibold">{event.year}</span> {/* Adjusted text color */}
                                          <span className="text-gray-400 text-xs">{event.category}</span> {/* Adjusted text color */}
                                      </div>
                                      <h4 className="text-white font-medium mb-2">{event.title}</h4> {/* Adjusted text color */}
                                      <p className="text-gray-400 text-sm">{event.description}</p> {/* Adjusted text color */}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Media Archive */}
              {richAdvisorData.media && richAdvisorData.media.length > 0 && (
                  <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Media Archive</h2> {/* Adjusted text color */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {richAdvisorData.media.map((item, index) => (
                              <div key={index} className="p-4 border border-gray-700 rounded-lg"> {/* Adjusted border/bg color */}
                                  <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3> {/* Adjusted text color */}
                                  <p className="text-gray-400 text-sm mb-2">{item.description}</p> {/* Adjusted text color */}
                                  {item._type === 'image' && item.asset && (
                                      <Image
                                          src={urlForImage(item).width(400).url()}
                                          alt={item.alt || item.title || 'Media image'}
                                          width={400}
                                          height={225}
                                          className="rounded-lg"
                                      />
                                  )}
                                  {item._type === 'file' && item.asset && item.originalFilename && (
                                      <a href={item.asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                          Download: {item.originalFilename}
                                      </a>
                                  )}
                                  {item._type === 'video' && item.url && ( // Assuming external video URL
                                      <div className="my-2 aspect-video w-full">
                                          <iframe src={item.url} title={item.title} allowFullScreen className="w-full h-full rounded-lg"></iframe>
                                      </div>
                                  )}
                                  {item._type === 'audio' && item.url && ( // Assuming external audio URL
                                      <audio controls src={item.url} className="w-full my-2"></audio>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Contributions */}
              {richAdvisorData.contributions && richAdvisorData.contributions.length > 0 && (
                  <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Community Contributions</h2> {/* Adjusted text color */}
                      <div className="space-y-4">
                          {richAdvisorData.contributions.map((contrib, index) => (
                              <div key={index} className="p-4 border border-gray-700 rounded-lg"> {/* Adjusted border/bg color */}
                                  <h3 className="text-lg font-semibold mb-2 text-white">{contrib.title}</h3> {/* Adjusted text color */}
                                  <p className="text-gray-400 text-sm mb-2">{contrib.content}</p> {/* Adjusted text color */}
                                  <p className="text-gray-500 text-xs">By {contrib.contributorName} on {new Date(contrib.submittedAt || '').toLocaleDateString()}</p> {/* Adjusted text color */}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

          </div>
      ) : (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center text-gray-300"> {/* Adjusted bg/text colors */}
              Detailed memorial content will be available once Sanity is configured and linked.
          </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
