import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { supabase } from "@/lib/supabase"
import { sanityClient } from '@/lib/sanity';

// Mock file storage - in production you'd use Vercel Blob, Supabase Storage, or similar
const mockFileStorage = new Map<string, { url: string; name: string; type: string; size: number }>()

// Create a read-only Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-01",
  useCdn: true,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const contributorName = formData.get("contributorName") as string
    const contributorEmail = formData.get("contributorEmail") as string
    const tags = formData.get("tags") as string
    const advisorSlug = formData.get("advisorSlug") as string

    // Process uploaded files
    const files = formData.getAll("files") as File[]
    const fileTypes = formData.getAll("fileTypes") as string[]

    const processedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileType = fileTypes[i]

      // In production, you'd upload to actual storage
      // For now, we'll create mock URLs
      const fileId = Math.random().toString(36).substr(2, 9)
      const mockUrl = `/api/files/${fileId}`

      // Store file data in mock storage
      mockFileStorage.set(fileId, {
        url: mockUrl,
        name: file.name,
        type: fileType,
        size: file.size,
      })

      processedFiles.push({
        id: fileId,
        name: file.name,
        type: fileType,
        url: mockUrl,
        size: file.size,
      })
    }

    // Save contribution to database (mock for now)
    const contribution = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      contributorName,
      contributorEmail,
      advisorSlug,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      files: processedFiles,
      submittedAt: new Date().toISOString(),
      approved: true, // Auto-approve for demo - in production you'd have moderation
    }

    // In production, save to Supabase:
    // const { data, error } = await supabase
    //   .from('contributions')
    //   .insert(contribution)

    return NextResponse.json({
      success: true,
      contribution,
      message: "Contribution submitted successfully",
    })
  } catch (error) {
    console.error("Error processing contribution:", error)
    return NextResponse.json({ error: "Failed to process contribution" }, { status: 500 })
  }
}

const query = `*[_type == "contribution" && approved == true] 
  | order(submittedAt desc)[0...10] {
    _id,
    type,
    title,
    content,
    contributorName,
    submittedAt,
    image,
    caption,
    timelineYear,
    timelineCategory,
    documentFile
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Sanity fetch failed:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 });
  }
}
