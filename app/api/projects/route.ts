import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sanityClient } from "@/lib/sanity"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nodeId = searchParams.get("nodeId")

    // Fetch from Supabase
    let query = supabase.from("projects").select("*")

    if (nodeId) {
      query = query.eq("node_id", nodeId)
    }

    const { data: supabaseProjects, error: supabaseError } = await query

    if (supabaseError) {
      console.error("Supabase error:", supabaseError)
    }

    // Fetch from Sanity
    const sanityQuery = nodeId ? `*[_type == "project" && nodeId == "${nodeId}"]` : `*[_type == "project"]`

    const sanityProjects = await sanityClient.fetch(sanityQuery)

    // Combine and normalize data
    const projects = [
      ...(supabaseProjects || []).map((project) => ({
        id: project.id,
        title: project.title,
        summary: project.summary,
        description: project.description,
        status: project.status,
        projectType: project.project_type,
        nodeId: project.node_id,
        podId: project.pod_id,
        budget: project.budget,
        raised: project.raised,
        source: "supabase",
      })),
      ...(sanityProjects || []).map((project: any) => ({
        id: project._id,
        title: project.title,
        summary: project.summary,
        description: project.description,
        status: project.status,
        projectType: project.projectType,
        nodeId: project.nodeId,
        podId: project.podId,
        budget: project.budget,
        raised: project.raised,
        source: "sanity",
      })),
    ]

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, summary, description, status, projectType, nodeId, podId, budget } = body

    // Insert into Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        summary,
        description,
        status,
        project_type: projectType,
        node_id: nodeId,
        pod_id: podId,
        budget,
        raised: 0,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Also create in Sanity
    const sanityDoc = await sanityClient.create({
      _type: "project",
      title,
      summary,
      description,
      status,
      projectType,
      nodeId,
      podId,
      budget,
      raised: 0,
    })

    return NextResponse.json({
      project: data,
      sanityId: sanityDoc._id,
      message: "Project created successfully",
    })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
