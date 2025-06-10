"use client"

import type React from "react"
import { useState } from "react"
import {
  Plus,
  Building,
  Brain,
  FolderOpen,
  MapPin,
  Edit,
  Settings,
  FileText,
  ExternalLink,
  Upload,
  Play,
  Music,
  Banknote,
  Cog,
  Eye,
  TrendingUp,
  Target,
  DollarSign,
  ChevronDown,
  Search,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function BeamOSDashboard() {
  const [selectedNode, setSelectedNode] = useState("BEAM FCU - Atlanta")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    name: "Alex Chen",
    email: "alex@beamos.org",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Community Manager",
  })
  const [showProjectsModal, setShowProjectsModal] = useState(false)
  const [showContributionModal, setShowContributionModal] = useState(false)
  const [contributionType, setContributionType] = useState<"memory" | "document" | "media">("memory")

  // Financial data for the overview
  const financialData = {
    totalAssets: 2450000,
    liquidFunds: 180000,
    propertyValue: 1850000,
    equipmentValue: 420000,
    potentialProjectValue: 3200000,
    fundingGoal: 5000000,
    currentFunding: 2800000,
  }

  // Enhanced project data structures
  interface ParticipantRole {
    participantId: string
    role: string
    progress: number
    isCertified: boolean
    joinedAt: Date
    requiredTraining?: string[]
  }

  interface Milestone {
    title: string
    date: Date
    description: string
    valueImpact?: string
  }

  interface TaskPath {
    name: string
    requiredTraining: string[]
    openings: number
    completedBy: string[]
    description: string
    estimatedHours: number
  }

  interface AppreciationLogic {
    method: "craftsmanship" | "upgrade_cycle" | "data_score" | "hybrid"
    details: string
    currentValue?: number
    projectedValue?: number
  }

  interface EnhancedProject {
    id: string
    title: string
    summary: string
    description: string
    status: "planning" | "active" | "archived"
    projectType:
      | "Manufacturing"
      | "Housing"
      | "Creative"
      | "Tech"
      | "Agriculture"
      | "Infrastructure"
      | "Sustainability"
      | "Cultural"
    nodeId: string
    podId: string
    partners: string[]
    coordinator: string[]
    participants: ParticipantRole[]
    eligibilityCriteria: string
    milestones: Milestone[]
    contributionPaths: TaskPath[]
    financialModel: string
    media: string[]
    appreciationModel: AppreciationLogic
    outcomes: string[]
    budget: number
    raised: number
    createdAt: Date
    updatedAt: Date
  }

  // Enhanced Project data
  const enhancedProjects: EnhancedProject[] = [
    {
      id: "urban-harmony",
      title: "Urban Harmony Project",
      summary: "Revitalizing urban spaces through community-led art installations and green infrastructure.",
      description:
        "The Urban Harmony Project aims to transform neglected urban spaces into vibrant community hubs through a combination of public art installations, green infrastructure development, and community engagement initiatives.",
      status: "active",
      projectType: "Creative",
      nodeId: "BEAM FCU - Atlanta",
      podId: "South Atlanta POD",
      partners: ["readyaimgo", "morehouse-college"],
      coordinator: ["jordan-kim"],
      participants: [
        {
          participantId: "alex-chen",
          role: "Lead Artist",
          progress: 85,
          isCertified: true,
          joinedAt: new Date("2023-08-15"),
        },
        {
          participantId: "maya-rodriguez",
          role: "Community Liaison",
          progress: 70,
          isCertified: false,
          joinedAt: new Date("2023-09-01"),
          requiredTraining: ["Conflict Resolution", "Community Organizing"],
        },
      ],
      eligibilityCriteria:
        "Open to all community members with an interest in art, urban planning, or environmental sustainability.",
      milestones: [
        {
          title: "Community Visioning Workshop",
          date: new Date("2023-07-20"),
          description: "Gather community input on project goals and design preferences.",
        },
        {
          title: "Art Installation Phase 1",
          date: new Date("2023-10-01"),
          description: "Installation of first set of public art pieces in designated areas.",
        },
      ],
      contributionPaths: [
        {
          name: "Mural Painting",
          requiredTraining: ["Art Safety", "Community Engagement"],
          openings: 5,
          completedBy: ["alex-chen"],
          description: "Create vibrant murals that reflect the community's identity and aspirations.",
          estimatedHours: 40,
        },
      ],
      financialModel: "Community-supported crowdfunding and local business sponsorships.",
      media: [
        "/placeholder.svg?height=300&width=400&text=Mural+Design",
        "/placeholder.svg?height=300&width=400&text=Green+Space+Plan",
      ],
      appreciationModel: {
        method: "craftsmanship",
        details: "Value appreciation based on the quality and impact of the art installations and green spaces.",
        currentValue: 120000,
        projectedValue: 250000,
      },
      outcomes: [
        "Enhanced community pride and social cohesion",
        "Improved environmental quality and sustainability",
        "Increased foot traffic and economic activity in the area",
      ],
      budget: 300000,
      raised: 180000,
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2024-02-29"),
    },
    {
      id: "digital-bridge",
      title: "Digital Bridge Initiative",
      summary: "Bridging the digital divide by providing access to technology and digital literacy training.",
      description:
        "The Digital Bridge Initiative aims to address the digital divide by providing underserved communities with access to technology, digital literacy training, and internet connectivity.",
      status: "active",
      projectType: "Tech",
      nodeId: "BEAM Orchestra - Atlanta",
      podId: "South Atlanta POD",
      partners: ["readyaimgo", "atlanta-film-studio"],
      coordinator: ["maya-rodriguez"],
      participants: [
        {
          participantId: "jordan-kim",
          role: "Training Coordinator",
          progress: 90,
          isCertified: true,
          joinedAt: new Date("2023-09-10"),
        },
      ],
      eligibilityCriteria: "Open to all community members with limited access to technology or digital skills.",
      milestones: [
        {
          title: "Technology Needs Assessment",
          date: new Date("2023-08-01"),
          description: "Assess the technology needs and digital literacy levels of target communities.",
        },
      ],
      contributionPaths: [
        {
          name: "Digital Literacy Instructor",
          requiredTraining: ["Instructional Design", "Digital Skills"],
          openings: 4,
          completedBy: ["jordan-kim"],
          description: "Provide digital literacy training to community members in various formats.",
          estimatedHours: 50,
        },
      ],
      financialModel: "Government grants, corporate sponsorships, and individual donations.",
      media: ["/placeholder.svg?height=300&width=400&text=Training+Session"],
      appreciationModel: {
        method: "data_score",
        details:
          "Value appreciation based on the number of community members trained and the impact of digital skills on their lives.",
        currentValue: 90000,
        projectedValue: 200000,
      },
      outcomes: [
        "Increased digital literacy and technology access for underserved communities",
        "Improved employment opportunities and economic outcomes for participants",
      ],
      budget: 250000,
      raised: 150000,
      createdAt: new Date("2023-07-01"),
      updatedAt: new Date("2024-02-29"),
    },
  ]

  const projects = enhancedProjects

  const participants = [
    {
      id: "alex-chen",
      name: "Alex Chen",
      role: "Sound Designer",
      tags: ["musician", "audio engineer"],
      avatar: "/placeholder.svg?height=40&width=40",
      nodeId: "BEAM FCU - Atlanta",
      podId: "South Atlanta POD",
    },
    {
      id: "maya-rodriguez",
      name: "Maya Rodriguez",
      role: "Full-Stack Developer",
      tags: ["coder", "ui/ux"],
      avatar: "/placeholder.svg?height=40&width=40",
      nodeId: "BEAM Tech Collective - Oakland",
      podId: "Bay Area POD",
    },
    {
      id: "jordan-kim",
      name: "Jordan Kim",
      role: "Community Organizer",
      tags: ["activist", "facilitator"],
      avatar: "/placeholder.svg?height=40&width=40",
      nodeId: "BEAM Orchestra - Atlanta",
      podId: "South Atlanta POD",
    },
    {
      id: "sam-taylor",
      name: "Sam Taylor",
      role: "Sustainability Consultant",
      tags: ["environmentalist", "researcher"],
      avatar: "/placeholder.svg?height=40&width=40",
      nodeId: "BEAM FCU - Decatur",
      podId: "South Atlanta POD",
    },
  ]

  // BEAM PODs and Nodes structure
  const beamPods = {
    "South Atlanta POD": {
      description: "Metropolitan Atlanta region focusing on cooperative economics and cultural preservation",
      location: "Atlanta, GA Metro Area",
      neighborhood: "Various neighborhoods across Atlanta and Decatur",
      status: "Active",
      nodes: [
        "BEAM FCU - Atlanta",
        "BEAM FCU - Decatur",
        "BEAM FCU - Tuskegee",
        "BEAM Orchestra - Atlanta",
        "BEAM Orchestra - Baltimore",
      ],
    },
    "Bay Area POD": {
      description: "Northern California region emphasizing technology innovation and digital sovereignty",
      location: "San Francisco Bay Area, CA",
      neighborhood: "Oakland and surrounding communities",
      status: "Active",
      nodes: ["BEAM Tech Collective - Oakland"],
    },
    "Great Lakes POD": {
      description: "Midwest region focusing on sustainable agriculture and community resilience",
      location: "Great Lakes Region",
      neighborhood: "Madison, WI and Detroit, MI areas",
      status: "Inactive",
      nodes: ["BEAM Orchestra - Madison", "BEAM Tech Collective - Detroit"],
    },
  }

  const beamNodes = {
    "BEAM FCU - Atlanta": {
      ngo: "BEAM FCU",
      pod: "South Atlanta POD",
      mission:
        "A community financial cooperative designed to support the economic infrastructure of BEAM Pods and Operators. We provide financial services, cooperative ownership models, and economic development resources to strengthen community resilience and self-determination.",
      location: {
        city: "Atlanta, GA",
        status: "Active",
        lotSize: "2.5 acres",
        type: "Community Center",
        coordinates: "33.7490, -84.3880",
        description: "Main headquarters with full financial services",
      },
      institutionPartners: ["Morehouse College", "Atlanta Community Land Trust"],
      assignedProjects: ["urban-harmony"],
      participants: ["alex-chen"],
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      accessTools: {
        website: "https://beamfcu.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-fcu",
          android: "https://play.google.com/store/apps/details?id=org.beamfcu",
        },
        tools: [
          {
            name: "BEAM Wallet",
            url: "https://testflight.apple.com/join/jd8v2UYe",
            description: "Digital wallet for cooperative members",
          },
          {
            name: "BEAM FCU App",
            url: "https://app.beamfcu.org",
            description: "Full banking and cooperative services",
          },
        ],
      },
    },
    "BEAM FCU - Decatur": {
      ngo: "BEAM FCU",
      pod: "South Atlanta POD",
      mission: "Satellite location expanding BEAM FCU's financial services to the greater Atlanta metropolitan area.",
      location: {
        city: "Decatur, GA",
        status: "Planning",
        lotSize: "1.8 acres",
        type: "Financial Hub",
        coordinates: "33.7748, -84.2963",
        description: "Satellite location for expanded services",
      },
      institutionPartners: ["Agnes Scott College"],
      assignedProjects: [],
      participants: ["sam-taylor"],
      images: ["/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamfcu.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-fcu",
          android: "https://play.google.com/store/apps/details?id=org.beamfcu",
        },
        tools: [],
      },
    },
    "BEAM Orchestra - Atlanta": {
      ngo: "BEAM Orchestra",
      pod: "South Atlanta POD",
      mission:
        "An interdisciplinary music and media collective focused on performance, education, and archival restoration of diasporic artistry.",
      location: {
        city: "Atlanta, GA",
        status: "Active",
        lotSize: "1.2 acres",
        type: "Performance Hall",
        coordinates: "33.7490, -84.3880",
        description: "Main performance venue and recording facilities",
      },
      institutionPartners: ["Spelman College", "Atlanta Symphony Orchestra"],
      assignedProjects: ["digital-bridge"],
      participants: ["jordan-kim"],
      images: ["/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamorchestra.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-orchestra",
          android: "https://play.google.com/store/apps/details?id=org.beamorchestra",
        },
        tools: [
          {
            name: "BEAM Archive",
            url: "https://archive.beamorchestra.org",
            description: "Digital archive of diasporic artistry",
          },
        ],
      },
    },
    "BEAM Tech Collective - Oakland": {
      ngo: "BEAM Tech Collective",
      pod: "Bay Area POD",
      mission:
        "A technology cooperative focused on developing open-source tools and digital infrastructure for community organizations.",
      location: {
        city: "Oakland, CA",
        status: "Active",
        lotSize: "1.5 acres",
        type: "Tech Hub",
        coordinates: "37.8044, -122.2712",
        description: "Main development center and community workspace",
      },
      institutionPartners: ["UC Berkeley", "Oakland Digital"],
      assignedProjects: [],
      participants: ["maya-rodriguez"],
      images: ["/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamtech.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-tech",
          android: "https://play.google.com/store/apps/details?id=org.beamtech",
        },
        tools: [
          { name: "BEAM OS Platform", url: "https://os.beam.org", description: "Community operating system and tools" },
        ],
      },
    },
  }

  // Helper function to get node icon
  const getNodeIcon = (nodeKey: string) => {
    if (nodeKey.includes("FCU")) return Banknote
    if (nodeKey.includes("Orchestra")) return Music
    if (nodeKey.includes("Tech")) return Cog
    return Building
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "planning":
        return "bg-yellow-500"
      case "proposed":
        return "bg-blue-500"
      default:
        return "bg-red-500"
    }
  }

  // Filter nodes based on search query
  const filteredNodes = Object.keys(beamNodes).filter(
    (nodeKey) =>
      nodeKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beamNodes[nodeKey].mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beamNodes[nodeKey].location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beamNodes[nodeKey].location.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get current node data
  const currentNode = beamNodes[selectedNode]
  const currentPod = currentNode ? beamPods[currentNode.pod] : null

  // Get participants for current node
  const nodeParticipants = participants.filter((p) => p.nodeId === selectedNode)

  // Get projects for current node
  const nodeProjects = projects.filter((p) => p.nodeId === selectedNode)

  // Authentication functions
  const handleLogin = () => {
    setIsLoggedIn(true)
    toast(`Welcome back, ${user.name}!`)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    toast("You have been successfully logged out")
  }

  // Toast notification functions
  const showSuccessToast = (message: string) => {
    toast.success(message)
  }

  const showErrorToast = (message: string) => {
    toast.error(message)
  }

  const showInfoToast = (message: string) => {
    toast.info(message)
  }

  const showLoginRequiredToast = () => {
    toast.warning("Please log in to access this feature")
  }

  // Prevent default link behavior for placeholder links
  const handlePlaceholderClick = (e: React.MouseEvent, message: string) => {
    e.preventDefault()
    e.stopPropagation()
    showInfoToast(message)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Compact Project Card Component
  const CompactProjectCard = ({ project }: { project: EnhancedProject }) => (
    <Card className="bg-gray-900/50 border-gray-700 rounded-lg hover:border-gray-500 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm mb-1">{project.title}</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs px-2 py-0">
                {project.projectType}
              </Badge>
              <Badge
                variant={
                  project.status === "active" ? "default" : project.status === "planning" ? "secondary" : "destructive"
                }
                className="text-xs px-2 py-0"
              >
                {project.status === "active" ? "Active" : project.status === "planning" ? "Planning" : "Archived"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{project.summary}</p>
        <div className="space-y-2">
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((project.raised / project.budget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatCurrency(project.raised)} raised</span>
            <span>{project.participants.length} participants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Projects Modal Component
  const ProjectsModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-cyan-400" />
            <div>
              <h2 className="text-white text-3xl font-bold">Projects</h2>
              <p className="text-gray-400 text-lg">Community-driven initiatives shaping our future</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-700 rounded-full"
            onClick={() => setShowProjectsModal(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
        <div className="p-6 overflow-y-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <CompactProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Contribution Modal Component
  const ContributionModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {contributionType === "memory" && <Brain className="h-8 w-8 text-amber-400" />}
            {contributionType === "document" && <FileText className="h-8 w-8 text-blue-400" />}
            {contributionType === "media" && <Play className="h-8 w-8 text-purple-400" />}
            <div>
              <h2 className="text-white text-2xl font-bold">Contribute a {contributionType}</h2>
              <p className="text-gray-400 text-sm">Share your insights and memories</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-700 rounded-full"
            onClick={() => setShowContributionModal(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Details
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Contribution Type</h3>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant={contributionType === "memory" ? "default" : "outline"}
                    onClick={() => setContributionType("memory")}
                    className={
                      contributionType === "memory"
                        ? "bg-amber-500 text-white hover:bg-amber-400"
                        : "border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }
                  >
                    Memory
                  </Button>
                  <Button
                    variant={contributionType === "document" ? "default" : "outline"}
                    onClick={() => setContributionType("document")}
                    className={
                      contributionType === "document"
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }
                  >
                    Document
                  </Button>
                  <Button
                    variant={contributionType === "media" ? "default" : "outline"}
                    onClick={() => setContributionType("media")}
                    className={
                      contributionType === "media"
                        ? "bg-purple-500 text-white hover:bg-purple-400"
                        : "border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }
                  >
                    Media
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Title</h3>
                <Input type="text" placeholder="Enter title" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Content</h3>
                <Textarea
                  placeholder="Share your memory, document, or media details"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                <Input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              {contributionType === "media" && (
                <div>
                  <h3 className="text-lg font-semibold text-white">Upload Media</h3>
                  <Button variant="secondary" className="mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="preview">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is a preview of your contribution.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end gap-4">
          <Button variant="outline" onClick={() => setShowContributionModal(false)}>
            Cancel
          </Button>
          <Button>Submit Contribution</Button>
        </div>
      </div>
    </div>
  )

  const fundingProgress = (financialData.currentFunding / financialData.fundingGoal) * 100

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <TooltipProvider>
        {/* Sticky Header with Glassy Effect */}
        <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              {/* Left side - Nodes Dropdown */}
              <div className="flex items-center gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-xl font-bold flex items-center gap-2">
                      Nodes
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-gray-900 border-gray-700">
                    <DropdownMenuLabel className="text-white">Select Node</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="Search nodes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white pl-10"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredNodes.length > 0 ? (
                        filteredNodes.map((nodeKey) => {
                          const node = beamNodes[nodeKey]
                          const IconComponent = getNodeIcon(nodeKey)
                          const statusColor = getStatusColor(node.location.status)

                          return (
                            <DropdownMenuItem
                              key={nodeKey}
                              onClick={() => setSelectedNode(nodeKey)}
                              className={`cursor-pointer hover:bg-gray-700 ${
                                selectedNode === nodeKey ? "bg-gray-700" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                                  <IconComponent className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium text-white truncate">{nodeKey}</div>
                                  <div className="text-xs text-gray-400">{node.location.city}</div>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          )
                        })
                      ) : (
                        <DropdownMenuItem disabled>
                          <span className="text-gray-500 text-sm">No nodes found.</span>
                        </DropdownMenuItem>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Quick Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      Quick Actions
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
                    <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={() => setShowContributionModal(true)}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-white">Contribute</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/advisors" className="cursor-pointer hover:bg-gray-700 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="text-white">AI Advisors</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => showLoginRequiredToast()}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="text-white">Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => showLoginRequiredToast()}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span className="text-white">Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right side - Authentication */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-gray-400 leading-none">{user.role}</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={handleLogin}>Login</Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto py-6 px-4">
          {/* Main Content Area */}
          <div className="space-y-6">
            {currentNode ? (
              <>
                {/* Node Header */}
                <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl font-bold mb-2">{selectedNode}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm leading-relaxed">
                          {currentNode.mission}
                        </CardDescription>
                        {currentPod && (
                          <div className="flex items-center gap-2 mt-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{currentPod.location}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showInfoToast("This feature is under development")}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Financial Overview - Compressed */}
                <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-lg">Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                                <span className="text-xs text-gray-400">Total Assets</span>
                              </div>
                              <div className="text-lg font-bold text-white">
                                {formatCurrency(financialData.totalAssets)}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Combined value of all node assets including property, equipment, and liquid funds</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <Target className="h-4 w-4 text-blue-400 mr-1" />
                                <span className="text-xs text-gray-400">Project Potential</span>
                              </div>
                              <div className="text-lg font-bold text-white">
                                {formatCurrency(financialData.potentialProjectValue)}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Estimated value potential from active and planned projects</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <DollarSign className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-xs text-gray-400">Funding Progress</span>
                              </div>
                              <div className="text-lg font-bold text-white">{Math.round(fundingProgress)}%</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {formatCurrency(financialData.currentFunding)} of{" "}
                              {formatCurrency(financialData.fundingGoal)} funding goal
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Funding Progress</span>
                        <span className="text-white">
                          {formatCurrency(financialData.currentFunding)} / {formatCurrency(financialData.fundingGoal)}
                        </span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Projects Overview - Top 3 Only */}
                <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">Active Projects</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setShowProjectsModal(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View All ({projects.length})
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {nodeProjects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nodeProjects.slice(0, 3).map((project) => (
                          <CompactProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">No projects found for this node.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => showInfoToast("Project creation coming soon")}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Project
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Participants & Access Tools - Combined */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-lg">Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {nodeParticipants.length > 0 ? (
                        <div className="space-y-3">
                          {nodeParticipants.map((participant) => (
                            <div key={participant.id} className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback className="text-xs">{participant.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{participant.name}</p>
                                <p className="text-xs text-gray-400 truncate">{participant.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No participants found for this node.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-lg">Access Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {currentNode.accessTools.website && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a
                            href={currentNode.accessTools.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handlePlaceholderClick(e, "Navigating to external website")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {currentNode.accessTools.tools?.slice(0, 2).map((tool) => (
                        <Button variant="outline" size="sm" className="w-full justify-start" key={tool.name} asChild>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handlePlaceholderClick(e, tool.description)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {tool.name}
                          </a>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a node to view details</h3>
                <p className="text-sm">
                  Choose from the available nodes in the header dropdown to explore community initiatives.
                </p>
              </div>
            )}
          </div>

          {/* Projects Modal */}
          {showProjectsModal && <ProjectsModal />}

          {/* Contribution Modal */}
          {showContributionModal && <ContributionModal />}
        </div>
      </TooltipProvider>
    </div>
  )
}
