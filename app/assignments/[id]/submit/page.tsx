"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Video, Mic, Square, Play, Pause, Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AssignmentSubmissionPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [submissionType, setSubmissionType] = useState<"video" | "text">("video")
  const [textSubmission, setTextSubmission] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  // Assignment details (would come from API in real app)
  const assignment = {
    id: 1,
    title: "Scales Practice - C Major",
    instrument: "Piano",
    dueDate: "March 20, 2024",
    description: "Practice C major scale, both hands, 4 octaves. Record yourself playing and explain your technique.",
    requirements: [
      "Play the scale slowly and clearly",
      "Demonstrate proper fingering",
      "Explain your practice approach",
      "Show any challenges you encountered",
    ],
  }

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " "
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsTranscribing(false)
      }

      recognitionRef.current.onend = () => {
        setIsTranscribing(false)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setRecordedVideo(url)

        // Start speech-to-text processing
        if (recognitionRef.current) {
          setIsTranscribing(true)
          recognitionRef.current.start()
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Unable to access camera and microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const retakeVideo = () => {
    setRecordedVideo(null)
    setTranscript("")
    setRecordingTime(0)
    setIsTranscribing(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Simulate submission process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Submit to AI for summarization if video
      if (submissionType === "video" && transcript) {
        const response = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: transcript,
            type: "video",
            studentName: "John Doe",
          }),
        })

        if (response.ok) {
          const { summary } = await response.json()
          console.log("AI Summary:", summary)
        }
      }

      setUploadProgress(100)

      // Simulate final processing
      await new Promise((resolve) => setTimeout(resolve, 500))

      alert("Assignment submitted successfully!")
      window.location.href = "/client/dashboard"
    } catch (error) {
      console.error("Error submitting assignment:", error)
      alert("Failed to submit assignment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/client/dashboard" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">wlanvi</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/client/dashboard" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {assignment.instrument} • Due: {assignment.dueDate}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                Assignment Submission
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{assignment.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {assignment.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Submission Type Selection */}
        <Tabs value={submissionType} onValueChange={(value) => setSubmissionType(value as "video" | "text")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="video" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Video Submission
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Text Submission
            </TabsTrigger>
          </TabsList>

          {/* Video Submission */}
          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Your Practice Session</CardTitle>
                <CardDescription>
                  Record yourself playing and explaining your practice. The audio will be automatically transcribed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!recordedVideo ? (
                  <div className="space-y-6">
                    {/* Video Preview */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                      {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white font-mono text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            {formatTime(recordingTime)}
                          </span>
                        </div>
                      )}
                      {isTranscribing && (
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-500 bg-opacity-90 text-white px-3 py-1 rounded">
                          <Mic className="h-4 w-4 animate-pulse" />
                          <span className="text-sm">Transcribing...</span>
                        </div>
                      )}
                    </div>

                    {/* Recording Controls */}
                    <div className="flex justify-center space-x-4">
                      {!isRecording ? (
                        <Button onClick={startRecording} size="lg" className="flex items-center">
                          <Video className="h-5 w-5 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <>
                          <Button onClick={pauseRecording} variant="outline" size="lg">
                            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                          </Button>
                          <Button onClick={stopRecording} variant="destructive" size="lg">
                            <Square className="h-5 w-5 mr-2" />
                            Stop Recording
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Recorded Video Playback */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video src={recordedVideo} controls className="w-full h-full object-cover" />
                    </div>

                    {/* Transcript */}
                    {transcript && (
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Auto-Generated Transcript</Label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          This transcript was automatically generated and will help your teacher understand your
                          explanation.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <Button onClick={retakeVideo} variant="outline">
                        Retake Video
                      </Button>
                      <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Submission */}
          <TabsContent value="text" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Written Submission</CardTitle>
                <CardDescription>Describe your practice session and any questions or observations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="textSubmission">Your Practice Report</Label>
                  <Textarea
                    id="textSubmission"
                    value={textSubmission}
                    onChange={(e) => setTextSubmission(e.target.value)}
                    placeholder="Describe your practice session, challenges you faced, questions you have, and your progress..."
                    rows={10}
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={!textSubmission.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload Progress */}
        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading submission...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              Recording Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Ensure good lighting and clear audio for the best recording quality</li>
              <li>• Speak clearly when explaining your practice approach</li>
              <li>• Position your camera to show your hand positioning and technique</li>
              <li>• Take your time - you can pause and resume recording as needed</li>
              <li>• The audio will be automatically transcribed to help your teacher review</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
