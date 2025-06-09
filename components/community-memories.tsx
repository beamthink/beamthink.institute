"use client"

import { useState, useEffect } from "react"
import { Calendar, User, Download, Play, Pause } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Contribution {
  id: string
  title: string
  description: string
  contributorName: string
  contributorEmail: string
  submittedAt: string
  approved: boolean
  tags: string[]
  files: {
    id: string
    name: string
    type: "image" | "video" | "audio" | "document"
    url: string
    size: number
  }[]
}

interface CommunityMemoriesProps {
  advisorSlug: string
  refreshTrigger: number
}

export default function CommunityMemories({ advisorSlug, refreshTrigger }: CommunityMemoriesProps) {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState("all")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  useEffect(() => {
    fetchContributions()
  }, [advisorSlug, refreshTrigger])

  const fetchContributions = async () => {
    try {
      const response = await fetch(`/api/contributions?advisorSlug=${advisorSlug}`)
      if (response.ok) {
        const data = await response.json()
        setContributions(data.contributions || [])
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error)
    } finally {
      setLoading(false)
    }
  }

  const approvedContributions = contributions.filter((c) => c.approved)
  const filteredContributions =
    selectedType === "all"
      ? approvedContributions
      : approvedContributions.filter((c) => c.files.some((f) => f.type === selectedType))

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return "🖼️"
      case "video":
        return "🎥"
      case "audio":
        return "🎵"
      case "document":
        return "📄"
      default:
        return "📎"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleAudioPlay = (audioId: string) => {
    if (playingAudio === audioId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(audioId)
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Loading community memories...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white">Community Memories</CardTitle>
          <p className="text-gray-400">Stories, photos, documents, and memories shared by the community</p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                All ({approvedContributions.length})
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-gray-700">
                Photos ({approvedContributions.filter((c) => c.files.some((f) => f.type === "image")).length})
              </TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-gray-700">
                Videos ({approvedContributions.filter((c) => c.files.some((f) => f.type === "video")).length})
              </TabsTrigger>
              <TabsTrigger value="audio" className="data-[state=active]:bg-gray-700">
                Audio ({approvedContributions.filter((c) => c.files.some((f) => f.type === "audio")).length})
              </TabsTrigger>
              <TabsTrigger value="document" className="data-[state=active]:bg-gray-700">
                Documents ({approvedContributions.filter((c) => c.files.some((f) => f.type === "document")).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType} className="mt-6">
              {filteredContributions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    {selectedType === "all"
                      ? "No memories have been shared yet."
                      : `No ${selectedType} memories have been shared yet.`}
                  </p>
                  <p className="text-gray-500 text-sm">Be the first to contribute to this memorial!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredContributions.map((contribution) => (
                    <Card key={contribution.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white font-semibold text-lg mb-2">{contribution.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {contribution.contributorName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(contribution.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{contribution.description}</p>

                        {/* Tags */}
                        {contribution.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {contribution.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Files */}
                        {contribution.files.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-white font-medium">Attached Files:</h4>

                            {/* Images Grid */}
                            {contribution.files.filter((f) => f.type === "image").length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {contribution.files
                                  .filter((f) => f.type === "image")
                                  .map((file) => (
                                    <div key={file.id} className="relative group">
                                      <img
                                        src={file.url || "/placeholder.svg"}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <Button size="sm" variant="secondary">
                                          View Full Size
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Other Files */}
                            {contribution.files.filter((f) => f.type !== "image").length > 0 && (
                              <div className="space-y-2">
                                {contribution.files
                                  .filter((f) => f.type !== "image")
                                  .map((file) => (
                                    <div
                                      key={file.id}
                                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getFileTypeIcon(file.type)}</span>
                                        <div>
                                          <p className="text-white font-medium">{file.name}</p>
                                          <p className="text-gray-400 text-sm">
                                            {file.type} • {formatFileSize(file.size)}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {file.type === "audio" && (
                                          <Button size="sm" variant="outline" onClick={() => handleAudioPlay(file.id)}>
                                            {playingAudio === file.id ? (
                                              <Pause className="h-4 w-4" />
                                            ) : (
                                              <Play className="h-4 w-4" />
                                            )}
                                          </Button>
                                        )}

                                        {file.type === "video" && (
                                          <Button size="sm" variant="outline">
                                            <Play className="h-4 w-4 mr-2" />
                                            Play
                                          </Button>
                                        )}

                                        <Button size="sm" variant="outline" asChild>
                                          <a href={file.url} download={file.name}>
                                            <Download className="h-4 w-4" />
                                          </a>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Hidden audio elements for playback */}
                            {contribution.files
                              .filter((f) => f.type === "audio")
                              .map((file) => (
                                <audio
                                  key={file.id}
                                  src={file.url}
                                  controls={playingAudio === file.id}
                                  className={playingAudio === file.id ? "w-full mt-2" : "hidden"}
                                  onEnded={() => setPlayingAudio(null)}
                                />
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
