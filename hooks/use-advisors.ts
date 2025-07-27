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
        setError(null)

        console.log("🔍 Fetching advisors from API...")

        const response = await fetch("/api/advisors")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("✅ API Response:", data)

        // Handle the response structure
        const advisorsList = data.advisors || []

        if (!Array.isArray(advisorsList)) {
          throw new Error("Invalid response format: advisors should be an array")
        }

        // Transform the data to ensure it matches our interface
        const transformedAdvisors: AIAdvisor[] = advisorsList.map((advisor: any) => ({
          id: advisor.id || advisor.slug,
          slug: advisor.slug,
          fullName: advisor.fullName || advisor.full_name || "Unknown",
          role: advisor.role || "AI Advisor",
          bio: advisor.bio || "",
          detailedBio: advisor.detailedBio || advisor.detailed_bio,
          avatar: advisor.avatar || "/placeholder.svg?height=120&width=120",
          specialties: Array.isArray(advisor.specialties) ? advisor.specialties : [],
          quotes: advisor.quotes || [],
          timeline: advisor.timeline || [],
          media: advisor.media || [],
          contributions: advisor.contributions || [],
          isActive:
            advisor.isActive !== undefined
              ? advisor.isActive
              : advisor.is_active !== undefined
                ? advisor.is_active
                : true,
          totalContributions: advisor.totalContributions || 0,
          lastUpdated: advisor.lastUpdated ? new Date(advisor.lastUpdated) : new Date(),
        }))

        console.log("✅ Transformed advisors:", transformedAdvisors)
        setAdvisors(transformedAdvisors)
      } catch (err) {
        console.error("❌ Error fetching advisors:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch advisors")

        // Fallback to mock data if API fails
        console.log("🔄 Using fallback data...")
        setAdvisors([
          {
            id: "minerva-haugabrooks",
            slug: "minerva-haugabrooks",
            fullName: "Dr. Minerva Haugabrooks",
            role: "Community Development Strategist",
            bio: "AI agent specializing in community development, urban planning, and social impact assessment.",
            avatar: "/placeholder.svg?height=120&width=120&text=Dr.+Minerva",
            specialties: ["Community Development", "Urban Planning", "Cooperative Economics"],
            quotes: [],
            timeline: [],
            media: [],
            contributions: [],
            isActive: true,
            totalContributions: 0,
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
            quotes: [],
            timeline: [],
            media: [],
            contributions: [],
            isActive: true,
            totalContributions: 0,
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
