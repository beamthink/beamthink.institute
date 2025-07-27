"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, FileText, ImageIcon, Video, Music, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MediaItem {
  _key: string
  title: string
  description: string
  type: string
  asset: {
    _id: string
    url: string
    metadata: any
  }
}

interface MediaGalleryProps {
  media: MediaItem[]
}

const getMediaIcon = (type: string) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5" />
    case "video":
      return <Video className="h-5 w-5" />
    case "audio":
      return <Music className="h-5 w-5" />
    case "document":
      return <FileText className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const groupedMedia = media.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, MediaItem[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedMedia).map(([type, items]) => (
        <Card key={type} className="bg-gray-900/50 border-gray-700 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 capitalize">
              {getMediaIcon(type)}
              {type}s ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card
                  key={item._key}
                  className="bg-gray-800/50 border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                      {item.type === "image" ? (
                        <Image
                          src={item.asset.url || "/placeholder.svg"}
                          alt={item.title}
                          width={300}
                          height={200}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-gray-400">{getMediaIcon(item.type)}</div>
                      )}
                    </div>
                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {item.type}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        {item.type === "video" || item.type === "audio" ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
