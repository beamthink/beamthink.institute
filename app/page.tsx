"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Users,
  Building,
  Brain,
  FolderOpen,
  MapPin,
  Edit,
  Settings,
  BookOpen,
  FileText,
  ExternalLink,
  ChevronRight,
  Upload,
  Play,
  Send,
  Volume2,
  VolumeX,
  Pause,
} from "lucide-react"
import { Eye } from "lucide-react"
import Link from "next/link"
// Ensure these shadcn/ui components are correctly added via `npx shadcn-ui@latest add <component>`
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Correct import for sonner's useToast hook assuming it's correctly set up in layout.tsx
import { toast } from "sonner" // Corrected import for sonner's toast function

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
  // const { toast } = useToast() // REMOVED: This is for shadcn/ui's toast, conflicting with sonner
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

  // Enhanced AI Agents data
  const aiAgents: AIAdvisor[] = [
    {
      id: "minerva-haugabrooks",
      slug: "minerva-haugabrooks",
      fullName: "Dr. Minerva Haugabrooks",
      role: "Community Development Strategist",
      bio: "AI agent specializing in community development, urban planning, and social impact assessment. Provides strategic insights for sustainable community initiatives.",
      detailedBio:
        "Dr. Minerva Haugabrooks was a pioneering community development strategist whose work fundamentally shaped how we understand the intersection of urban planning, social justice, and economic empowerment. Born in 1945 in rural Alabama, she witnessed firsthand the challenges facing underserved communities and dedicated her life to developing innovative, community-centered solutions.\n\nHer groundbreaking research on 'Participatory Economic Development' introduced frameworks that prioritized community ownership and decision-making in development projects. Dr. Haugabrooks believed that sustainable change could only come from within communities themselves, with external support serving as a catalyst rather than a driving force.\n\nThroughout her 40-year career, she advised on over 200 community development projects across the American South, establishing cooperative businesses, community land trusts, and participatory budgeting initiatives that continue to thrive today. Her work directly influenced the creation of over 50 community-owned enterprises and helped secure affordable housing for thousands of families.\n\nDr. Haugabrooks was also a prolific writer and educator, authoring 12 books and over 100 academic papers on community development theory and practice. She held teaching positions at Tuskegee University, Morehouse College, and Clark Atlanta University, mentoring hundreds of students who went on to become community leaders themselves.",
      avatar: "/placeholder.svg?height=120&width=120&text=Dr.+Minerva",
      birthYear: 1945,
      deathYear: 2019,
      specialties: [
        "Community Development",
        "Urban Planning",
        "Cooperative Economics",
        "Social Impact Assessment",
        "Participatory Democracy",
        "Community Land Trusts",
      ],
      keyWorks: [
        "Participatory Economic Development: A Framework for Community Ownership (1987)",
        "Building from Within: Community-Centered Development Strategies (1995)",
        "The Cooperative Advantage: Economic Democracy in Practice (2003)",
        "Roots and Routes: Sustainable Development in the American South (2012)",
      ],
      quotes: [
        "True development doesn't happen to a community—it happens with a community.",
        "The best solutions are already within the community; our job is to help them emerge.",
        "Economic democracy is not just an ideal—it's a practical necessity for sustainable development.",
        "When communities control their own development, they create wealth that stays and grows.",
      ],
      timeline: [
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
          year: 1972,
          title: "PhD in Urban Planning",
          description: "Completed doctoral studies at MIT, focusing on community-controlled development strategies.",
          category: "education",
        },
        {
          year: 1975,
          title: "First Community Development Project",
          description:
            "Led the revitalization of the Historic Auburn Avenue district in Atlanta, establishing the first community land trust in Georgia.",
          category: "career",
        },
        {
          year: 1987,
          title: "Published Seminal Work",
          description:
            "Released 'Participatory Economic Development,' which became the foundational text for community-centered development.",
          category: "publication",
        },
        {
          year: 1995,
          title: "Founded Community Development Institute",
          description:
            "Established the Institute at Clark Atlanta University to train the next generation of community developers.",
          category: "achievement",
        },
        {
          year: 2003,
          title: "MacArthur Fellowship",
          description:
            "Received the MacArthur 'Genius Grant' for her innovative approaches to community economic development.",
          category: "achievement",
        },
        {
          year: 2019,
          title: "Legacy Continues",
          description:
            "Passed away at age 74, leaving behind a network of thriving communities and hundreds of trained practitioners.",
          category: "legacy",
        },
      ],
      media: [
        {
          id: "minerva-1",
          type: "image",
          title: "Dr. Haugabrooks at Community Meeting, 1985",
          description: "Leading a participatory planning session in Birmingham, Alabama",
          url: "/placeholder.svg?height=300&width=400&text=Community+Meeting",
          uploadedBy: "BEAM Archive",
          uploadedAt: new Date("2024-01-01"),
          tags: ["historical", "community organizing", "1980s"],
          approved: true,
        },
        {
          id: "minerva-2",
          type: "document",
          title: "Original Manuscript: Participatory Economic Development",
          description: "Handwritten notes and early drafts of her groundbreaking 1987 book",
          url: "/placeholder.svg?height=300&width=400&text=Manuscript",
          uploadedBy: "Haugabrooks Estate",
          uploadedAt: new Date("2024-01-01"),
          tags: ["manuscript", "theory", "economics"],
          approved: true,
        },
        {
          id: "minerva-3",
          type: "video",
          title: "1995 Lecture: Building Community Wealth",
          description: "Complete recording of her famous lecture at Harvard Kennedy School",
          url: "/placeholder.svg?height=300&width=400&text=Video+Lecture",
          uploadedBy: "Harvard Archives",
          uploadedAt: new Date("2024-01-01"),
          tags: ["lecture", "education", "community wealth"],
          approved: true,
        },
        {
          id: "minerva-4",
          type: "audio",
          title: "Voice Sample: Dr. Haugabrooks Interview, 1998",
          description: "Audio interview discussing community development principles",
          url: "/placeholder.svg?height=300&width=400&text=Audio+Interview",
          uploadedBy: "NPR Archives",
          uploadedAt: new Date("2024-01-01"),
          tags: ["interview", "voice", "1998"],
          approved: true,
        },
      ],
      contributions: [
        {
          id: "contrib-1",
          type: "memory",
          title: "Working with Dr. Haugabrooks in Atlanta",
          content:
            "I had the privilege of working with Dr. Haugabrooks on the Auburn Avenue project in the late 1970s. What struck me most was her ability to listen—really listen—to community members. She would spend hours in barbershops, beauty salons, and church basements, not talking about her plans, but asking people about their dreams for their neighborhood. She taught me that the best development strategies come from the community itself.",
          contributorName: "James Washington",
          contributorEmail: "jwashington@example.com",
          submittedAt: new Date("2024-01-15"),
          approved: true,
          tags: ["personal story", "methodology", "Atlanta"],
        },
        {
          id: "contrib-2",
          type: "quote",
          title: "On Community Ownership",
          content:
            "Dr. Haugabrooks once told our class: 'When a community owns its development process, it owns its future. When development is done to a community, the community becomes a tenant in its own neighborhood.'",
          contributorName: "Maria Rodriguez",
          contributorEmail: "mrodriguez@example.com",
          submittedAt: new Date("2024-01-20"),
          approved: true,
          tags: ["quote", "philosophy", "ownership"],
        },
      ],
      chatPersonality:
        "Dr. Haugabrooks speaks with warmth and wisdom, often drawing from her extensive experience working with communities across the American South. She asks thoughtful questions to understand the context before offering advice, and frequently references the importance of community ownership and participatory decision-making. Her responses are practical yet visionary, grounded in decades of real-world experience.",
      voiceCharacteristics:
        "Warm, measured Southern accent with thoughtful pauses. Speaks with the authority of experience but maintains a nurturing, grandmother-like quality. Often emphasizes key words and uses inclusive language.",
      isActive: true,
      totalContributions: 2,
      lastUpdated: new Date("2024-02-20"),
    },
    {
      id: "james-smith",
      slug: "james-smith",
      fullName: "James D. Smith",
      role: "Technology Integration Specialist",
      bio: "AI agent focused on technology solutions for community spaces, digital inclusion strategies, and innovative tools for collaborative work.",
      detailedBio:
        "James D. Smith was a visionary technologist who dedicated his career to bridging the digital divide and ensuring that technology served community empowerment rather than displacement. Born in Detroit in 1960, he grew up witnessing both the decline of traditional manufacturing and the early promise of the computer revolution.\n\nSmith's unique contribution was his understanding that technology alone could never solve community problems—but that the right technology, implemented with community input and ownership, could be a powerful tool for social change. He pioneered the concept of 'Community-Controlled Technology,' developing frameworks for how neighborhoods could own and operate their own digital infrastructure.\n\nThroughout the 1990s and 2000s, Smith worked with dozens of communities to establish community-owned internet networks, digital literacy programs, and technology cooperatives. His work was instrumental in the development of community wireless networks and the early community broadband movement.\n\nSmith was also a prolific inventor and open-source advocate, holding 15 patents while simultaneously releasing dozens of community technology tools under open licenses. He believed that communities should have the right to understand, modify, and control the technology they used.",
      avatar: "/placeholder.svg?height=120&width=120&text=James+Smith",
      birthYear: 1960,
      deathYear: 2021,
      specialties: [
        "Community Technology",
        "Digital Inclusion",
        "Open Source Development",
        "Community Networks",
        "Digital Literacy",
      ],
      keyWorks: [
        "Community-Controlled Technology: A Framework for Digital Democracy (1998)",
        "The Neighborhood Network: Building Community-Owned Internet (2005)",
        "Open Source Community Development (2010)",
        "Digital Sovereignty in Practice (2018)",
      ],
      quotes: [
        "Technology should amplify community voices, not replace them.",
        "The best technology is invisible—it just helps people do what they already want to do.",
        "Every community should have the right to understand and control its digital infrastructure.",
        "Innovation happens when communities have the tools to solve their own problems.",
      ],
      timeline: [
        {
          year: 1960,
          title: "Born in Detroit",
          description:
            "Born in Detroit during the height of the automotive industry, witnessed the city's transformation through deindustrialization.",
          category: "education",
        },
        {
          year: 1982,
          title: "Computer Science Degree",
          description:
            "Graduated from University of Michigan with a focus on distributed systems and community applications.",
          category: "education",
        },
        {
          year: 1990,
          title: "First Community Network",
          description:
            "Helped establish one of the first community-owned bulletin board systems (BBS) in East Detroit.",
          category: "career",
        },
        {
          year: 1998,
          title: "Published Technology Framework",
          description: "Released his influential work on community-controlled technology development.",
          category: "publication",
        },
        {
          year: 2005,
          title: "Community Broadband Pioneer",
          description: "Led the development of the first community-owned fiber network in rural Michigan.",
          category: "achievement",
        },
        {
          year: 2015,
          title: "Open Source Community Platform",
          description: "Released the Community OS platform, now used by over 100 community organizations worldwide.",
          category: "achievement",
        },
        {
          year: 2021,
          title: "Digital Legacy",
          description: "Passed away at 61, leaving behind a network of community-controlled technology initiatives.",
          category: "legacy",
        },
      ],
      media: [
        {
          id: "james-1",
          type: "image",
          title: "Installing Community Network Equipment, 2005",
          description: "James working with community volunteers to install fiber optic equipment",
          url: "/placeholder.svg?height=300&width=400&text=Network+Installation",
          uploadedBy: "Detroit Community Networks",
          uploadedAt: new Date("2024-01-01"),
          tags: ["community networks", "installation", "2005"],
          approved: true,
        },
        {
          id: "james-2",
          type: "document",
          title: "Community OS Source Code",
          description: "Original source code and documentation for the Community OS platform",
          url: "/placeholder.svg?height=300&width=400&text=Source+Code",
          uploadedBy: "Open Source Archive",
          uploadedAt: new Date("2024-01-01"),
          tags: ["open source", "platform", "code"],
          approved: true,
        },
        {
          id: "james-3",
          type: "audio",
          title: "Voice Sample: James at TechSoup Conference, 2010",
          description: "Audio recording of James discussing community technology principles",
          url: "/placeholder.svg?height=300&width=400&text=Conference+Audio",
          uploadedBy: "TechSoup Archives",
          uploadedAt: new Date("2024-01-01"),
          tags: ["conference", "voice", "2010"],
          approved: true,
        },
      ],
      contributions: [
        {
          id: "contrib-3",
          type: "memory",
          title: "Learning from James at TechSoup Conference",
          content:
            "I met James at a TechSoup conference in 2010. What impressed me was how he always asked 'Who benefits?' when evaluating any technology solution. He taught me that the most important question isn't 'Can we build this?' but 'Should we build this, and who gets to decide?'",
          contributorName: "Sarah Kim",
          contributorEmail: "skim@example.com",
          submittedAt: new Date("2024-01-18"),
          approved: true,
          tags: ["conference", "philosophy", "ethics"],
        },
      ],
      chatPersonality:
        "James speaks with the practical wisdom of someone who has spent decades implementing technology in real communities. He's curious about the specific context and always asks about community ownership and control. His responses blend technical expertise with deep understanding of community dynamics, and he often suggests starting small and building incrementally.",
      voiceCharacteristics:
        "Clear Midwestern accent with a friendly, approachable tone. Speaks with technical precision but avoids jargon. Has a slight enthusiasm when discussing community empowerment through technology.",
      isActive: true,
      totalContributions: 1,
      lastUpdated: new Date("2024-02-20"),
    },
  ]

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

  // Enhanced Project Card Component for Overview
  const EnhancedProjectCard = ({ project }: { project: EnhancedProject }) => (
    <Card className="bg-gray-900/50 border-gray-700 rounded-2xl hover:border-gray-500 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {project.projectType === "Manufacturing" && <Building className="h-6 w-6 text-white" />}
              {project.projectType === "Housing" && <Users className="h-6 w-6 text-white" />}
              {project.projectType === "Tech" && <Brain className="h-6 w-6 text-white" />}
              {!["Manufacturing", "Housing", "Tech"].includes(project.projectType) && (
                <FolderOpen className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-white text-lg">{project.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                  {project.projectType}
                </Badge>
                <Badge
                  variant={
                    project.status === "active"
                      ? "default"
                      : project.status === "planning"
                        ? "secondary"
                        : "destructive"
                  }
                  className="bg-gray-800 text-gray-300 text-xs"
                >
                  {project.status === "active"
                    ? "🟢 Active"
                    : project.status === "planning"
                      ? "🟡 Planning"
                      : "🔴 Archived"}
                </Badge>
                <span className="text-muted-foreground text-xs">{project.nodeId}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.summary}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Participants:</span>
            <span className="text-white">{project.participants.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Open Positions:</span>
            <span className="text-green-400">
              {project.contributionPaths.reduce((sum, path) => sum + path.openings, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Current Value:</span>
            <span className="text-white">{formatCurrency(project.appreciationModel.currentValue || 0)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((project.raised / project.budget) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {formatCurrency(project.raised)} raised of {formatCurrency(project.budget)} goal
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Projects Modal Component
  const ProjectsModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {" "}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
               {" "}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                   {" "}
          <div className="flex items-center gap-3">
                        <FolderOpen className="h-8 w-8 text-cyan-400" />           {" "}
            <div>
                            <h2 className="text-white text-3xl font-bold">Projects</h2>             {" "}
              <p className="text-gray-400 text-lg">
                                Community-driven initiatives shaping our future              {" "}
              </p>
                         {" "}
            </div>
          </div>
                   {" "}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-700 rounded-full"
            onClick={() => setShowProjectsModal(false)}
          >
                       {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-400 hover:text-gray-300 transition-colors"
            >
                           {" "}
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
                         {" "}
            </svg>
                     {" "}
          </Button>
                 {" "}
        </div>
               {" "}
        <div className="p-6 overflow-y-auto h-full">
                   {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {" "}
            {projects.map((project) => (
              <EnhancedProjectCard key={project.id} project={project} />
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <TooltipProvider>
        <div className="container mx-auto py-8 px-4">
          {showLogo && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">BEAM OS Dashboard</h1>
              <p className="text-gray-400">Welcome to the future of community collaboration</p>
            </div>
          )}

          {/* Authentication Section */}
          <div className="flex justify-end mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Sidebar - Node Selection */}
            <div className="md:col-span-1 space-y-4">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Select a Node</CardTitle>
                  <CardDescription className="text-gray-400">Explore community initiatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="search"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map((nodeKey) => (
                        <Button
                          key={nodeKey}
                          variant="ghost"
                          className={`w-full justify-start hover:bg-gray-700 rounded-md ${selectedNode === nodeKey ? "bg-gray-700" : ""}`}
                          onClick={() => setSelectedNode(nodeKey)}
                        >
                          {nodeKey}
                        </Button>
                      ))
                    ) : (
                      <p className="text-gray-500">No nodes found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">Manage your contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="secondary" className="w-full" onClick={() => setShowContributionModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Contribute
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => showLoginRequiredToast()}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => showLoginRequiredToast()}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area - Node Overview */}
            <div className="md:col-span-3 space-y-6">
              {currentNode ? (
                <>
                  {/* Node Header */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-2xl font-bold">{selectedNode}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {currentNode.mission}
                          {currentPod && (
                            <div className="flex items-center gap-2 mt-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{currentPod.location}</span>
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      <Button variant="secondary" onClick={() => showInfoToast("This feature is under development")}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Node
                      </Button>
                    </CardHeader>
                  </Card>

                  {/* Financial Overview */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Financial Overview</CardTitle>
                      <CardDescription className="text-gray-400">Key financial metrics for this node</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Total Assets:</span>
                            <span className="text-white">{formatCurrency(financialData.totalAssets)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Liquid Funds:</span>
                            <span className="text-white">{formatCurrency(financialData.liquidFunds)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Property Value:</span>
                            <span className="text-white">{formatCurrency(financialData.propertyValue)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Equipment Value:</span>
                            <span className="text-white">{formatCurrency(financialData.equipmentValue)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Potential Project Value:</span>
                            <span className="text-white">{formatCurrency(financialData.potentialProjectValue)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Funding Goal:</span>
                            <span className="text-white">{formatCurrency(financialData.fundingGoal)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects Overview */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Projects Overview</CardTitle>
                        <CardDescription className="text-gray-400">Active initiatives in this node</CardDescription>
                      </div>
                      <Button variant="secondary" onClick={() => setShowProjectsModal(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {nodeProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {nodeProjects.slice(0, 2).map((project) => (
                            <EnhancedProjectCard key={project.id} project={project} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No projects found for this node.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Participants Section */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Participants</CardTitle>
                      <CardDescription className="text-gray-400">Key contributors to this node</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {nodeParticipants.length > 0 ? (
                        <div className="flex items-center space-x-4 overflow-x-auto">
                          {nodeParticipants.map((participant) => (
                            <div key={participant.id} className="flex flex-col items-center">
                              <Avatar>
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-400 mt-1">{participant.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No participants found for this node.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Access Tools Section */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Access Tools</CardTitle>
                      <CardDescription className="text-gray-400">Resources and platforms for this node</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentNode.accessTools.website && (
                        <Button variant="secondary" asChild>
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
                      {currentNode.accessTools.apps?.ios && (
                        <Button variant="secondary" asChild>
                          <a
                            href={currentNode.accessTools.apps.ios}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handlePlaceholderClick(e, "Navigating to iOS App Store")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            iOS App
                          </a>
                        </Button>
                      )}
                      {currentNode.accessTools.apps?.android && (
                        <Button variant="secondary" asChild>
                          <a
                            href={currentNode.accessTools.apps.android}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handlePlaceholderClick(e, "Navigating to Google Play Store")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Android App
                          </a>
                        </Button>
                      )}
                      {currentNode.accessTools.tools?.map((tool) => (
                        <Button variant="secondary" key={tool.name} asChild>
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

                  {/* Admin Roles Section */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Admin Roles</CardTitle>
                      <CardDescription className="text-gray-400">Leadership and advisory positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {adminRoles.map((role, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-white hover:bg-gray-700 rounded-md">
                              {role.title} - {role.status}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                              <p>{role.bio}</p>
                              {role.person && <p className="mt-2">Person: {role.person}</p>}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* Wiki Articles Section */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Wiki Articles</CardTitle>
                      <CardDescription className="text-gray-400">Learn more about BEAM OS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {wikiArticles.map((article, index) => (
                          <div key={index} className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-semibold">{article.title}</h3>
                              <p className="text-gray-400 text-sm">{article.summary}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="border-gray-700 text-gray-400 text-xs">
                                  {article.category}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  Last Updated: {article.lastUpdated}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => showInfoToast("Navigating to Wiki Article")}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Read More
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Partners Section */}
                  <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Partners</CardTitle>
                      <CardDescription className="text-gray-400">Organizations supporting this node</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partners.map((partner) => (
                          <div key={partner.id} className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={partner.logo || "/placeholder.svg"} alt={partner.name} />
                              <AvatarFallback>{partner.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{partner.name}</p>
                              <p className="text-gray-400 text-sm">{partner.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center text-gray-500">Select a node to view details.</div>
              )}
            </div>
          </div>

          {/* AI Advisor Chat Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">AI Advisors</h2>
            <p className="text-gray-400 mb-6">Connect with AI agents for expert insights and guidance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((advisor) => (
                <AdvisorChat key={advisor.id} advisor={advisor} />
              ))}
            </div>
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
