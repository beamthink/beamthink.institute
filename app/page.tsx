"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
  Send,
  Volume2,
  VolumeX,
  Pause,
  Music,
  Banknote,
  Cog,
  Eye,
  TrendingUp,
  Target,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
// Ensure these shadcn/ui components are correctly added via `npx shadcn-ui@latest add <component>`
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
// Correct import for sonner's useToast hook assuming it's correctly set up in layout.tsx
import { toast } from "sonner" // Corrected import for sonner's toast function
import { useAdvisors } from "@/hooks/use-advisors"

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
  const [showLogo, setShowLogo] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    name: "Alex Chen",
    email: "alex@beamos.org",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Community Manager",
  })
  const [showProjectsModal, setShowProjectsModal] = useState(false)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<{
    [key: string]: Array<{
      role: "user" | "assistant"
      content: string
      timestamp: Date
      audioUrl?: string
      isPlaying?: boolean
    }>
  }>({})
  const [currentMessage, setCurrentMessage] = useState("")
  const [showContributionModal, setShowContributionModal] = useState(false)
  const [contributionType, setContributionType] = useState<"memory" | "document" | "media">("memory")

  // Voice and Speech State
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setCurrentMessage(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          showErrorToast("Speech recognition error. Please try again.")
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }

      // Initialize speech synthesis
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }
    }
  }, [])

  // Voice profiles for each advisor
  const voiceProfiles = {
    "minerva-haugabrooks": {
      rate: 0.9,
      pitch: 1.1,
      volume: 0.8,
      voiceName: "female", // Will try to find a suitable female voice
      accent: "southern", // Simulated through rate and pitch adjustments
      characteristics: "warm, thoughtful, measured",
    },
    "james-smith": {
      rate: 1.0,
      pitch: 0.9,
      volume: 0.8,
      voiceName: "male", // Will try to find a suitable male voice
      accent: "midwest",
      characteristics: "clear, technical, friendly",
    },
  }

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

  // Enhanced AI Agent data structure
  interface TimelineEvent {
    year: number
    title: string
    description: string
    category: "education" | "career" | "achievement" | "publication" | "legacy"
    media?: string[]
  }

  interface MediaItem {
    id: string
    type: "image" | "document" | "video" | "audio"
    title: string
    description: string
    url: string
    uploadedBy: string
    uploadedAt: Date
    tags: string[]
    approved: boolean
  }

  interface Contribution {
    id: string
    type: "memory" | "document" | "media" | "quote"
    title: string
    content: string
    contributorName: string
    contributorEmail: string
    submittedAt: Date
    approved: boolean
    tags: string[]
    media?: string[]
  }

  interface AIAdvisor {
    id: string
    slug: string
    fullName: string
    role: string
    bio: string
    detailedBio: string
    avatar: string
    birthYear?: number
    deathYear?: number
    specialties: string[]
    keyWorks: string[]
    quotes: string[]
    timeline: TimelineEvent[]
    media: MediaItem[]
    contributions: Contribution[]
    chatPersonality: string
    voiceCharacteristics: string
    isActive: boolean
    totalContributions: number
    lastUpdated: Date
  }

  // Remove the large mock aiAgents array and replace with:
  const { advisors: aiAgents, loading: advisorsLoading, error: advisorsError } = useAdvisors()

  // Enhanced Project data
  const enhancedProjects: EnhancedProject[] = [
    {
      id: "urban-harmony",
      title: "Urban Harmony Project",
      summary: "Revitalizing urban spaces through community-led art installations and green infrastructure.",
      description:
        "The Urban Harmony Project aims to transform neglected urban spaces into vibrant community hubs through a combination of public art installations, green infrastructure development, and community engagement initiatives. This project seeks to foster social cohesion, promote environmental sustainability, and enhance the overall quality of life for residents.",
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
        {
          title: "Green Infrastructure Implementation",
          date: new Date("2023-12-15"),
          description: "Planting of trees, gardens, and green spaces to improve air quality and aesthetics.",
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
        {
          name: "Green Space Design",
          requiredTraining: ["Landscape Design", "Sustainability"],
          openings: 3,
          completedBy: [],
          description: "Design and implement green spaces that enhance the environmental quality of the area.",
          estimatedHours: 60,
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
        "The Digital Bridge Initiative aims to address the digital divide by providing underserved communities with access to technology, digital literacy training, and internet connectivity. This project seeks to empower individuals with the skills and resources they need to participate fully in the digital economy and society.",
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
        {
          participantId: "sam-taylor",
          role: "Technical Support",
          progress: 60,
          isCertified: false,
          joinedAt: new Date("2023-10-01"),
          requiredTraining: ["Network Security", "Hardware Maintenance"],
        },
      ],
      eligibilityCriteria: "Open to all community members with limited access to technology or digital skills.",
      milestones: [
        {
          title: "Technology Needs Assessment",
          date: new Date("2023-08-01"),
          description: "Assess the technology needs and digital literacy levels of target communities.",
        },
        {
          title: "Digital Literacy Training Program",
          date: new Date("2023-11-01"),
          description: "Launch a comprehensive digital literacy training program for community members.",
        },
        {
          title: "Community Technology Center",
          date: new Date("2024-01-15"),
          description:
            "Establish a community technology center with computers, internet access, and technical support.",
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
        {
          name: "Technical Support Specialist",
          requiredTraining: ["Hardware Repair", "Network Troubleshooting"],
          openings: 2,
          completedBy: [],
          description: "Provide technical support and troubleshooting assistance to community members.",
          estimatedHours: 40,
        },
      ],
      financialModel: "Government grants, corporate sponsorships, and individual donations.",
      media: [
        "/placeholder.svg?height=300&width=400&text=Training+Session",
        "/placeholder.svg?height=300&width=400&text=Tech+Center",
      ],
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
        "Enhanced community engagement and civic participation",
      ],
      budget: 250000,
      raised: 150000,
      createdAt: new Date("2023-07-01"),
      updatedAt: new Date("2024-02-29"),
    },
    {
      id: "regenerative-core",
      title: "Regenerative Core Initiative",
      summary:
        "Developing a sustainable community core through renewable energy, local food production, and waste reduction.",
      description:
        "The Regenerative Core Initiative aims to create a self-sustaining community core by integrating renewable energy systems, local food production, and waste reduction strategies. This project seeks to promote environmental stewardship, enhance community resilience, and create a model for sustainable living.",
      status: "planning",
      projectType: "Sustainability",
      nodeId: "BEAM Tech Collective - Oakland",
      podId: "Bay Area POD",
      partners: ["oakland-digital", "green-energy-coop"],
      coordinator: ["sam-taylor"],
      participants: [
        {
          participantId: "alex-chen",
          role: "Energy Consultant",
          progress: 50,
          isCertified: false,
          joinedAt: new Date("2023-11-01"),
          requiredTraining: ["Renewable Energy Systems", "Energy Efficiency"],
        },
        {
          participantId: "maya-rodriguez",
          role: "Food Production Specialist",
          progress: 40,
          isCertified: false,
          joinedAt: new Date("2023-12-01"),
          requiredTraining: ["Permaculture Design", "Organic Farming"],
        },
      ],
      eligibilityCriteria:
        "Open to all community members with an interest in sustainability, renewable energy, or local food production.",
      milestones: [
        {
          title: "Renewable Energy Feasibility Study",
          date: new Date("2023-10-15"),
          description: "Assess the feasibility of implementing renewable energy systems in the community.",
        },
        {
          title: "Community Garden Design and Planting",
          date: new Date("2024-02-01"),
          description: "Design and plant a community garden to provide fresh, local produce for residents.",
        },
        {
          title: "Waste Reduction and Recycling Program",
          date: new Date("2024-04-01"),
          description: "Implement a comprehensive waste reduction and recycling program for the community.",
        },
      ],
      contributionPaths: [
        {
          name: "Solar Panel Installation",
          requiredTraining: ["Electrical Safety", "Solar Technology"],
          openings: 3,
          completedBy: [],
          description: "Install and maintain solar panels on community buildings and homes.",
          estimatedHours: 60,
        },
        {
          name: "Composting and Waste Diversion",
          requiredTraining: ["Composting Techniques", "Waste Management"],
          openings: 2,
          completedBy: [],
          description: "Manage composting systems and implement waste diversion strategies.",
          estimatedHours: 40,
        },
      ],
      financialModel: "Grants, donations, and revenue from renewable energy and local food sales.",
      media: [
        "/placeholder.svg?height=300&width=400&text=Solar+Panels",
        "/placeholder.svg?height=300&width=400&text=Community+Garden",
      ],
      appreciationModel: {
        method: "upgrade_cycle",
        details:
          "Value appreciation based on the amount of renewable energy generated, food produced, and waste diverted.",
        currentValue: 75000,
        projectedValue: 180000,
      },
      outcomes: [
        "Reduced carbon footprint and environmental impact",
        "Increased access to local, healthy food",
        "Enhanced community resilience and self-sufficiency",
      ],
      budget: 200000,
      raised: 120000,
      createdAt: new Date("2023-09-01"),
      updatedAt: new Date("2024-02-29"),
    },
    {
      id: "community-garden",
      title: "Community Garden Expansion",
      summary: "Expanding the existing community garden to increase local food production and community engagement.",
      description:
        "The Community Garden Expansion project aims to increase local food production and community engagement by expanding the existing community garden. This project seeks to provide residents with access to fresh, healthy produce, promote sustainable agriculture practices, and foster a sense of community ownership.",
      status: "active",
      projectType: "Agriculture",
      nodeId: "BEAM FCU - Decatur",
      podId: "South Atlanta POD",
      partners: ["green-energy-coop"],
      coordinator: ["sam-taylor"],
      participants: [
        {
          participantId: "maya-rodriguez",
          role: "Gardening Specialist",
          progress: 70,
          isCertified: true,
          joinedAt: new Date("2024-01-15"),
        },
      ],
      eligibilityCriteria:
        "Open to all community members with an interest in gardening, local food production, or sustainable agriculture.",
      milestones: [
        {
          title: "Soil Testing and Preparation",
          date: new Date("2024-01-01"),
          description: "Test and prepare the soil for planting.",
        },
        {
          title: "Planting and Irrigation System Installation",
          date: new Date("2024-02-15"),
          description: "Plant crops and install an irrigation system.",
        },
        {
          title: "Harvest and Distribution",
          date: new Date("2024-04-01"),
          description: "Harvest and distribute produce to community members.",
        },
      ],
      contributionPaths: [
        {
          name: "Gardening Assistant",
          requiredTraining: ["Gardening Basics", "Soil Health"],
          openings: 5,
          completedBy: ["maya-rodriguez"],
          description: "Assist with planting, weeding, and harvesting crops.",
          estimatedHours: 30,
        },
        {
          name: "Irrigation System Maintenance",
          requiredTraining: ["Irrigation Techniques", "Water Conservation"],
          openings: 2,
          completedBy: [],
          description: "Maintain the irrigation system and ensure efficient water use.",
          estimatedHours: 20,
        },
      ],
      financialModel: "Community donations, grants, and revenue from produce sales.",
      media: [
        "/placeholder.svg?height=300&width=400&text=Garden+Plot",
        "/placeholder.svg?height=300&width=400&text=Harvest",
      ],
      appreciationModel: {
        method: "craftsmanship",
        details:
          "Value appreciation based on the quantity and quality of produce grown and the level of community engagement.",
      },
      outcomes: [
        "Increased access to fresh, healthy produce for community members",
        "Promotion of sustainable agriculture practices",
        "Enhanced community engagement and social cohesion",
      ],
      budget: 50000,
      raised: 30000,
      createdAt: new Date("2023-12-01"),
      updatedAt: new Date("2024-02-29"),
    },
  ]

  // Update the existing projects variable
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

  const adminRoles = [
    {
      title: "Executive Director",
      status: "Filled",
      person: "Dr. Sarah Johnson",
      bio: "PhD in Community Development, 15+ years in nonprofit leadership",
    },
    {
      title: "Technical Lead",
      status: "Open",
      person: "",
      bio: "Seeking experienced developer with community tech background",
    },
    {
      title: "Community Liaison",
      status: "Filled",
      person: "Marcus Williams",
      bio: "Local community advocate with deep neighborhood connections",
    },
    {
      title: "Sustainability Advisor",
      status: "Open",
      person: "",
      bio: "Environmental scientist or sustainability expert needed",
    },
  ]

  const wikiArticles = [
    {
      title: "BEAM OS Architecture",
      category: "Technical",
      lastUpdated: "2024-01-15",
      author: "Maya Rodriguez",
      summary: "Comprehensive overview of the BEAM OS technical architecture and core components.",
      content: "The BEAM OS architecture is built on principles of modularity, scalability, and community ownership...",
    },
    {
      title: "Community Governance Model",
      category: "Governance",
      lastUpdated: "2024-01-12",
      author: "Dr. Sarah Johnson",
      summary: "Framework for democratic decision-making and community participation in BEAM initiatives.",
      content: "Our governance model emphasizes participatory democracy and consensus-building...",
    },
    {
      title: "Cooperative Economics Principles",
      category: "Economics",
      lastUpdated: "2024-01-10",
      author: "Marcus Williams",
      summary: "Core economic principles underlying BEAM cooperative structures and financial models.",
      content: "BEAM cooperatives operate on principles of mutual aid, shared ownership, and economic democracy...",
    },
    {
      title: "Digital Sovereignty Framework",
      category: "Technology",
      lastUpdated: "2024-01-08",
      author: "James D. Smith",
      summary: "Guidelines for maintaining community control over digital infrastructure and data.",
      content: "Digital sovereignty ensures that communities maintain control over their digital infrastructure...",
    },
    {
      title: "Sustainable Development Goals",
      category: "Sustainability",
      lastUpdated: "2024-01-05",
      author: "Sam Taylor",
      summary: "How BEAM initiatives align with and advance UN Sustainable Development Goals.",
      content: "BEAM projects directly contribute to multiple SDGs through community-centered approaches...",
    },
  ]

  const partners = [
    {
      id: "readyaimgo",
      name: "ReadyAimGo",
      type: "Business" as const,
      logo: "/placeholder.svg?height=60&width=60",
      description:
        "Digital marketing and content creation agency specializing in community-driven campaigns and social impact storytelling.",
      servicesOffered: ["Digital Marketing", "Content Creation", "Brand Strategy", "Social Media Management"],
      contactPerson: {
        name: "Sarah Mitchell",
        email: "sarah@readyaimgo.com",
        title: "Community Partnerships Director",
      },
      website: "https://readyaimgo.com",
      activeProjects: ["digital-bridge", "urban-harmony"],
      linkedNodes: ["BEAM Orchestra - Atlanta", "BEAM FCU - Atlanta"],
      status: "Active" as const,
      notes: "Primary marketing partner for Atlanta POD initiatives",
    },
    {
      id: "morehouse-college",
      name: "Morehouse College",
      type: "Educational" as const,
      logo: "/placeholder.svg?height=60&width=60",
      description:
        "Historically Black liberal arts college providing educational partnerships and student internship opportunities.",
      servicesOffered: ["Student Internships", "Research Collaboration", "Educational Resources", "Community Outreach"],
      contactPerson: {
        name: "Dr. James Washington",
        email: "jwashington@morehouse.edu",
        title: "Community Engagement Coordinator",
      },
      website: "https://morehouse.edu",
      activeProjects: ["urban-harmony"],
      linkedNodes: ["BEAM FCU - Atlanta"],
      status: "Active" as const,
      notes: "Long-term educational partnership with student placement programs",
    },
    {
      id: "oakland-digital",
      name: "Oakland Digital",
      type: "Nonprofit" as const,
      logo: "/placeholder.svg?height=60&width=60",
      description:
        "Community technology nonprofit focused on digital equity and tech education in underserved communities.",
      servicesOffered: ["Tech Training", "Digital Literacy", "Equipment Loans", "Technical Support"],
      contactPerson: {
        name: "Maria Rodriguez",
        email: "maria@oaklanddigital.org",
        title: "Program Director",
      },
      website: "https://oaklanddigital.org",
      activeProjects: ["regenerative-core"],
      linkedNodes: ["BEAM Tech Collective - Oakland"],
      status: "Active" as const,
      notes: "Technology infrastructure and training partner",
    },
    {
      id: "atlanta-film-studio",
      name: "Atlanta Film Studio",
      type: "Cultural" as const,
      logo: "/placeholder.svg?height=60&width=60",
      description:
        "Independent film production studio offering equipment, space, and expertise for community media projects.",
      servicesOffered: ["Equipment Rental", "Studio Space", "Production Support", "Media Training"],
      contactPerson: {
        name: "Michael Thompson",
        email: "michael@atlantafilmstudio.com",
        title: "Community Relations Manager",
      },
      website: "https://atlantafilmstudio.com",
      activeProjects: ["digital-bridge"],
      linkedNodes: ["BEAM Orchestra - Atlanta"],
      status: "Inactive" as const,
      notes: "Seasonal partnership for media production projects",
    },
    {
      id: "green-energy-coop",
      name: "Green Energy Cooperative",
      type: "Business" as const,
      logo: "/placeholder.svg?height=60&width=60",
      description:
        "Renewable energy cooperative providing sustainable power solutions and energy education for community projects.",
      servicesOffered: ["Solar Installation", "Energy Consulting", "Sustainability Training", "Equipment Maintenance"],
      contactPerson: {
        name: "Lisa Chen",
        email: "lisa@greenenergycoop.org",
        title: "Community Partnerships Lead",
      },
      website: "https://greenenergycoop.org",
      activeProjects: ["regenerative-core", "community-garden"],
      linkedNodes: ["BEAM Tech Collective - Oakland", "BEAM FCU - Decatur"],
      status: "Active" as const,
      notes: "Renewable energy infrastructure partner across multiple PODs",
    },
  ]

  // Partner type definitions
  type PartnerType = "Business" | "Educational" | "Nonprofit" | "Cultural" | "Other"
  type PartnerStatus = "Active" | "Inactive"

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
          {
            name: "Member Portal",
            url: "https://members.beamfcu.org",
            description: "Access account information and services",
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
      assignedProjects: ["community-garden"],
      participants: ["sam-taylor"],
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
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
        ],
      },
    },
    "BEAM FCU - Tuskegee": {
      ngo: "BEAM FCU",
      pod: "South Atlanta POD",
      mission:
        "Agricultural cooperative and training center focusing on sustainable farming and rural economic development.",
      location: {
        city: "Tuskegee, AL",
        status: "Proposed",
        lotSize: "3.2 acres",
        type: "Cooperative Farm",
        coordinates: "32.4240, -85.7077",
        description: "Agricultural cooperative and training center",
      },
      institutionPartners: ["Tuskegee University"],
      assignedProjects: [],
      participants: [],
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
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
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
          {
            name: "Performance Portal",
            url: "https://performances.beamorchestra.org",
            description: "Event booking and performance scheduling",
          },
        ],
      },
    },
    "BEAM Orchestra - Madison": {
      ngo: "BEAM Orchestra",
      pod: "Great Lakes POD",
      mission: "Recording studio and archival restoration facility serving the Midwest region.",
      location: {
        city: "Madison, WI",
        status: "Active",
        lotSize: "0.8 acres",
        type: "Recording Studio",
        coordinates: "43.0731, -89.4012",
        description: "Professional recording and archival restoration",
      },
      institutionPartners: ["University of Wisconsin-Madison"],
      assignedProjects: ["digital-archive"],
      participants: [],
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
    "BEAM Orchestra - Baltimore": {
      ngo: "BEAM Orchestra",
      pod: "South Atlanta POD",
      mission: "Community cultural hub and education center for the Mid-Atlantic region.",
      location: {
        city: "Baltimore, MD",
        status: "Planning",
        lotSize: "2.1 acres",
        type: "Cultural Center",
        coordinates: "39.2904, -76.6122",
        description: "Community cultural hub and education center",
      },
      institutionPartners: ["Johns Hopkins University", "Baltimore Symphony Orchestra"],
      assignedProjects: [],
      participants: [],
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamorchestra.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-orchestra",
          android: "https://play.google.com/store/apps/details?id=org.beamorchestra",
        },
        tools: [
          {
            name: "Education Hub",
            url: "https://education.beamorchestra.org",
            description: "Music education resources and courses",
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
      assignedProjects: ["regenerative-core"],
      participants: ["maya-rodriguez"],
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamtech.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-tech",
          android: "https://play.google.com/store/apps/details?id=org.beamtech",
        },
        tools: [
          { name: "BEAM OS Platform", url: "https://os.beam.org", description: "Community operating system and tools" },
          {
            name: "Developer Portal",
            url: "https://dev.beamtech.org",
            description: "Open-source development resources",
          },
        ],
      },
    },
    "BEAM Tech Collective - Detroit": {
      ngo: "BEAM Tech Collective",
      pod: "Great Lakes POD",
      mission: "Community technology training and development center for the Great Lakes region.",
      location: {
        city: "Detroit, MI",
        status: "Planning",
        lotSize: "2.0 acres",
        type: "Innovation Center",
        coordinates: "42.3314, -83.0458",
        description: "Community technology training and development",
      },
      institutionPartners: ["Wayne State University", "Detroit Digital Justice Coalition"],
      assignedProjects: [],
      participants: [],
      images: ["/placeholder.svg?height=200&width=300"],
      accessTools: {
        website: "https://beamtech.org",
        apps: {
          ios: "https://apps.apple.com/app/beam-tech",
          android: "https://play.google.com/store/apps/details?id=org.beamtech",
        },
        tools: [
          {
            name: "Community Cloud",
            url: "https://cloud.beamtech.org",
            description: "Cooperative cloud infrastructure services",
          },
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

  // Speech Recognition Functions
  const startListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      showErrorToast("Speech recognition is not supported in your browser")
      return
    }

    try {
      setIsListening(true)
      recognitionRef.current.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      setIsListening(false)
      showErrorToast("Could not start speech recognition")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  // Text-to-Speech Functions
  const speakText = (text: string, advisorId: string) => {
    if (!synthRef.current || !voiceEnabled) return

    // Stop any current speech
    stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)
    const profile = voiceProfiles[advisorId as keyof typeof voiceProfiles]

    if (profile) {
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = profile.volume

      // Try to find a suitable voice
      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.toLowerCase().includes(profile.voiceName) || voice.lang.includes("en-US"),
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    currentUtteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
    currentUtteranceRef.current = null
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  // Enhanced Chat functions with voice
  const handleSendMessage = (advisorId: string) => {
    if (!currentMessage.trim()) return

    const newMessage = {
      role: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => ({
      ...prev,
      [advisorId]: [...(prev[advisorId] || []), newMessage],
    }))

    setCurrentMessage("")

    // Simulate AI response with voice
    setTimeout(() => {
      const advisor = aiAgents.find((a) => a.id === advisorId)
      let aiResponseText = ""

      // Generate contextual response based on advisor personality
      if (advisorId === "minerva-haugabrooks") {
        if (currentMessage.toLowerCase().includes("community")) {
          aiResponseText =
            "You know, when I think about community development, I always come back to this fundamental truth: communities already have the solutions within them. Our job isn't to bring answers from the outside, but to help those internal solutions emerge and flourish. What specific community are you working with, and what have you noticed about their existing strengths?"
        } else if (currentMessage.toLowerCase().includes("project")) {
          aiResponseText =
            "Every successful project I've seen starts with deep listening. Before we talk about what needs to be built or changed, we need to understand what the community values most. Have you spent time just sitting with folks, maybe in their everyday spaces, hearing their stories about what matters to them?"
        } else {
          aiResponseText =
            "That's a thoughtful question, and it reminds me of something I learned early in my work in Alabama. The most sustainable changes happen when communities feel ownership over the process, not just the outcome. What's the context you're working in? I'd love to understand more about your situation so I can share some relevant experiences."
        }
      } else if (advisorId === "james-smith") {
        if (currentMessage.toLowerCase().includes("technology") || currentMessage.toLowerCase().includes("tech")) {
          aiResponseText =
            "You're touching on something I spent my whole career thinking about. Technology is never neutral - it either empowers communities or it extracts from them. The key question I always ask is: who controls the technology? Who owns the data? Who makes the decisions about how it's used? When communities have that control, technology becomes a tool for liberation rather than dependence."
        } else if (currentMessage.toLowerCase().includes("community")) {
          aiResponseText =
            "Community-controlled technology was my life's work, and I learned that the 'community' part is actually more important than the 'technology' part. The best tech solutions I ever implemented were the ones where the community told me what they needed, not the other way around. What specific challenges is your community facing that technology might help address?"
        } else {
          aiResponseText =
            "That's exactly the kind of question that gets to the heart of community technology work. In my experience, the most important thing is to start small and build trust. Communities have often been burned by technology promises before. What's your relationship to the community you're thinking about working with?"
        }
      } else {
        aiResponseText = `Thank you for your question. As ${advisor?.fullName}, I appreciate your interest in ${currentMessage.toLowerCase().includes("community") ? "community development" : "this topic"}. Based on my experience, I'd suggest starting with understanding the specific context of your community. What particular challenges or opportunities are you seeing? I find that the best solutions emerge when we truly listen to what the community is telling us.`
      }

      const aiResponse = {
        role: "assistant" as const,
        content: aiResponseText,
        timestamp: new Date(),
      }

      setChatMessages((prev) => ({
        ...prev,
        [advisorId]: [...(prev[advisorId] || []), aiResponse],
      }))

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => {
          speakText(aiResponseText, advisorId)
        }, 500)
      }
    }, 1500)
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

  // Advisor Chat Component
  const AdvisorChat = ({ advisor }: { advisor: AIAdvisor }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      // Scroll to the bottom of the chat container when messages change
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, [chatMessages[advisor.id]])

    const handlePlayAudio = async (message: any) => {
      if (isPlaying) {
        // Pause the currently playing audio
        if (audioUrl) {
          const audio = new Audio(audioUrl)
          audio.pause()
        }
        setIsPlaying(false)
        setAudioUrl(null)
      } else {
        // Play the new audio
        try {
          // Fetch the audio data from the API endpoint
          const response = await fetch(`/api/generate-audio?text=${message.content}&advisorId=${advisor.id}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`)
          }

          const data = await response.json()
          if (data.audioUrl) {
            setAudioUrl(data.audioUrl)
            setIsPlaying(true)

            // Play the audio
            const audio = new Audio(data.audioUrl)
            audio.play()

            // Set isPlaying to false when audio ends
            audio.onended = () => {
              setIsPlaying(false)
              setAudioUrl(null)
            }

            // Handle audio errors
            audio.onerror = (error) => {
              console.error("Audio playback error:", error)
              setIsPlaying(false)
              setAudioUrl(null)
              showErrorToast("Error playing audio. Please try again.")
            }
          } else {
            showErrorToast("Failed to generate audio. Please try again.")
          }
        } catch (error: any) {
          console.error("Error generating or playing audio:", error)
          showErrorToast(`Error: ${error.message || "Failed to generate audio. Please try again."}`)
        }
      }
    }

    return (
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
        <CardHeader className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={advisor.avatar || "/placeholder.svg"} alt={advisor.fullName} />
            <AvatarFallback>{advisor.fullName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-white">{advisor.fullName}</CardTitle>
            <CardDescription className="text-gray-400">{advisor.role}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/advisors/${advisor.slug}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit Memorial</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={toggleVoice}>
                    {voiceEnabled ? (
                      <Volume2 className="h-5 w-5 text-gray-400" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{voiceEnabled ? "Disable Voice" : "Enable Voice"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col">
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-2 mb-3">
            {(chatMessages[advisor.id] || []).map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === "assistant" && voiceEnabled && (
                      <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(message)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(advisor.id)
                }
              }}
              className="flex-grow bg-gray-800 border-gray-700 text-white"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="secondary" onClick={() => handleSendMessage(advisor.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    )
  }

  const fundingProgress = (financialData.currentFunding / financialData.fundingGoal) * 100

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <TooltipProvider>
        <div className="container mx-auto py-6 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">BEAM OS Dashboard</h1>
              <p className="text-gray-400">Community collaboration platform</p>
            </div>

            {/* Authentication Section */}
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

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Node Selection */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Select Node</CardTitle>
                  <Input
                    type="search"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map((nodeKey) => {
                        const node = beamNodes[nodeKey]
                        const IconComponent = getNodeIcon(nodeKey)
                        const statusColor = getStatusColor(node.location.status)

                        return (
                          <Button
                            key={nodeKey}
                            variant="ghost"
                            className={`w-full justify-start hover:bg-gray-700 rounded-md p-3 h-auto ${
                              selectedNode === nodeKey ? "bg-gray-700" : ""
                            }`}
                            onClick={() => setSelectedNode(nodeKey)}
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
                          </Button>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">No nodes found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="bg-gray-900/50 border-gray-700 rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => setShowContributionModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Contribute
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" onClick={() => showLoginRequiredToast()}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" onClick={() => showLoginRequiredToast()}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
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
                                  <AvatarFallback className="text-xs">
                                    {participant.name.substring(0, 2)}
                                  </AvatarFallback>
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
                    Choose from the available nodes in the sidebar to explore community initiatives.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Advisor Chat Section */}
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">AI Advisors</h2>
              <p className="text-gray-400">Connect with AI agents for expert insights and guidance.</p>
            </div>

            {advisorsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading AI advisors...</p>
              </div>
            ) : advisorsError ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading advisors: {advisorsError}</p>
              </div>
            ) : aiAgents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiAgents.map((advisor) => (
                  <AdvisorChat key={advisor.id} advisor={advisor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No AI advisors available.</p>
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
