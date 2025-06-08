"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Quote, FileText, ExternalLink, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TimelineComponent from "./timeline-component"
import MediaGallery from "./media-gallery"
import ContributionsSection from "./contributions-section"

interface AdvisorMemorialProps {
  advisorData: {
    basic: {
      id: string
      slug: string
      full_name: string
      role: string
      bio: string
      detailed_bio: string
      avatar: string
      specialties: string[]
      is_active: boolean
      created_at: string
      updated_at: string
      sanity_person_id?: string
    }
    detailed?: {
      _id: string
      fullName: string
      detailedBio: any // PortableText content
      birthYear?: number
      deathYear?: number
      specialties: string[]
      keyWorks: string[]
      quotes: string[]
      timeline: Array<{
        _key: string
        year: number
        title: string
        description: string
        category: string
      }>
      media: Array<{
        _key: string
        title: string
        description: string
        type: string
        asset: {
          _id: string
          url: string
          metadata: any
        }
      }>
      contributions: Array<{
        _key: string
        type: string
        title: string
        content: string
        contributorName: string
        contributorEmail: string
        submittedAt: string
        approved: boolean
        tags: string[]
      }>
      chatPersonality: string
      voiceCharacteristics: string
    }
  }
}

export default function AdvisorMemorial({ advisorData }: AdvisorMemorialProps) {
  const { basic, detailed } = advisorData
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate years of life/work
  const lifeSpan =
    detailed?.birthYear && detailed?.deathYear
      ? `${detailed.birthYear} - ${detailed.deathYear}`
      : detailed?.birthYear
        ? `${detailed.birthYear} - Present`
        : "Dates Unknown"

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
                    <AvatarImage src={basic.avatar || "/placeholder.svg"} alt={basic.full_name} />
                    <AvatarFallback className="text-2xl">{basic.full_name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{basic.full_name}</h1>
                      <p className="text-xl text-gray-300 mb-2">{basic.role}</p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {lifeSpan}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {basic.is_active ? "Active AI Agent" : "Legacy Archive"}
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{basic.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {basic.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
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
            <TabsTrigger value="media" className="data-[state=active]:bg-gray-800">
              Media
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-gray-800">
              Contributions
            </TabsTrigger>
            <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-800">
              Legacy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Biography */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      {detailed?.detailedBio ? (
                        // If we have rich content from Sanity, render it
                        <div className="text-gray-300 leading-relaxed space-y-4">
                          {/* This would be PortableText content - for now showing as paragraphs */}
                          {basic.detailed_bio.split("\n\n").map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-300 leading-relaxed">{basic.detailed_bio}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Facts */}
              <div className="space-y-6">
                {/* Key Works */}
                {detailed?.keyWorks && detailed.keyWorks.length > 0 && (
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Key Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {detailed.keyWorks.map((work, index) => (
                          <li key={index} className="text-gray-300 text-sm">
                            {work}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Notable Quotes */}
                {detailed?.quotes && detailed.quotes.length > 0 && (
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Quote className="h-5 w-5" />
                        Notable Quotes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {detailed.quotes.slice(0, 3).map((quote, index) => (
                          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-300">
                            "{quote}"
                          </blockquote>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Personality */}
                {detailed?.chatPersonality && (
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">AI Personality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm leading-relaxed">{detailed.chatPersonality}</p>
                      {detailed.voiceCharacteristics && (
                        <div className="mt-4">
                          <h4 className="text-white font-medium mb-2">Voice Characteristics:</h4>
                          <p className="text-gray-400 text-sm">{detailed.voiceCharacteristics}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            {detailed?.timeline ? (
              <TimelineComponent timeline={detailed.timeline} />
            ) : (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Timeline data will be available once Sanity is configured.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            {detailed?.media ? (
              <MediaGallery media={detailed.media} />
            ) : (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Media gallery will be available once Sanity is configured.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions">
            {detailed?.contributions ? (
              <ContributionsSection contributions={detailed.contributions} advisorName={basic.full_name} />
            ) : (
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Community contributions will be available once Sanity is configured.</p>
                </CardContent>
              </Card>
            )}
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
                      <h4 className="text-white font-medium mb-2">Communities Served</h4>
                      <p className="text-gray-300 text-sm">
                        Over 200 community development projects across the American South
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Students Mentored</h4>
                      <p className="text-gray-300 text-sm">Hundreds of students who became community leaders</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Continuing Legacy</h4>
                      <p className="text-gray-300 text-sm">
                        AI agent continues to provide guidance based on decades of experience
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">How to Engage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" asChild>
                      <Link href={`/?advisor=${basic.slug}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with AI Agent
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Contribute a Memory
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share This Memorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
