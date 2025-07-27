"use client"

import React, { useState, useRef, useEffect } from "react"
import { X, Upload, FileText, ImageIcon, Video, Mic, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

type ContributionType = "photo" | "timeline" | "memory" | "document" | null;

interface ContributionModalProps {
  isOpen: boolean
  onClose: () => void
  advisorName: string
  advisorSlug: string
  onContributionSubmitted: () => void
  initialType?: ContributionType
}

interface UploadedFile {
  id: string
  file: File
  type: "image" | "video" | "audio" | "document"
  preview?: string
  name: string
  size: number
}

export default function ContributionModal({
  isOpen,
  onClose,
  advisorName,
  advisorSlug,
  onContributionSubmitted,
  initialType = null,
}: ContributionModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contributorName, setContributorName] = useState("")
  const [contributorEmail, setContributorEmail] = useState("")
  const [tags, setTags] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedType, setSelectedType] = useState<ContributionType>(initialType)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (isOpen) {
      setSelectedType(initialType)
    }
  }, [isOpen, initialType])

  if (!isOpen) return null

  const getFileType = (file: File): "image" | "video" | "audio" | "document" => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "document"
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach((file) => {
      const fileType = getFileType(file)
      const fileId = Math.random().toString(36).substr(2, 9)

      const newFile: UploadedFile = {
        id: fileId,
        file,
        type: fileType,
        name: file.name,
        size: file.size,
      }

      // Create preview for images
      if (fileType === "image") {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, preview: e.target?.result as string } : f)),
          )
        }
        reader.readAsDataURL(file)
      }

      setUploadedFiles((prev) => [...prev, newFile])
    })

    // Reset input
    if (event.target) {
      event.target.value = ""
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.wav`, { type: "audio/wav" })

        const fileId = Math.random().toString(36).substr(2, 9)
        const newFile: UploadedFile = {
          id: fileId,
          file: audioFile,
          type: "audio",
          name: audioFile.name,
          size: audioFile.size,
        }

        setUploadedFiles((prev) => [...prev, newFile])

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success("Recording started...")
    } catch (error) {
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.success("Recording saved!")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async () => {
    if (!title.trim() || !contributorName.trim() || !contributorEmail.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file uploads
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("contributorName", contributorName)
      formData.append("contributorEmail", contributorEmail)
      formData.append("tags", tags)
      formData.append("advisorSlug", advisorSlug)

      // Add all files
      uploadedFiles.forEach((uploadedFile, index) => {
        formData.append(`files`, uploadedFile.file)
        formData.append(`fileTypes`, uploadedFile.type)
      })

      // Submit to API
      const response = await fetch("/api/contributions", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit contribution")
      }

      toast.success("Contribution submitted successfully! It will be reviewed before appearing on the memorial.")

      // Reset form
      setTitle("")
      setDescription("")
      setContributorName("")
      setContributorEmail("")
      setTags("")
      setUploadedFiles([])
      setActiveTab("details")

      onContributionSubmitted()
      onClose()
    } catch (error) {
      toast.error("Failed to submit contribution. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-700">
          <div>
            <CardTitle className="text-white text-2xl">Contribute to {advisorName}'s Memorial</CardTitle>
            <p className="text-gray-400 mt-1">Share your memories, documents, photos, or voice notes</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="details" className="data-[state=active]:bg-gray-700">
                Details
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-gray-700">
                Media & Files
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Working with Dr. Haugabrooks in 1985"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-medium mb-2 block">Tags</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., community work, 1980s, Atlanta"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your memory, story, or context for the files you're uploading..."
                  className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Your Name *</label>
                  <Input
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Media & Files Tab */}
            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* File Upload */}
                <Card
                  className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Upload Files</p>
                    <p className="text-gray-400 text-sm">Photos, videos, documents</p>
                  </CardContent>
                </Card>

                {/* Voice Recording */}
                <Card className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Button
                      variant={isRecording ? "destructive" : "secondary"}
                      onClick={isRecording ? stopRecording : startRecording}
                      className="w-full"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {isRecording ? "Stop Recording" : "Record Voice Note"}
                    </Button>
                    {isRecording && (
                      <div className="mt-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-red-400 text-sm">Recording...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <Card key={file.id} className="bg-gray-800 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {file.preview ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}

                            <div className="flex-grow">
                              <p className="text-white font-medium">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                  {file.type}
                                </Badge>
                                <span className="text-gray-400 text-sm">{formatFileSize(file.size)}</span>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Contribution Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium">{title || "Untitled Contribution"}</h4>
                    <p className="text-gray-400 text-sm">By {contributorName || "Anonymous"}</p>
                  </div>

                  {description && (
                    <div>
                      <p className="text-gray-300">{description}</p>
                    </div>
                  )}

                  {tags && (
                    <div className="flex flex-wrap gap-2">
                      {tags.split(",").map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div>
                      <p className="text-white font-medium mb-2">Attached Files:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="text-center">
                            {file.preview ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                            <p className="text-gray-400 text-xs mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !contributorName.trim() || !contributorEmail.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Contribution"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
