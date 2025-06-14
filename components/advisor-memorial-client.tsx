"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/lib/sanity"
import { PortableText, type PortableTextComponents, type PortableTextMarkComponentProps } from "@portabletext/react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

// Web Speech API types
type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? typeof window.webkitSpeechRecognition
  : typeof window.SpeechRecognition

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
  interpretation: any
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

// Import Lucide React icons
import { ArrowLeft, Quote, MessageCircle, Camera } from "lucide-react"

// Import shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Import custom components
import ContributionModal from "./contribution-modal"
import LiveContributionsFeed from "./live-contributions-feed"
import QuickContributeFAB from "./quick-contribute-fab"
import { toast } from "sonner"

// --- INTERFACES ---
interface SupabaseAdvisor {
  id: string
  slug: string
  full_name: string
  role: string
  bio: string
  avatar: string
  sanity_person_id?: string | null
  specialties?: string[] | null
}

interface SanityPersonData {
  _id: string
  _type: "person"
  fullName?: string
  detailedBio?: any
  timeline?: Array<{ year: number; title: string; description: string; category: string }>
  quotes?: string[]
  media?: Array<{
    _type: string
    title?: string
    description?: string
    url?: string
    asset?: { _ref: string; url?: string; originalFilename?: string }
    alt?: string
    tags?: string[]
    uploadedBy?: string
    uploadedAt?: string
    approved?: boolean
  }>
  contributions?: Array<{
    _type: string
    title?: string
    content?: string
    contributorName?: string
    contributorEmail?: string
    submittedAt?: string
    approved?: boolean
    tags?: string[]
  }>
  chatPersonality?: string
  voiceCharacteristics?: string
  keyWorks?: string[]
}

// --- REMOVED portableTextComponents FROM PROPS INTERFACE ---
interface AdvisorMemorialClientProps {
  advisorData: {
    basic: SupabaseAdvisor
    detailed: SanityPersonData | null
  }
  // portableTextComponents: PortableTextComponents; // <--- REMOVED THIS LINE
}

// --- PORTABLE TEXT COMPONENTS (DEFINED LOCALLY IN THIS CLIENT COMPONENT FILE) ---
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource & { alt?: string; asset?: { _ref: string } } }) => {
      if (!value.asset) return null
      return (
        <Image
          className="w-full h-auto my-4 rounded-lg"
          src={urlForImage(value).width(800).url() || "/placeholder.svg"}
          alt={value.alt || "Image"}
          width={800}
          height={450}
          priority
        />
      )
    },
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<{ href: string; _type: string }>) => {
      const rel = !value?.href?.startsWith("/") ? "noreferrer noopener" : undefined
      return (
        <a href={value?.href} rel={rel} className="text-blue-500 hover:underline">
          {children}
        </a>
      )
    },
  },
}

// --- UPDATED COMPONENT FUNCTION SIGNATURE ---
export default function AdvisorMemorialClient({ advisorData }: AdvisorMemorialClientProps) { // <--- REMOVED portableTextComponents FROM HERE
  const { basic, detailed } = advisorData
  const [activeTab, setActiveTab] = useState("overview")
  const [showContributionModal, setShowContributionModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Voice-related state
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setIsListening(false)
          toast.success("Speech recognized.")
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          toast.error("Speech recognition error. Please try again.")
        }
        recognitionRef.current.onend = () => setIsListening(false)
      }
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }
    }
  }, [])

  const voiceProfiles = {
    "minerva-haugabrooks": { rate: 0.9, pitch: 1.1, volume: 0.8, voiceName: "female" },
    "james-smith": { rate: 1.0, pitch: 0.9, volume: 0.8, voiceName: "male" },
  }

  const speakText = (text: string, advisorId: string) => {
    if (!synthRef.current || !voiceEnabled) return
    stopSpeaking()
    const utterance = new SpeechSynthesisUtterance(text)
    const profile = voiceProfiles[advisorId as keyof typeof voiceProfiles]
    if (profile) {
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = profile.volume
      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.toLowerCase().includes(profile.voiceName) || voice.lang.includes("en-US"),
      )
      if (preferredVoice) utterance.voice = preferredVoice
    }
    utterance.onstart = () => setIsSpeaking(true)
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
    if (synthRef.current) synthRef.current.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isSpeaking) stopSpeaking()
  }

  const handleContributionSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1)
    toast.success("Thank you! Your contribution has been submitted for review.")
  }

  // Fallback for avatar if Supabase doesn't have it or it's not a URL
  const advisorAvatar = basic.avatar && basic.avatar.startsWith("http") ? basic.avatar : "/placeholder.svg"

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/?advisor=${basic.slug}`} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with {basic.full_name.split(" ")[0]}
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl" />
          <Card className="relative bg-gray-900/50 border-gray-700 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 border-4 border-gray-600">
                    <AvatarImage src={advisorAvatar || "/placeholder.svg"} alt={basic.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                      {basic.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{basic.full_name}</h1>
                      <p className="text-xl text-gray-300 mb-2">{basic.role}</p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        AI Memorial Agent
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Living Memorial
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{basic.bio}</p>

                  {/* AI Advisor Specialties from Supabase data */}
                  {basic.specialties && basic.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {basic.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-800">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-gray-800">
              Quotes
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-gray-800">
              Live Feed
            </TabsTrigger>
            <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-800">
              Legacy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {detailed?.detailedBio ? (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    {/* COMPONENTS PROP NOW REFERS TO THE LOCALLY DEFINED ONE */}
                    <PortableText value={detailed.detailedBio} components={portableTextComponents} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Detailed biography content will be available once Sanity is configured and linked. In the meantime,
                    you can contribute memories, photos, and timeline events using the floating action button.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Life & Career Timeline</CardTitle>
                <p className="text-gray-400 text-sm">Community-contributed timeline events</p>
              </CardHeader>
              <CardContent>
                {detailed?.timeline && detailed.timeline.length > 0 ? (
                  <div className="space-y-6">
                    {detailed.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {event.year}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-white text-lg font-semibold mb-2">{event.title}</h3>
                          <p className="text-gray-300">{event.description}</p>
                          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400 capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No timeline events yet.</p>
                    <p className="text-500 text-sm">Use the floating action button to add timeline events!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Notable Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detailed?.quotes && detailed.quotes.length > 0 ? (
                  <div className="space-y-6">
                    {detailed.quotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                        <p className="text-gray-300 text-lg italic mb-2">"{quote}"</p>
                        <cite className="text-gray-400">— {basic.full_name}</cite>
                      </blockquote>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No quotes available yet.</p>
                    <p className="text-gray-500 text-sm">Contribute memories that include memorable quotes!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Contributions Feed Tab */}
          <TabsContent value="contributions">
            <LiveContributionsFeed advisorSlug={basic.slug} refreshTrigger={refreshTrigger} />
          </TabsContent>

          {/* Legacy Tab */}
          <TabsContent value="legacy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Impact & Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Living Memorial</h4>
                      <p className="text-gray-300 text-sm">
                        This memorial grows with community contributions - photos, memories, timeline events, and
                        documents.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">AI Agent</h4>
                      <p className="text-gray-300 text-sm">
                        Chat with the AI version to get insights based on their documented work and philosophy.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Community Archive</h4>
                      <p className="text-gray-300 text-sm">
                        A collaborative space where anyone can contribute to preserving and sharing their legacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">How to Contribute</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Add Photos</p>
                        <p className="text-gray-400 text-xs">Share historical photos or images</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Timeline Events</p>
                        <p className="text-gray-400 text-xs">Add important life milestones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Share Memories</p>
                        <p className="text-gray-400 text-xs">Personal stories and experiences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg">
                      <Camera className="h-5 w-5 text-orange-400" />
                      <div>
                        <p className="text-white font-medium text-sm">Upload Documents</p>
                        <p className="text-gray-400 text-xs">Letters, articles, or papers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Contribute FAB */}
        <QuickContributeFAB
          advisorSlug={basic.slug}
          advisorName={basic.full_name}
          onContributionAdded={handleContributionSubmitted}
        />

        {/* Contribution Modal */}
        <ContributionModal
          isOpen={showContributionModal}
          onClose={() => setShowContributionModal(false)}
          advisorName={basic.full_name}
          advisorSlug={basic.slug}
          onContributionSubmitted={handleContributionSubmitted}
        />
      </div>
    </div>
  )
}