"use client"

import { useState, useEffect } from "react"
import { Bell, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "./NotificationContext"

export function CombinedActionButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { openNotifications, unreadCount } = useNotifications()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    if (isScrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      openNotifications()
    }
  }

  const getIcon = () => {
    if (isScrolled) {
      return <ChevronUp className="h-5 w-5 text-white" />
    }
    return <Bell className="h-5 w-5 text-white" />
  }

  const getTooltip = () => {
    if (isScrolled) {
      return "Scroll to top"
    }
    return "Notifications"
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <Button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-xl border border-orange-400/50 hover:from-orange-600 hover:to-red-600 shadow-2xl transition-all duration-200 hover:scale-105"
        size="icon"
        title={getTooltip()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isScrolled ? 'scroll' : 'notification'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
        
        {/* Notification badge - only show when not scrolled */}
        {!isScrolled && unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 p-0 text-xs text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900/95 text-white text-sm rounded-lg backdrop-blur-xl border border-gray-700/50 whitespace-nowrap"
          >
            {getTooltip()}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
