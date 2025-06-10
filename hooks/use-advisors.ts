"use client"

import { useState, useEffect } from "react"

interface AIAdvisor {
  id: string
  slug: string
  fullName: string
  role: string
  bio: string
  detailedBio?: string
  avatar: string
  birthYear?: number
  deathYear?: number
  specialties: string[]
  keyWorks?: string[]
  quotes?: string[]
  timeline?: any[]
  media?: any[]
  contributions?: any[]
  chatPersonality?: string
  voiceCharacteristics?: string
  isActive: boolean
  totalContributions?: number
  lastUpdated: Date
}

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<AIAdvisor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        setLoading(true)
        const response = await fetch("/api/advisors")

        if (!response.ok) {
          throw new Error(`Failed to fetch advisors: ${response.status}`)
        }

        const data = await response.json()

        // Fix: Access the advisors array from the response
        const advisorsList = data.advisors || []

        // Transform the data to match our interface
        const transformedAdvisors: AIAdvisor[] = advisorsList.map((advisor: any) => ({
          id: advisor.id,
          slug: advisor.slug,
          fullName: advisor.fullName, // Note: API returns fullName, not full_name
          role: advisor.role,
          bio: advisor.bio,
          detailedBio: advisor.detailedBio, // Note: API returns detailedBio, not detailed_bio
          avatar: advisor.avatar || "/placeholder.svg?height=120&width=120",
          birthYear: advisor.birth_year,
          deathYear: advisor.death_year,
          specialties: advisor.specialties || [],
          keyWorks: advisor.key_works || [],
          quotes: advisor.quotes || [],
          timeline: [], // Will be populated later
          media: [], // Will be populated later
          contributions: [], // Will be populated later
          chatPersonality: advisor.chat_personality,
          voiceCharacteristics: advisor.voice_characteristics,
          isActive: advisor.isActive, // Note: API returns isActive, not is_active
          totalContributions: 0,
          lastUpdated: new Date(advisor.updated_at || advisor.created_at || Date.now()),
        }))

        setAdvisors(transformedAdvisors)
        setError(null)
      } catch (err) {
        console.error("Error fetching advisors:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch advisors")

        // Fallback to mock data if API fails
        setAdvisors([
          {
            id: "minerva-haugabrooks",
            slug: "minerva-haugabrooks",
            fullName: "Dr. Minerva Haugabrooks",
            role: "Community Development Strategist",
            bio: "AI agent specializing in community development, urban planning, and social impact assessment.",
            avatar: "/placeholder.svg?height=120&width=120&text=Dr.+Minerva",
            specialties: ["Community Development", "Urban Planning", "Cooperative Economics"],
            isActive: true,
            lastUpdated: new Date(),
          },
          {
            id: "james-smith",
            slug: "james-smith",
            fullName: "James D. Smith",
            role: "Technology Integration Specialist",
            bio: "AI agent focused on technology solutions for community spaces and digital inclusion strategies.",
            avatar: "/placeholder.svg?height=120&width=120&text=James+Smith",
            specialties: ["Community Technology", "Digital Inclusion", "Open Source Development"],
            isActive: true,
            lastUpdated: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAdvisors()
  }, [])

  return { advisors, loading, error }
}
