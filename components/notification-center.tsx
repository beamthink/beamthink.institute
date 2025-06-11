"use client"

import { useState, useEffect } from "react"
import { Bell, ExternalLink, Users, Settings, Activity, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Participant {
  id: string
  name: string
  role: string
  avatar?: string
  isOnline?: boolean
}

interface AccessTool {
  id: string
  name: string
  url: string
  icon?: string
}

interface Notification {
  id: string
  type: "contribution" | "activity" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"participants" | "tools" | "activity">("participants")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock data - replace with real data later
  const participants: Participant[] = [
    {
      id: "1",
      name: "Alex Chen",
      role: "Sound Designer",
      avatar: "/placeholder.svg?height=32&width=32",
      isOnline: true,
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      role: "Community Manager",
      avatar: "/placeholder.svg?height=32&width=32",
      isOnline: true,
    },
    {
      id: "3",
      name: "David Kim",
      role: "Developer",
      avatar: "/placeholder.svg?height=32&width=32",
      isOnline: false,
    },
  ]

  const accessTools: AccessTool[] = [
    {
      id: "1",
      name: "Website",
      url: "https://beam.eco",
    },
    {
      id: "2",
      name: "BEAM Wallet",
      url: "https://wallet.beam.eco",
    },
    {
      id: "3",
      name: "BEAM FCU App",
      url: "https://app.beam.eco",
    },
  ]

  // Mock notifications - replace with real data later
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "contribution",
        title: "New Photo Added",
        message: "Sarah added a photo to Minerva's memorial",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: "2",
        type: "activity",
        title: "Timeline Updated",
        message: 'New milestone added: "Founded BEAM Collective"',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        type: "system",
        title: "Welcome!",
        message: "Thanks for visiting the BEAM OS Dashboard",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <>
      {/* Notification Trigger Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-40 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "participants" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("participants")}
                className="text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                Participants
              </Button>
              <Button
                variant={activeTab === "tools" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tools")}
                className="text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                Tools
              </Button>
              <Button
                variant={activeTab === "activity" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("activity")}
                className="text-xs"
              >
                <Activity className="h-3 w-3 mr-1" />
                Activity
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {activeTab === "participants" && (
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Participants</h3>
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback className="text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{participant.name}</p>
                      <p className="text-xs text-gray-400 truncate">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tools" && (
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Access Tools</h3>
                {accessTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  >
                    <span className="text-sm text-white">{tool.name}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Activity</h3>
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        notification.read
                          ? "bg-gray-800/30 hover:bg-gray-800/50"
                          : "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/30"
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
    </>
  )
}
