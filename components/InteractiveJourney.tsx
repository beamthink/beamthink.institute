"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlowOverlay } from './FlowOverlay'

interface InteractiveJourneyProps {
  isVisible: boolean
  role: 'participant' | 'community' | 'admin' | 'donor'
  onClose: () => void
}

const roleVideos = {
  participant: "https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/hero/3345545-hd_1920_1080_25fps.mp4",
  community: "https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/hero/7095074-uhd_4096_2160_25fps.mp4",
  admin: "https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/hero/6100011-uhd_4096_2160_30fps.mp4",
  donor: "https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/hero/5849608-hd_1920_1080_30fps.mp4"
}

const roleTitles = {
  participant: "Learning Journey",
  community: "Community Connection",
  admin: "Governance Path",
  donor: "Impact Journey"
}

const roleDescriptions = {
  participant: "Discover how to learn, grow, and develop skills through the BEAM network",
  community: "Connect with others and participate in cultural and community programs",
  admin: "Understand the legal and governance framework that supports BEAM initiatives",
  donor: "Learn how your support creates lasting impact across communities"
}

export function InteractiveJourney({ isVisible, role, onClose }: InteractiveJourneyProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [isVisible, role])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const skipTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
      setCurrentTime(seconds)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCardClick = (ngoId: string) => {
    // This will be handled by the parent component to scroll to or open the NGO
    console.log('Card clicked:', ngoId)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Main Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-6 top-6 bottom-6 w-96 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div>
                <h2 className="text-xl font-semibold text-white">{roleTitles[role]}</h2>
                <p className="text-sm text-gray-400">{roleDescriptions[role]}</p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  muted={isMuted}
                >
                  <source src={roleVideos[role]} type="video/mp4" />
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                  <div className="w-full p-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-600 rounded-full h-1 mb-3">
                      <div 
                        className="bg-orange-500 h-1 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={togglePlay}
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          onClick={() => skipTo(Math.max(0, currentTime - 10))}
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => skipTo(Math.min(duration, currentTime + 10))}
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        
                        <Button
                          onClick={toggleMute}
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Steps */}
            <div className="flex-1 px-6 pb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Journey Steps</h3>
              <div className="space-y-3">
                {role === 'participant' && (
                  <>
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-400 text-sm font-medium">Step 1: Learn</div>
                      <div className="text-blue-300 text-xs">Start with BEAM Education</div>
                    </div>
                    <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                      <div className="text-cyan-400 text-sm font-medium">Step 2: Practice</div>
                      <div className="text-cyan-300 text-xs">Develop skills through exchange</div>
                    </div>
                    <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                      <div className="text-teal-400 text-sm font-medium">Step 3: Research</div>
                      <div className="text-teal-300 text-xs">Access 24/7 library resources</div>
                    </div>
                  </>
                )}
                {role === 'donor' && (
                  <>
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <div className="text-red-400 text-sm font-medium">Step 1: Fund</div>
                      <div className="text-red-300 text-xs">Financial services & investment</div>
                    </div>
                    <div className="p-3 bg-pink-500/20 border border-pink-500/30 rounded-lg">
                      <div className="text-pink-400 text-sm font-medium">Step 2: Impact</div>
                      <div className="text-pink-300 text-xs">Support healthcare initiatives</div>
                    </div>
                    <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg">
                      <div className="text-rose-400 text-sm font-medium">Step 3: Sponsor</div>
                      <div className="text-rose-300 text-xs">Cultural & arts programs</div>
                    </div>
                  </>
                )}
                {/* Add other role steps as needed */}
              </div>
            </div>
          </motion.div>

          {/* Flow Overlay */}
          <FlowOverlay
            isVisible={isVisible}
            role={role}
            currentTime={currentTime}
            onCardClick={handleCardClick}
          />
        </>
      )}
    </AnimatePresence>
  )
}
