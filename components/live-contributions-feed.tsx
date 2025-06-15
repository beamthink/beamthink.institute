"use client"

import { useState, useEffect } from "react"
import { Clock, User, Camera, FileText, Heart, Calendar, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { urlForImage } from "@/lib/sanity"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface LiveContribution {
  _id: string
  type: string
  title: string
  content?: string
  contributorName: string
  submittedAt: string
  timelineYear?: number
  timelineCategory?: string
  image?: SanityImageSource
  caption?: string
  documentFile?: any
  approved?: boolean
  media?: Array<{
    _type: string
    title?: string
    type?: string
    asset?: {
      _ref: string
      url?: string
    }
  }>
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
      console.log('Fetching contributions for advisor:', advisorSlug)
      const response = await fetch(`/api/contributions?advisorSlug=${advisorSlug}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch contributions')
      }
      const data = await response.json()
      console.log('Contributions API response:', JSON.stringify(data, null, 2))
      
      // Filter out any null or invalid contributions
      const validContributions = (data.contributions || [])
        .filter((c: LiveContribution) => c && c._id && c.type)
      
      console.log('Valid contributions after filtering:', JSON.stringify(validContributions, null, 2))
      setContributions(validContributions)
    } catch (error) {
      console.error("Error fetching contributions:", error)
      setContributions([])
    } finally {
      setLoading(false)
    }
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "photo":
      case "media":
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
      case "media":
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

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

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
            {contributions.map((contribution) => 
              contribution && contribution._id && (
                <div
                  key={contribution._id}
                  className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-700">
                        {contribution.contributorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2) || "??"}
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

                    {contribution.type === "photo" && contribution.image && (
                      <div className="mt-2 space-y-2">
                        <div className="relative group">
                          <img
                            src={urlForImage(contribution.image as SanityImageSource).width(800).url() || "/placeholder.svg"}
                            alt={contribution.caption || contribution.title || "Photo"}
                            className="w-full h-48 md:h-64 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(
                                urlForImage(contribution.image as SanityImageSource).url() || "",
                                contribution.caption || contribution.title || "image"
                              )}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">{contribution.contributorName}</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
