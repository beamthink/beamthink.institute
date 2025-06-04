"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VideoPlayer } from "@/components/video-player"
import { Music, MessageSquare, CheckCircle, Clock, User, Calendar } from "lucide-react"
import Link from "next/link"

export default function AssignmentViewPage() {
  const [feedback, setFeedback] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  // Mock assignment data (would come from API)
  const assignment = {
    id: 1,
    title: "Scales Practice - C Major",
    instrument: "Piano",
    student: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    submittedAt: "March 18, 2024 at 3:30 PM",
    dueDate: "March 20, 2024",
    status: "submitted",
    type: "video",
    videoUrl: "/placeholder-video.mp4",
    transcript: `Hello, this is my practice session for the C major scale. I'm going to start slowly and focus on proper fingering. As you can see, I'm using the standard fingering pattern - thumb on C, index finger on D, middle finger on E, and so on. 

I've been practicing this scale for about 20 minutes today, and I'm noticing that my left hand coordination is improving. However, I'm still having some difficulty with the transition at the octave. Let me demonstrate the scale now.

[Playing C major scale slowly]

As you can hear, I'm getting more consistent with the rhythm, but I think I need to work on keeping my wrist more relaxed, especially in the higher register. I also have a question about the fingering for the left hand - should I use the same pattern as the right hand, or is there a different recommended fingering?

I've been practicing this about 15 minutes each day this week, and I feel like I'm making good progress. Thank you for your guidance!`,
    aiSummary: `Student demonstrates good understanding of basic C major scale fingering and shows improvement in coordination. Key points:
    
    • Successfully uses standard fingering pattern for right hand
    • Shows awareness of technique issues (wrist tension, octave transitions)  
    • Practices consistently (15 min/day for a week)
    • Specific question about left hand fingering pattern
    • Demonstrates self-reflection on progress and areas for improvement
    
    Areas needing attention: wrist relaxation, octave transitions, left hand fingering clarification.`,
    previousFeedback: [],
  }

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return

    setIsSubmittingFeedback(true)

    // Simulate feedback submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Feedback sent to student!")
    setFeedback("")
    setIsSubmittingFeedback(false)
  }

  const handleMarkComplete = async () => {
    // Simulate marking assignment as complete
    alert("Assignment marked as complete!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/teacher/dashboard" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">wlanvi</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/teacher/dashboard" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mt-2">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {assignment.student.name}
                </span>
                <span className="flex items-center">
                  <Music className="h-4 w-4 mr-1" />
                  {assignment.instrument}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {assignment.dueDate}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={assignment.status === "submitted" ? "default" : "secondary"}>{assignment.status}</Badge>
              <Badge variant="outline">{assignment.type}</Badge>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Submitted: {assignment.submittedAt}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Submission */}
            {assignment.type === "video" && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Video Submission</CardTitle>
                  <CardDescription>Practice session recording with auto-generated transcript</CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoPlayer
                    src={assignment.videoUrl}
                    title={`${assignment.student.name} - ${assignment.title}`}
                    transcript={assignment.transcript}
                  />
                </CardContent>
              </Card>
            )}

            {/* AI Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                  AI Summary
                </CardTitle>
                <CardDescription>Automatically generated summary of the student's submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{assignment.aiSummary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Full Transcript */}
            <Card>
              <CardHeader>
                <CardTitle>Full Transcript</CardTitle>
                <CardDescription>Complete transcription of the student's audio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-line">{assignment.transcript}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleMarkComplete} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Provide Feedback</CardTitle>
                <CardDescription>Give detailed feedback to help the student improve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback on the student's performance, technique, and areas for improvement..."
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim() || isSubmittingFeedback}
                  className="w-full"
                >
                  {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
                </Button>
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>• 12 assignments completed</p>
                    <p>• 3 assignments pending</p>
                    <p>• Average score: 4.2/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
