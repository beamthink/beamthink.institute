import { type NextRequest, NextResponse } from "next/server"

// Mock file storage - in production you'd use Vercel Blob, Supabase Storage, or similar
const mockFileStorage = new Map<string, { url: string; name: string; type: string; size: number }>()

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

    // Mock contributions data - in production, fetch from Supabase
    const mockContributions = [
      {
        id: "contrib-1",
        title: "Working with Dr. Haugabrooks in Atlanta",
        description:
          "I had the privilege of working with Dr. Haugabrooks on the Auburn Avenue project in the late 1970s. What struck me most was her ability to listen—really listen—to community members. She would spend hours in barbershops, beauty salons, and church basements, not talking about her plans, but asking people about their dreams for their neighborhood.",
        contributorName: "James Washington",
        contributorEmail: "jwashington@example.com",
        advisorSlug: "minerva-haugabrooks",
        tags: ["personal story", "methodology", "Atlanta", "1970s"],
        files: [
          {
            id: "file-1",
            name: "community-meeting-1978.jpg",
            type: "image",
            url: "/placeholder.svg?height=300&width=400&text=Community+Meeting+1978",
            size: 245760,
          },
          {
            id: "file-2",
            name: "project-notes.pdf",
            type: "document",
            url: "/placeholder.svg?height=300&width=400&text=Project+Notes",
            size: 1048576,
          },
        ],
        submittedAt: "2024-01-15T10:30:00Z",
        approved: true,
      },
      {
        id: "contrib-2",
        title: "Voice Recording: Memories of Dr. Haugabrooks",
        description:
          "A voice recording sharing memories of working with Dr. Haugabrooks on community development projects in Birmingham.",
        contributorName: "Maria Rodriguez",
        contributorEmail: "mrodriguez@example.com",
        advisorSlug: "minerva-haugabrooks",
        tags: ["voice recording", "Birmingham", "community development"],
        files: [
          {
            id: "file-3",
            name: "memories-recording.wav",
            type: "audio",
            url: "/placeholder.svg?height=300&width=400&text=Audio+Recording",
            size: 2097152,
          },
        ],
        submittedAt: "2024-01-20T14:15:00Z",
        approved: true,
      },
    ]

    const filteredContributions = advisorSlug
      ? mockContributions.filter((c) => c.advisorSlug === advisorSlug)
      : mockContributions

    return NextResponse.json({ contributions: filteredContributions })
  } catch (error) {
    console.error("Error fetching contributions:", error)
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}
