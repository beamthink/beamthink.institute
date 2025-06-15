// app/api/quick-contributions/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { supabase } from "@/lib/supabase";

// Create a write-enabled Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN, // Make sure this is the write token
  useCdn: false,
});

// Since Next.js App Router handles FormData directly, formidable might not be strictly necessary
// if you're only processing FormData. However, for robust parsing, especially for files,
// a dedicated library can be useful. For now, let's use built-in request.formData().

// Helper function to handle file uploads with retries and chunking
async function uploadToSanity(file: File, type: 'image' | 'file') {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Upload file with proper type handling
      const asset = await sanityClient.assets.upload(type, file, {
        filename: file.name,
        contentType: file.type,
      });

      if (!asset?._id) throw new Error('Failed to upload asset');
      return asset;
    } catch (error) {
      console.error(`Upload attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      if (retryCount === maxRetries) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
  throw new Error('Failed to upload asset after retries');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const type = formData.get("type") as string;
    const advisorSlug = formData.get("advisorSlug") as string;
    const contributorName = formData.get("contributorName") as string;

    // Validate essential fields
    if (!advisorSlug || !contributorName || !type) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Get the advisor's Sanity ID from Supabase first
    const { data: advisor } = await supabase
      .from("ai_advisors")
      .select("sanity_person_id")
      .eq("slug", advisorSlug)
      .single()

    if (!advisor?.sanity_person_id) {
      return NextResponse.json(
        { error: "Advisor not found in Sanity" },
        { status: 404 }
      )
    }

    // Handle different contribution types
    let contributionData: any;

    try {
      if (type === "photo") {
        const file = formData.get("file") as File;
        const caption = formData.get("caption") as string;
        const description = formData.get("description") as string;

        if (file) {
          const asset = await uploadToSanity(file, 'image');

          contributionData = {
            _type: "contribution",
            type: "photo",
            title: caption || "Photo contribution",
            content: description || "",
            image: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: asset._id
              }
            },
            caption: caption || file.name,
            contributorName,
            submittedAt: new Date().toISOString(),
            approved: false
          }
        }
      } else if (type === "timeline") {
        const year = formData.get("year") as string;
        const category = formData.get("category") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        contributionData = {
          _type: "contribution",
          type: "timeline",
          title,
          content: description,
          timelineYear: Number.parseInt(year),
          timelineCategory: category,
          contributorName,
          submittedAt: new Date().toISOString(),
          approved: false
        }
      } else if (type === "memory") {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

        contributionData = {
          _type: "contribution",
          type: "memory",
          title,
          content,
          contributorName,
          submittedAt: new Date().toISOString(),
          approved: false
        }
      } else if (type === "document") {
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        if (file) {
          const asset = await uploadToSanity(file, 'file');

          contributionData = {
            _type: "contribution",
            type: "document",
            title,
            content: description,
            documentFile: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: asset._id
              }
            },
            contributorName,
            submittedAt: new Date().toISOString(),
            approved: false
          }
        }
      }

      // Create the contribution in Sanity with retry
      let contribution;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          contribution = await sanityClient.create(contributionData);
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }

      // Add the contribution to the advisor's contributions array with retry
      retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          await sanityClient
            .patch(advisor.sanity_person_id)
            .setIfMissing({ contributions: [] })
            .append('contributions', [contribution])
            .commit();
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }

      return NextResponse.json({
        success: true,
        message: "Contribution submitted successfully!",
        contribution,
      });
    } catch (uploadError) {
      console.error("Error during file upload or contribution creation:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file or create contribution. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing quick contribution:", error);
    return NextResponse.json(
      { error: "Failed to process contribution" },
      { status: 500 }
    );
  }
}