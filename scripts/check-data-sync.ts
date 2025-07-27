// Script to check how your data is distributed
// Usage: npx tsx scripts/check-data-sync.ts

import { supabase } from "../lib/supabase"
import { sanityClient } from "../lib/sanity"

console.log("🔍 Checking Data Distribution...\n")

async function checkDataSync() {
  try {
    // Check Supabase data
    console.log("📊 SUPABASE DATA:")
    const { data: supabaseAdvisors } = await supabase.from("ai_advisors").select("slug, full_name, sanity_person_id")

    if (supabaseAdvisors) {
      supabaseAdvisors.forEach((advisor) => {
        console.log(`✅ ${advisor.full_name}`)
        console.log(`   Slug: ${advisor.slug}`)
        console.log(`   Sanity Link: ${advisor.sanity_person_id || "Not set"}`)
      })
    }

    // Check Sanity data
    console.log("\n🎨 SANITY DATA:")
    try {
      const sanityPersons = await sanityClient.fetch(`
        *[_type == "person"] {
          _id,
          fullName,
          "hasTimeline": defined(timeline),
          "hasMedia": defined(media),
          "mediaCount": count(media)
        }
      `)

      if (sanityPersons.length > 0) {
        sanityPersons.forEach((person: any) => {
          console.log(`✅ ${person.fullName || person._id}`)
          console.log(`   ID: ${person._id}`)
          console.log(`   Timeline: ${person.hasTimeline ? "Yes" : "No"}`)
          console.log(`   Media: ${person.mediaCount || 0} items`)
        })
      } else {
        console.log("ℹ️  No person documents in Sanity yet")
      }
    } catch (sanityError) {
      console.log("⚠️  Sanity not configured or no data available")
    }

    // Check linking
    console.log("\n🔗 DATA LINKING:")
    if (supabaseAdvisors) {
      for (const advisor of supabaseAdvisors) {
        if (advisor.sanity_person_id) {
          try {
            const sanityPerson = await sanityClient.fetch(`*[_type == "person" && _id == $id][0]`, {
              id: advisor.sanity_person_id,
            })
            console.log(`${sanityPerson ? "✅" : "❌"} ${advisor.full_name} -> ${advisor.sanity_person_id}`)
          } catch {
            console.log(`❌ ${advisor.full_name} -> ${advisor.sanity_person_id} (connection failed)`)
          }
        } else {
          console.log(`⚠️  ${advisor.full_name} -> No Sanity link set`)
        }
      }
    }
  } catch (error) {
    console.log("❌ Check failed:", error)
  }
}

checkDataSync()
