"use client"

import { useState, useEffect } from "react"
import { Clock, User, Camera, FileText, Heart, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LiveContribution {
  id: string
  type: "photo" | "timeline" | "memory" | "document"
  title: string
  content?: string
  contributorName: string
  submittedAt: string
  timelineYear?: number
  timelineCategory?: string
  mediaUrl?: string
  mediaType?: string
}

interface LiveContributionsFeedProps {
  advisorSlug: string
  refreshTrigger?: number
}

export default function LiveContributionsFeed({ advisorSlug, refreshTrigger }: LiveContributionsFeedProps) {
  const [contributions, setContributions] = useState<LiveContribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContributions()
  }, [advisorSlug, refreshTrigger])

  const fetchContributions = async () => {
    try {
      // Mock data for demo - in production, fetch from API
      const mockContributions: LiveContribution[] = [
        {
          id: "1",
          type: "photo",
          title: "Dr. Haugabrooks at community meeting",
          contributorName: "Sarah Johnson",
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          mediaUrl: "/placeholder.svg?height=200&width=300&text=Community+Meeting",
          mediaType: "image",
        },
        {
          id: "2",
          type: "timeline",
          title: "Founded Community Land Trust",
          content:
            "Established the first community land trust in the region, securing affordable housing for 50 families.",
          contributorName: "Michael Chen",
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          timelineYear: 1987,
          timelineCategory: "achievement",
        },
        {
          id: "3",
          type: "memory",
          title: "Working together on the Auburn Avenue project",
          content:
            "I remember Dr. Haugabrooks spending hours listening to community members in the barbershop, really understanding what people needed before proposing any solutions.",
          contributorName: "James Washington",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
      ]

      setContributions(mockContributions)
    } catch (error) {
      console.error("Error fetching contributions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="h-4 w-4" />
      case "timeline":
        return <Calendar className="h-4 w-4" />
      case "memory":
        return <Heart className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getContributionColor = (type: string) => {
    switch (type) {
      case "photo":
        return "border-blue-500 text-blue-400"
      case "timeline":
        return "border-green-500 text-green-400"
      case "memory":
        return "border-purple-500 text-purple-400"
      case "document":
        return "border-orange-500 text-orange-400"
      default:
        return "border-gray-500 text-gray-400"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Loading recent contributions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Contributions
        </CardTitle>
        <p className="text-gray-400 text-sm">Latest additions from the community</p>
      </CardHeader>
      <CardContent>
        {contributions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No recent contributions.</p>
            <p className="text-gray-500 text-sm mt-1">Be the first to add something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gray-700">
                      {contribution.contributorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-xs ${getContributionColor(contribution.type)}`}>
                      {getContributionIcon(contribution.type)}
                      <span className="ml-1 capitalize">{contribution.type}</span>
                    </Badge>
                    <span className="text-gray-500 text-xs">{formatTimeAgo(contribution.submittedAt)}</span>
                  </div>

                  <h4 className="text-white font-medium text-sm mb-1">{contribution.title}</h4>

                  {contribution.content && (
                    <p className="text-gray-300 text-xs line-clamp-2 mb-2">{contribution.content}</p>
                  )}

                  {contribution.type === "timeline" && contribution.timelineYear && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {contribution.timelineYear}
                      </Badge>
                      {contribution.timelineCategory && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {contribution.timelineCategory}
                        </Badge>
                      )}
                    </div>
                  )}

                  {contribution.mediaUrl && contribution.type === "photo" && (
                    <div className="mt-2">
                      <img
                        src={contribution.mediaUrl || "/placeholder.svg"}
                        alt={contribution.title}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-2">
                    <User className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{contribution.contributorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
