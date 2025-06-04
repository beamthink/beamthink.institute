"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Bell,
  Users,
  MessageSquare,
  Plus,
  Edit,
  Eye,
  Navigation,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Play,
} from "lucide-react"
import Link from "next/link"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLocationSharing, setIsLocationSharing] = useState(false)

  const todayLessons = [
    {
      id: 1,
      student: "Sarah Johnson",
      instrument: "Piano",
      time: "2:00 PM",
      location: "Home Studio",
      status: "confirmed",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      student: "Mike Chen",
      instrument: "Guitar",
      time: "3:30 PM",
      location: "Community Center",
      status: "confirmed",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      level: "Intermediate",
      nextLesson: "March 15, 2024",
      progress: 85,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Mike Chen",
      instrument: "Guitar",
      level: "Beginner",
      nextLesson: "March 15, 2024",
      progress: 65,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emma Davis",
      instrument: "Viola",
      level: "Advanced",
      nextLesson: "March 16, 2024",
      progress: 92,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const recentQuestions = [
    {
      id: 1,
      student: "Sarah Johnson",
      question: "How should I practice the left hand part in measure 16?",
      type: "text",
      date: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      student: "Mike Chen",
      question: "Video recording of chord progression practice with detailed explanation of technique and challenges",
      type: "video",
      date: "1 day ago",
      status: "pending",
      transcript:
        "Today I practiced the assigned piece for about 30 minutes. I focused on the challenging passage in measures 16-20 where the left hand has those quick arpeggios...",
      duration: "3:45",
    },
  ]

  const handleLocationShare = () => {
    setIsLocationSharing(!isLocationSharing)
    if (!isLocationSharing) {
      // Simulate location sharing
      alert("Location sharing started. Students will be notified when you're en route.")
    } else {
      alert("Location sharing stopped.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">wlanvi</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant={isLocationSharing ? "default" : "outline"} size="sm" onClick={handleLocationShare}>
                <Navigation className="h-4 w-4 mr-2" />
                {isLocationSharing ? "Stop Sharing" : "Share Location"}
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>WL</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, wlanvi!</h1>
          <p className="text-gray-600">Manage your students, lessons, and assignments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Lessons</p>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Questions</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">$3,240</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your lessons for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={lesson.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {lesson.student
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{lesson.student}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Music className="h-4 w-4 mr-1" />
                              {lesson.instrument}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {lesson.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {lesson.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">{lesson.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Student Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Questions</CardTitle>
                <CardDescription>Questions that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{question.student}</h4>
                          <Badge variant={question.type === "video" ? "secondary" : "outline"}>
                            {question.type}
                            {question.type === "video" && question.duration && ` (${question.duration})`}
                          </Badge>
                          <Badge variant={question.status === "pending" ? "destructive" : "default"}>
                            {question.status}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{question.question}</p>
                        {question.transcript && (
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 mb-2">
                            <p className="font-medium mb-1">Auto-generated transcript:</p>
                            <p className="line-clamp-3">{question.transcript}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">{question.date}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {question.type === "video" && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Respond
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Students</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            <div className="grid gap-6">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{student.instrument}</span>
                            <span>•</span>
                            <span>{student.level}</span>
                            <span>•</span>
                            <span>Next: {student.nextLesson}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-gray-600">Progress:</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Assignments</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
                <CardDescription>Assign practice material to your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                        <SelectItem value="emma">Emma Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instrument">Instrument</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piano">Piano</SelectItem>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="viola">Viola</SelectItem>
                        <SelectItem value="harp">Harp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input id="title" placeholder="e.g., Scales Practice - C Major" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed instructions for the assignment..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <Button className="w-full">Create Assignment</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <h2 className="text-2xl font-bold">Student Questions</h2>

            <div className="space-y-4">
              {recentQuestions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{question.student}</CardTitle>
                        <CardDescription>{question.date}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={question.type === "video" ? "secondary" : "outline"}>{question.type}</Badge>
                        <Badge variant={question.status === "pending" ? "destructive" : "default"}>
                          {question.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{question.question}</p>
                    {question.type === "video" && (
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Video attachment available</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Video
                        </Button>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button>Respond</Button>
                      <Button variant="outline">Mark as Answered</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">$3,240</div>
                  <p className="text-sm text-gray-600">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-sm text-gray-600">3 new this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87%</div>
                  <p className="text-sm text-gray-600">Assignment completion</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
