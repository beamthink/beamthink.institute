"use client"

import { useState, useEffect } from "react"

interface Project {
  id: string
  title: string
  summary: string
  description: string
  status: "planning" | "active" | "archived"
  projectType: string
  nodeId: string
  podId: string
  budget: number
  raised: number
  source: "supabase" | "sanity"
}

interface Advisor {
  id: string
  slug: string
  fullName: string
  role: string
  bio: string
  detailedBio: string
  avatar: string
  specialties: string[]
  isActive: boolean
  source: "supabase" | "sanity"
  // Add these fields to match the dashboard expectations
  quotes?: string[]
  timeline?: any[]
  media?: any[]
  contributions?: any[]
  chatPersonality?: string
  voiceCharacteristics?: string
  totalContributions?: number
  lastUpdated?: Date
}

export function useProjects(nodeId?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const url = nodeId ? `/api/projects?nodeId=${nodeId}` : "/api/projects"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data.projects)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [nodeId])

  const createProject = async (projectData: Omit<Project, "id" | "raised" | "source">) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const data = await response.json()

      // Refresh the projects list
      const refreshResponse = await fetch("/api/projects")
      const refreshData = await refreshResponse.json()
      setProjects(refreshData.projects)

      return data
    } catch (err) {
      throw err
    }
  }

  return { projects, loading, error, createProject }
}

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        setLoading(true)
        const response = await fetch("/api/advisors")

        if (!response.ok) {
          throw new Error("Failed to fetch advisors")
        }

        const data = await response.json()
        setAdvisors(data.advisors)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAdvisors()
  }, [])

  return { advisors, loading, error }
}
