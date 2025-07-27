"use client"

import { useState } from "react"
import { Plus, Camera, Clock, FileText, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QuickContributeFABProps {
  advisorSlug: string
  advisorName: string
  onContributionAdded?: () => void
}

export default function QuickContributeFAB({ advisorSlug, advisorName, onContributionAdded }: QuickContributeFABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<"photo" | "timeline" | "memory" | "document" | null>(null)

  const contributionTypes = [
    {
      type: "photo" as const,
      icon: Camera,
      label: "Add Photo",
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Upload a photo or image",
    },
    {
      type: "timeline" as const,
      icon: Clock,
      label: "Timeline Event",
      color: "bg-green-500 hover:bg-green-600",
      description: "Add a life event or milestone",
    },
    {
      type: "memory" as const,
      icon: Heart,
      label: "Share Memory",
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Share a personal story or memory",
    },
    {
      type: "document" as const,
      icon: FileText,
      label: "Add Document",
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Upload a document or article",
    },
  ]

  const handleTypeSelect = (type: typeof selectedType) => {
    setSelectedType(type)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
                  isOpen ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isOpen ? "Close" : "Quick Contribute"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Quick Action Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
            {contributionTypes.map((item) => {
              const IconComponent = item.icon
              return (
                <TooltipProvider key={item.type}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        className={`rounded-full w-12 h-12 shadow-lg ${item.color} transition-all duration-200 hover:scale-110`}
                        onClick={() => handleTypeSelect(item.type)}
                      >
                        <IconComponent className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div className="text-center">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Contribution Modals */}
      {selectedType && (
        <QuickContributionModal
          type={selectedType}
          advisorSlug={advisorSlug}
          advisorName={advisorName}
          onClose={() => setSelectedType(null)}
          onSuccess={() => {
            setSelectedType(null)
            onContributionAdded?.()
          }}
        />
      )}
    </>
  )
}

// Quick Contribution Modal Component
interface QuickContributionModalProps {
  type: "photo" | "timeline" | "memory" | "document"
  advisorSlug: string
  advisorName: string
  onClose: () => void
  onSuccess: () => void
}

function QuickContributionModal({ type, advisorSlug, advisorName, onClose, onSuccess }: QuickContributionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      // Add the contribution type and advisor info
      formData.append("type", type)
      formData.append("advisorSlug", advisorSlug)

      const response = await fetch("/api/quick-contributions", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit contribution")
      }

      onSuccess()
    } catch (error) {
      console.error("Error submitting contribution:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 rounded-2xl max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">
              {type === "photo" && "Add Photo"}
              {type === "timeline" && "Timeline Event"}
              {type === "memory" && "Share Memory"}
              {type === "document" && "Add Document"}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSubmit(formData)
            }}
            className="space-y-4"
          >
            {type === "photo" && <PhotoForm />}
            {type === "timeline" && <TimelineForm />}
            {type === "memory" && <MemoryForm />}
            {type === "document" && <DocumentForm />}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Individual form components for each contribution type
function PhotoForm() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Upload Photo</label>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Caption (optional)</label>
        <input
          type="text"
          name="caption"
          placeholder="Describe this photo..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Your Name</label>
        <input
          type="text"
          name="contributorName"
          required
          placeholder="Your name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
    </>
  )
}

function TimelineForm() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Year</label>
          <input
            type="number"
            name="year"
            required
            min="1900"
            max="2024"
            placeholder="1985"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            name="category"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="">Select...</option>
            <option value="education">Education</option>
            <option value="career">Career</option>
            <option value="achievement">Achievement</option>
            <option value="publication">Publication</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Event Title</label>
        <input
          type="text"
          name="title"
          required
          placeholder="Graduated from University"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Brief description of this event..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Your Name</label>
        <input
          type="text"
          name="contributorName"
          required
          placeholder="Your name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
    </>
  )
}

function MemoryForm() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Memory Title</label>
        <input
          type="text"
          name="title"
          required
          placeholder="Working together in 1985..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Your Memory</label>
        <textarea
          name="content"
          required
          rows={4}
          placeholder="Share your memory or story..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Your Name</label>
        <input
          type="text"
          name="contributorName"
          required
          placeholder="Your name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
    </>
  )
}

function DocumentForm() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Upload Document</label>
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.txt"
          required
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Document Title</label>
        <input
          type="text"
          name="title"
          required
          placeholder="Letter from 1985, Research Paper, etc."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="What is this document about?"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Your Name</label>
        <input
          type="text"
          name="contributorName"
          required
          placeholder="Your name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
      </div>
    </>
  )
}
