import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { supabase } from "@/lib/supabase"

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const advisorSlug = searchParams.get("advisorSlug")

    if (!advisorSlug) {
      return NextResponse.json({ error: "Missing advisorSlug parameter" }, { status: 400 })
    }

    console.log('Fetching advisor with slug:', advisorSlug)

    // Get the advisor's Sanity ID from Supabase
    const { data: advisor } = await supabase
      .from("ai_advisors")
      .select("sanity_person_id")
      .eq("slug", advisorSlug)
      .single()

    if (!advisor?.sanity_person_id) {
      console.log('No advisor found for slug:', advisorSlug)
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 })
    }

    console.log('Found advisor with Sanity ID:', advisor.sanity_person_id)

    // Fetch contributions from Sanity
    const query = `*[_type == "person" && _id == $personId][0]{
      "contributions": contributions[]->{
        _id,
        _type,
        type,
        title,
        content,
        contributorName,
        submittedAt,
        timelineYear,
        timelineCategory,
        image,
        caption,
        documentFile,
        approved
      }
    }`

    const result = await sanityClient.fetch(query, { personId: advisor.sanity_person_id })
    const contributions = (result?.contributions || [])
      .filter((contribution: { _id?: string; _type?: string } | null) => 
        contribution && contribution._id && contribution._type === 'contribution'
      )
    return NextResponse.json({ contributions })
  } catch (error) {
    console.error("Error fetching contributions:", error)
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}
