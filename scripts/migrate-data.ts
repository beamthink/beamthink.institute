import { supabase } from "../lib/supabase"
import { sanityClient } from "../lib/sanity"

// Your existing placeholder data
const placeholderProjects = [
  // ... your existing project data
]

const placeholderAdvisors = [
  // ... your existing advisor data
]

async function migrateToSupabase() {
  console.log("Migrating data to Supabase...")

  // Migrate projects
  for (const project of placeholderProjects) {
    const { error } = await supabase.from("projects").insert({
      id: project.id,
      title: project.title,
      summary: project.summary,
      description: project.description,
      status: project.status,
      project_type: project.projectType,
      node_id: project.nodeId,
      pod_id: project.podId,
      budget: project.budget,
      raised: project.raised,
    })

    if (error) {
      console.error("Error inserting project:", error)
    } else {
      console.log("Inserted project:", project.title)
    }
  }

  // Migrate advisors
  for (const advisor of placeholderAdvisors) {
    const { error } = await supabase.from("ai_advisors").insert({
      id: advisor.id,
      slug: advisor.slug,
      full_name: advisor.fullName,
      role: advisor.role,
      bio: advisor.bio,
      detailed_bio: advisor.detailedBio,
      avatar: advisor.avatar,
      specialties: advisor.specialties,
      is_active: advisor.isActive,
    })

    if (error) {
      console.error("Error inserting advisor:", error)
    } else {
      console.log("Inserted advisor:", advisor.fullName)
    }
  }
}

async function migrateToSanity() {
  console.log("Migrating data to Sanity...")

  // Migrate projects
  for (const project of placeholderProjects) {
    try {
      const doc = await sanityClient.create({
        _type: "project",
        _id: project.id,
        title: project.title,
        summary: project.summary,
        description: project.description,
        status: project.status,
        projectType: project.projectType,
        nodeId: project.nodeId,
        podId: project.podId,
        budget: project.budget,
        raised: project.raised,
      })
      console.log("Created Sanity project:", doc._id)
    } catch (error) {
      console.error("Error creating Sanity project:", error)
    }
  }

  // Migrate advisors
  for (const advisor of placeholderAdvisors) {
    try {
      const doc = await sanityClient.create({
        _type: "aiAdvisor",
        _id: advisor.id,
        slug: { current: advisor.slug },
        fullName: advisor.fullName,
        role: advisor.role,
        bio: advisor.bio,
        detailedBio: advisor.detailedBio,
        avatar: advisor.avatar,
        specialties: advisor.specialties,
        isActive: advisor.isActive,
      })
      console.log("Created Sanity advisor:", doc._id)
    } catch (error) {
      console.error("Error creating Sanity advisor:", error)
    }
  }
}

// Run migrations
async function runMigrations() {
  await migrateToSupabase()
  await migrateToSanity()
  console.log("Migration complete!")
}

// Uncomment to run
// runMigrations()
