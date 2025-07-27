import { Calendar, GraduationCap, Briefcase, Award, BookOpen, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineEvent {
  _key: string
  year: number
  title: string
  description: string
  category: string
}

interface TimelineComponentProps {
  timeline: TimelineEvent[]
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "education":
      return <GraduationCap className="h-5 w-5" />
    case "career":
      return <Briefcase className="h-5 w-5" />
    case "achievement":
      return <Award className="h-5 w-5" />
    case "publication":
      return <BookOpen className="h-5 w-5" />
    case "legacy":
      return <Heart className="h-5 w-5" />
    default:
      return <Calendar className="h-5 w-5" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "education":
      return "bg-blue-500"
    case "career":
      return "bg-green-500"
    case "achievement":
      return "bg-yellow-500"
    case "publication":
      return "bg-purple-500"
    case "legacy":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function TimelineComponent({ timeline }: TimelineComponentProps) {
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year)

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />

        {sortedTimeline.map((event, index) => (
          <div key={event._key} className="relative flex items-start gap-6 pb-8">
            {/* Timeline dot */}
            <div
              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${getCategoryColor(event.category)} text-white flex-shrink-0`}
            >
              {getCategoryIcon(event.category)}
            </div>

            {/* Content */}
            <Card className="flex-grow bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white text-xl font-semibold">{event.title}</h3>
                    <p className="text-gray-400 text-lg">{event.year}</p>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-400 capitalize">
                    {event.category}
                  </Badge>
                </div>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
