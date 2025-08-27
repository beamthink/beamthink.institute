"use client"

import { useState, useEffect } from "react"
import { Bell, X, Camera, Calendar, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { urlFor } from "@/lib/sanity"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "./NotificationContext"

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
  const { isNotificationOpen, closeNotifications, unreadCount, setUnreadCount } = useNotifications()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  // Fetch contributions from Sanity
  const fetchContributions = async () => {
    try {
      const res = await fetch('/api/contributions');
      const data = await res.json();
      if (res.ok) {
        setContributions(data);
        setLastChecked(new Date());
        // Update unread count based on new contributions
        const newCount = data.filter((c: Contribution) => 
          new Date(c.submittedAt) > lastChecked
        ).length;
        setUnreadCount(newCount);
      } else {
        console.error("API error:", data.error);
      }
    } catch (err) {
      console.error("Error fetching contributions:", err);
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
      {/* Notification Panel */}
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeNotifications}
            />
            <motion.div
              initial={{ opacity: 0, x: 300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-orange-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Notifications</h2>
                    <p className="text-sm text-gray-400">
                      {contributions.length} contributions
                    </p>
                  </div>
                </div>
                <Button
                  onClick={closeNotifications}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {contributions.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No contributions yet</p>
                    <p className="text-sm text-gray-500">Check back later for updates</p>
                  </div>
                ) : (
                  contributions.map((contribution) => (
                    <motion.div
                      key={contribution._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              {contribution.contributorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getContributionIcon(contribution.type)}
                            <span className="text-sm font-medium text-white">
                              {contribution.contributorName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(contribution.submittedAt)}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-white mb-1">
                            {contribution.title}
                          </h4>
                          {contribution.content && (
                            <p className="text-sm text-gray-300 line-clamp-2">
                              {contribution.content}
                            </p>
                          )}
                          {contribution.image && (
                            <div className="mt-3">
                              <img
                                src={urlFor(contribution.image).width(200).height(150).url()}
                                alt={contribution.caption || "Contribution image"}
                                className="w-full h-24 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
