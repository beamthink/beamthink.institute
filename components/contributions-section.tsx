"use client"

import { useState } from "react"
import { Heart, MessageSquare, FileText, ImageIcon, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Contribution {
  _key: string
  type: string
  title: string
  content: string
  contributorName: string
  contributorEmail: string
  submittedAt: string
  approved: boolean
  tags: string[]
}

interface ContributionsSectionProps {
  contributions: Contribution[]
  advisorName: string
}

const getContributionIcon = (type: string) => {
  switch (type) {
    case "memory":
      return <Heart className="h-5 w-5" />
    case "quote":
      return <MessageSquare className="h-5 w-5" />
    case "document":
      return <FileText className="h-5 w-5" />
    case "media":
      return <ImageIcon className="h-5 w-5" />
    default:
      return <MessageSquare className="h-5 w-5" />
  }
}

export default function ContributionsSection({ contributions, advisorName }: ContributionsSectionProps) {
  const [selectedType, setSelectedType] = useState("all")

  const approvedContributions = contributions.filter((c) => c.approved)
  const filteredContributions =
    selectedType === "all" ? approvedContributions : approvedContributions.filter((c) => c.type === selectedType)

  const contributionTypes = [...new Set(contributions.map((c) => c.type))]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white">Community Contributions</CardTitle>
          <p className="text-gray-400">Stories, memories, and insights shared by the community about {advisorName}</p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                All ({approvedContributions.length})
              </TabsTrigger>
              {contributionTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="data-[state=active]:bg-gray-700 capitalize">
                  {type}s ({approvedContributions.filter((c) => c.type === type).length})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedType} className="mt-6">
              <div className="space-y-4">
                {filteredContributions.map((contribution) => (
                  <Card key={contribution._key} className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          {getContributionIcon(contribution.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-semibold">{contribution.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs capitalize">
                                  {contribution.type}
                                </Badge>
                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {contribution.contributorName}
                                </span>
                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(contribution.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-gray-300 leading-relaxed mb-4">
                            {contribution.type === "quote" ? (
                              <blockquote className="border-l-4 border-blue-500 pl-4 italic">
                                "{contribution.content}"
                              </blockquote>
                            ) : (
                              <p>{contribution.content}</p>
                            )}
                          </div>

                          {contribution.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {contribution.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredContributions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No contributions of this type yet.</p>
                    <Button variant="outline" className="mt-4">
                      Be the first to contribute
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
