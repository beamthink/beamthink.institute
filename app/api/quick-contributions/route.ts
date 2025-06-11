import { type NextRequest, NextResponse } from "next/server"

// Mock file storage for demo - in production use Vercel Blob or Supabase Storage
const mockFileStorage = new Map<string, { url: string; name: string; type: string; size: number }>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const type = formData.get("type") as string
    const advisorSlug = formData.get("advisorSlug") as string
    const contributorName = formData.get("contributorName") as string

    // Handle different contribution types
    let contributionData: any = {
      advisor_slug: advisorSlug,
      contributor_name: contributorName,
      type: type,
      submitted_at: new Date().toISOString(),
      approved: true, // Auto-approve for demo
    }

    if (type === "photo") {
      const file = formData.get("file") as File
      const caption = formData.get("caption") as string

      if (file) {
        // In production, upload to Vercel Blob or Supabase Storage
        const fileId = Math.random().toString(36).substr(2, 9)
        const mockUrl = `/api/files/${fileId}`

        mockFileStorage.set(fileId, {
          url: mockUrl,
          name: file.name,
          type: "image",
          size: file.size,
        })

        contributionData = {
          ...contributionData,
          title: caption || "Photo contribution",
          content: caption || "",
          media_url: mockUrl,
          media_type: "image",
        }
      }
    } else if (type === "timeline") {
      const year = formData.get("year") as string
      const category = formData.get("category") as string
      const title = formData.get("title") as string
      const description = formData.get("description") as string

      contributionData = {
        ...contributionData,
        title: title,
        content: description,
        timeline_year: Number.parseInt(year),
        timeline_category: category,
      }
    } else if (type === "memory") {
      const title = formData.get("title") as string
      const content = formData.get("content") as string

      contributionData = {
        ...contributionData,
        title: title,
        content: content,
      }
    } else if (type === "document") {
      const file = formData.get("file") as File
      const title = formData.get("title") as string
      const description = formData.get("description") as string

      if (file) {
        // In production, upload to Vercel Blob or Supabase Storage
        const fileId = Math.random().toString(36).substr(2, 9)
        const mockUrl = `/api/files/${fileId}`

        mockFileStorage.set(fileId, {
          url: mockUrl,
          name: file.name,
          type: "document",
          size: file.size,
        })

        contributionData = {
          ...contributionData,
          title: title,
          content: description || "",
          media_url: mockUrl,
          media_type: "document",
        }
      }
    }

    // In production, save to Supabase contributions table
    // For now, we'll just simulate success
    console.log("Quick contribution received:", contributionData)

    // You would uncomment this when you have a contributions table:
    // const { data, error } = await supabase
    //   .from('contributions')
    //   .insert(contributionData)
    //   .select()
    //   .single()

    return NextResponse.json({
      success: true,
      message: "Contribution submitted successfully!",
      contribution: contributionData,
    })
  } catch (error) {
    console.error("Error processing quick contribution:", error)
    return NextResponse.json({ error: "Failed to process contribution" }, { status: 500 })
  }
}
