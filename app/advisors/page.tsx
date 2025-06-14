"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Send, Volume2, VolumeX, Pause, Play, Eye, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useAdvisors } from "@/hooks/use-advisors"

export default function AdvisorsPage() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{
    [key: string]: Array<{
      role: "user" | "assistant"
      content: string
      timestamp: Date
      audioUrl?: string
      isPlaying?: boolean
    }>
  }>({})
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const { advisors: aiAgents, loading: advisorsLoading, error: advisorsError } = useAdvisors()

  // Debug logging
  useEffect(() => {
    console.log("🔍 Advisors Page State:", {
      loading: advisorsLoading,
      error: advisorsError,
      advisorsCount: aiAgents?.length || 0,
      advisors: aiAgents,
    })
  }, [advisorsLoading, advisorsError, aiAgents])

  // Voice profiles for each advisor
  const voiceProfiles = {
    "minerva-haugabrooks": {
      rate: 0.9,
      pitch: 1.1,
      volume: 0.8,
      voiceName: "female",
      accent: "southern",
      characteristics: "warm, thoughtful, measured",
    },
    "james-smith": {
      rate: 1.0,
      pitch: 0.9,
      volume: 0.8,
      voiceName: "male",
      accent: "midwest",
      characteristics: "clear, technical, friendly",
    },
  }

  // Toast notification functions
  const showErrorToast = (message: string) => {
    toast.error(message)
  }

  // Text-to-Speech Functions
  const speakText = (text: string, advisorId: string) => {
    if (!synthRef.current || !voiceEnabled) return

    // Stop any current speech
    stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)
    const profile = voiceProfiles[advisorId as keyof typeof voiceProfiles]

    if (profile) {
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = profile.volume

      // Try to find a suitable voice
      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.toLowerCase().includes(profile.voiceName) || voice.lang.includes("en-US"),
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    currentUtteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
    currentUtteranceRef.current = null
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  // Enhanced Chat functions with voice
  const handleSendMessage = (advisorId: string) => {
    if (!currentMessage.trim()) return

    const newMessage = {
      role: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => ({
      ...prev,
      [advisorId]: [...(prev[advisorId] || []), newMessage],
    }))

    setCurrentMessage("")

    // Simulate AI response with voice
    setTimeout(() => {
      const advisor = aiAgents.find((a) => a.id === advisorId)
      let aiResponseText = ""

      // Generate contextual response based on advisor personality
      if (advisorId === "minerva-haugabrooks") {
        if (currentMessage.toLowerCase().includes("community")) {
          aiResponseText =
            "You know, when I think about community development, I always come back to this fundamental truth: communities already have the solutions within them. Our job isn't to bring answers from the outside, but to help those internal solutions emerge and flourish. What specific community are you working with, and what have you noticed about their existing strengths?"
        } else if (currentMessage.toLowerCase().includes("project")) {
          aiResponseText =
            "Every successful project I've seen starts with deep listening. Before we talk about what needs to be built or changed, we need to understand what the community values most. Have you spent time just sitting with folks, maybe in their everyday spaces, hearing their stories about what matters to them?"
        } else {
          aiResponseText =
            "That's a thoughtful question, and it reminds me of something I learned early in my work in Alabama. The most sustainable changes happen when communities feel ownership over the process, not just the outcome. What's the context you're working in? I'd love to understand more about your situation so I can share some relevant experiences."
        }
      } else if (advisorId === "james-smith") {
        if (currentMessage.toLowerCase().includes("technology") || currentMessage.toLowerCase().includes("tech")) {
          aiResponseText =
            "You're touching on something I spent my whole career thinking about. Technology is never neutral - it either empowers communities or it extracts from them. The key question I always ask is: who controls the technology? Who owns the data? Who makes the decisions about how it's used? When communities have that control, technology becomes a tool for liberation rather than dependence."
        } else if (currentMessage.toLowerCase().includes("community")) {
          aiResponseText =
            "Community-controlled technology was my life's work, and I learned that the 'community' part is actually more important than the 'technology' part. The best tech solutions I ever implemented were the ones where the community told me what they needed, not the other way around. What specific challenges is your community facing that technology might help address?"
        } else {
          aiResponseText =
            "That's exactly the kind of question that gets to the heart of community technology work. In my experience, the most important thing is to start small and build trust. Communities have often been burned by technology promises before. What's your relationship to the community you're thinking about working with?"
        }
      } else {
        aiResponseText = `Thank you for your question. As ${advisor?.fullName}, I appreciate your interest in ${currentMessage.toLowerCase().includes("community") ? "community development" : "this topic"}. Based on my experience, I'd suggest starting with understanding the specific context of your community. What particular challenges or opportunities are you seeing? I find that the best solutions emerge when we truly listen to what the community is telling us.`
      }

      const aiResponse = {
        role: "assistant" as const,
        content: aiResponseText,
        timestamp: new Date(),
      }

      setChatMessages((prev) => ({
        ...prev,
        [advisorId]: [...(prev[advisorId] || []), aiResponse],
      }))

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => {
          speakText(aiResponseText, advisorId)
        }, 500)
      }
    }, 1500)
  }

  // Advisor Chat Component
  const AdvisorChat = ({ advisor }: { advisor: any }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      // Scroll to the bottom of the chat container when messages change
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, [chatMessages[advisor.id]])

    const handlePlayAudio = async (message: any) => {
      if (isPlaying) {
        // Pause the currently playing audio
        if (audioUrl) {
          const audio = new Audio(audioUrl)
          audio.pause()
        }
        setIsPlaying(false)
        setAudioUrl(null)
      } else {
        // For now, just use text-to-speech instead of API
        speakText(message.content, advisor.id)
      }
    }

    return (
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardHeader className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={advisor.avatar || "/placeholder.svg"} alt={advisor.fullName} />
            <AvatarFallback>{advisor.fullName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-white">{advisor.fullName}</CardTitle>
            <CardDescription className="text-gray-400">{advisor.role}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/advisors/${advisor.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit Memorial</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleVoice}>
                    {voiceEnabled ? (
                      <Volume2 className="h-5 w-5 text-gray-400" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{voiceEnabled ? "Disable Voice" : "Enable Voice"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col">
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-2 mb-3">
            {(chatMessages[advisor.id] || []).map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === "assistant" && voiceEnabled && (
                      <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(message)}>
                        {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(advisor.id)
                }
              }}
              className="flex-grow bg-gray-800 border-gray-700 text-white"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" onClick={() => handleSendMessage(advisor.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 mb-8">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">AI Advisors</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <p className="text-gray-400">Connect with AI agents for expert insights and guidance.</p>
        </div>

        {advisorsLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading AI advisors...</p>
          </div>
        ) : advisorsError ? (
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-400 font-bold mb-2">Error Loading Advisors</h3>
              <p className="text-red-300 text-sm mb-4">{advisorsError}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-700 text-red-400 hover:bg-red-900/30"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : aiAgents && aiAgents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiAgents.map((advisor) => (
              <AdvisorChat key={advisor.id} advisor={advisor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No AI advisors available.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/advisors/debug">Debug Page</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
