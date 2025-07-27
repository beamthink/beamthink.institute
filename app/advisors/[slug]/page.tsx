import { notFound } from "next/navigation";
import type { Metadata } from "next"; // Metadata is for Server Components, but can be managed client-side too
import { supabase } from "@/lib/supabase";
import { client as sanityClient, urlFor } from "@/lib/sanity"; // Corrected imports
import React from "react";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowLeft } from "lucide-react"; // Example: If Back/Chat buttons are here
// Import shadcn/ui components needed (only if used directly in this page.tsx, not in AdvisorMemorialClient)
import { Button } from "@/components/ui/button";
// Remove unused imports since they're not being used in this page component
// The AdvisorMemorialClientPage component will handle its own UI components
import AdvisorMemorialClient from "@/components/advisor-memorial-client";

// --- INTERFACES (DEFINITIONS FOR YOUR DATA STRUCTURES) ---
// These must be accurate and align with your Supabase table and Sanity schema
// (Copied directly from previous turn, ensure no new changes are introduced)

interface SupabaseAdvisor {
  id: string;
  slug: string;
  full_name: string;
  role: string;
  bio: string;
  avatar: string;
  sanity_person_id?: string | null;
  specialties?: string[] | null;
  totalContributions?: number | null; // Placeholder, likely from Sanity
  birthYear?: number | null; // Placeholder, likely from Sanity
  deathYear?: number | null; // Placeholder, likely from Sanity
}

interface SanityPersonData {
  _id: string;
  _type: "person";
  fullName?: string;
  detailedBio?: any;
  quotes?: string[];
  timeline?: Array<{ year: number; title: string; description: string; category: string }>;
  media?: Array<{ _type: string; title?: string; description?: string; type?: string; url?: string; asset?: { _ref: string; url?: string; originalFilename?: string }; alt?: string; tags?: string[]; uploadedBy?: string; uploadedAt?: string; approved?: boolean; }>;
  contributions?: Array<{ _type: string; type?: string; title?: string; content?: string; contributorName?: string; contributorEmail?: string; submittedAt?: string; approved?: boolean; tags?: string[]; media?: string[]; }>;
  chatPersonality?: string;
  voiceCharacteristics?: string;
  keyWorks?: string[];
  birthYear?: number;
  deathYear?: number;
  specialties?: string[]; // Specialties are now in SupabaseAdvisor and SanityPersonData for flexibility
}

interface AdvisorPageData {
  supabaseData: SupabaseAdvisor;
  sanityData: SanityPersonData | null;
}

// --- DATA FETCHING FUNCTIONS ---
async function getAdvisorData(slug: string): Promise<AdvisorPageData | null> {
  const { data: supabaseAdvisor, error: supabaseError } = await supabase
    .from('ai_advisors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (supabaseError && supabaseError.code !== 'PGRST116') {
    console.error('Supabase fetch error for advisor:', supabaseError);
    return null;
  }
  if (!supabaseAdvisor) {
    console.log(`Advisor "${slug}" not found in Supabase.`);
    return null;
  }

  let sanityPerson: SanityPersonData | null = null;
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
        birthYear,
        deathYear,
        specialties, // Fetch specialties from Sanity Person schema
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

// --- Next.js Functions for Dynamic Routes (These run on the server even if page is "use client") ---
// generateStaticParams runs at build time on the server
export async function generateStaticParams() {
  // Ensure supabase is available here, it should be due to server context
  if (!supabase) {
    console.warn("Supabase client not initialized in generateStaticParams. Skipping static params generation.");
    return [];
  }
  try {
    console.log("📋 Generating static params...");
    const { data: advisors, error } = await supabase
      .from('ai_advisors')
      .select('slug')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching slugs for generateStaticParams:', error);
      return [];
    }
    if (!advisors) {
      return [];
    }

    return advisors.map((advisor: { slug: string }) => ({
      slug: advisor.slug,
    }));
  } catch (error) {
    console.error("❌ Error in generateStaticParams:", error);
    return [];
  }
}

// Metadata generation (also runs on the server)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getAdvisorData(params.slug); // Only need basic data for metadata

  if (!data?.supabaseData) {
    return {
      title: "Advisor Not Found",
    };
  }
  const advisor = data.supabaseData;

  return {
    title: `${advisor.full_name} - BEAM OS Memorial`,
    description: advisor.bio,
    openGraph: {
      title: `${advisor.full_name} Memorial`,
      description: advisor.bio,
      images: [advisor.avatar || '/placeholder.svg'], // Use avatar URL
    },
  };
}

export default async function AdvisorPage({ params }: { params: { slug: string } }) {
  const data = await getAdvisorData(params.slug);
  if (!data) {
    notFound();
  }
  
  // Ensure data has the required structure
  const advisorData = {
    basic: data.supabaseData,
    detailed: data.sanityData
  };
  
  return <AdvisorMemorialClient advisorData={advisorData} />;
}