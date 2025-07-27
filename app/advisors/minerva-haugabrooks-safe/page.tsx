// Safe version of the memorial page with no external dependencies
import Link from "next/link"
import { ArrowLeft, Calendar, Quote, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SafeMinervaPage() {
  const advisor = {
    full_name: "Dr. Minerva Haugabrooks",
    role: "Community Development Strategist",
    bio: "AI agent specializing in community development, urban planning, and social impact assessment. Provides strategic insights for sustainable community initiatives.",
    detailed_bio: `Dr. Minerva Haugabrooks was a pioneering community development strategist whose work fundamentally shaped how we understand the intersection of urban planning, social justice, and economic empowerment. Born in 1945 in rural Alabama, she witnessed firsthand the challenges facing underserved communities and dedicated her life to developing innovative, community-centered solutions.

Her groundbreaking research on "Participatory Economic Development" introduced frameworks that prioritized community ownership and decision-making in development projects. Dr. Haugabrooks believed that sustainable change could only come from within communities themselves, with external support serving as a catalyst rather than a driving force.

Throughout her 40-year career, she advised on over 200 community development projects across the American South, establishing cooperative businesses, community land trusts, and participatory budgeting initiatives that continue to thrive today.`,
    specialties: [
      "Community Development",
      "Urban Planning",
      "Cooperative Economics",
      "Social Impact Assessment",
      "Participatory Democracy",
      "Community Land Trusts",
    ],
    slug: "minerva-haugabrooks",
  }

  const timeline = [
    {
      year: 1945,
      title: "Born in Rural Alabama",
      description: "Born to sharecropper parents in Macon County, Alabama, during the height of the Jim Crow era.",
      category: "education",
    },
    {
      year: 1967,
      title: "Graduated from Tuskegee University",
      description:
        "Earned Bachelor's degree in Sociology, inspired by the civil rights movement and community organizing.",
      category: "education",
    },
    {
      year: 1987,
      title: "Published Seminal Work",
      description:
        "Released 'Participatory Economic Development,' which became the foundational text for community-centered development.",
      category: "publication",
    },
  ]

  const quotes = [
    "True development doesn't happen to a community—it happens with a community.",
    "The best solutions are already within the community; our job is to help them emerge.",
    "Economic democracy is not just an ideal—it's a practical necessity for sustainable development.",
  ]

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
            <Link href={`/?advisor=${advisor.slug}`} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Minerva
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
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                      MH
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{advisor.full_name}</h1>
                      <p className="text-xl text-gray-300 mb-2">{advisor.role}</p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        AI Memorial Agent
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Active AI Agent
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{advisor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {advisor.specialties.map((specialty, index) => (
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-800">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-gray-800">
              Quotes
            </TabsTrigger>
            <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-800">
              Legacy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {advisor.detailed_bio.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Life & Career Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((event, index) => (
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
                <div className="space-y-6">
                  {quotes.map((quote, index) => (
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                      <p className="text-gray-300 text-lg italic mb-2">"{quote}"</p>
                      <cite className="text-gray-400">— {advisor.full_name}</cite>
                    </blockquote>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <Link href={`/?advisor=${advisor.slug}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with AI Agent
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contribute a Memory
                    </Button>
                    <Button variant="outline" className="w-full">
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
