"use client"

import { useState, useEffect } from "react"
import { Bell, X, Camera, Calendar, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@sanity/client"
import { urlForImage } from "@/lib/sanity"
import { motion, AnimatePresence } from "framer-motion"

// Create a read-only Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-01",
  useCdn: true,
})

interface Contribution {
  _id: string
  type: "photo" | "timeline" | "memory" | "document"
  title: string
  content?: string
  contributorName: string
  submittedAt: string
  image?: {
    _type: "image"
    asset: {
      _ref: string
    }
  }
  caption?: string
  timelineYear?: number
  timelineCategory?: string
  documentFile?: {
    _type: "file"
    asset: {
      _ref: string
    }
  }
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  // Fetch contributions from Sanity
  const fetchContributions = async () => {
    try {
      const query = `*[_type == "contribution" && approved == true] | order(submittedAt desc)[0...10] {
        _id,
        type,
        title,
        content,
        contributorName,
        submittedAt,
        image,
        caption,
        timelineYear,
        timelineCategory,
        documentFile
      }`
      
      const result = await sanityClient.fetch(query)
      setContributions(result)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Error fetching contributions:", error)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchContributions()
  }, [])

  // Poll for new contributions every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchContributions, 30000)
    return () => clearInterval(interval)
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = sanityClient
      .listen('*[_type == "contribution" && approved == true]')
      .subscribe(() => {
        fetchContributions()
      })

    return () => subscription.unsubscribe()
  }, [])

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="h-4 w-4" />
      case "timeline":
        return <Calendar className="h-4 w-4" />
      case "memory":
        return <MessageSquare className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Notification Trigger Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-12 w-12 rounded-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-800/95 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 p-0 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-20 left-6 z-40 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                <h3 className="text-sm font-medium text-white">Recent Activity</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto">
                {contributions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {contributions.map((contribution) => (
                      <motion.div
                        key={contribution._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            {getContributionIcon(contribution.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-white truncate">
                                  {contribution.title || `${contribution.type} contribution`}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {contribution.content || contribution.caption}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px] bg-gray-700">
                                  {contribution.contributorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{contribution.contributorName}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(contribution.submittedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
