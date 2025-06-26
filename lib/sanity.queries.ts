import { client } from './sanity'

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