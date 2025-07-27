import { client } from './sanity'
import type { SanityWikiPage } from "./sanity";

export async function getPerson(slug: string) {
  return client.fetch(
    `*[_type == "person" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getAllPeople() {
  return client.fetch(`*[_type == "person"]`)
}

export async function getAIAdvisor(slug: string) {
  return client.fetch(
    `*[_type == "aiAdvisor" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getAllAIAdvisors() {
  return client.fetch(`*[_type == "aiAdvisor"]`)
}

export async function getAllWikiPages(): Promise<SanityWikiPage[]> {
  return client.fetch(
    `*[_type == "wikiPage"] | order(updatedAt desc){
      _id,
      _type,
      title,
      tags,
      category,
      content,
      version,
      updatedAt
    }`
  );
} 