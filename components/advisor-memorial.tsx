"use client"

import { useState } from "react"
import Link from "next/link"
// Add missing import for Image component if not already there, and urlForImage
import Image from 'next/image';
import { urlFor } from '@/lib/sanity'; // Assuming urlFor is exported from lib/sanity.ts

// Add PortableText related imports
import { PortableText, PortableTextComponents, PortableTextMarkComponentProps } from '@portabletext/react';
import { SanityImageSource } from '@sanity/image-url/lib/types/types'; // Needed for image typing in PortableText components

// Add lucide-react icons (make sure all are imported if used in this component)
import { ArrowLeft, Calendar, Quote, FileText, ExternalLink, MessageCircle, Plus, User, Volume2, VolumeX, TrendingUp, DollarSign, BookOpen, Network, Globe, Info, Mail, Phone, Upload, Mic, MicOff, ChevronRight, Pause } from "lucide-react"

// Add shadcn/ui component imports (make sure all are imported)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea" // For the contribution modal
import { Input } from "@/components/ui/input" // For the contribution modal
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // For tooltips
// Import Toast components/hooks (if using shadcn/ui's toast, otherwise use sonner)
// import { useToast } from "@/hooks/use-toast" // If you're using shadcn/ui's useToast here
import { toast } from "sonner"; // Using sonner directly for toasts, as per previous setup

// Import your custom components
import ContributionModal from "./contribution-modal" // This should be a client component itself
// import CommunityMemories from "./community-memories" // We removed direct usage for now

// --- INTERFACES (DEFINITIONS FOR DATA STRUCTURES) ---
// These should mirror the types in your page.tsx and Sanity/Supabase data

interface SupabaseAdvisorBasic {
  id: string;
  slug: string;
  full_name: string;
  role: string;
  bio: string; // Short bio from Supabase
  avatar: string | null; // URL string
  is_active: boolean;
  specialties?: string[] | null; // From Supabase
  // totalContributions is not in Supabase, will be from Sanity or calculated
}

interface SanityPersonRichData {
  _id: string;
  _type: "person";
  fullName?: string;
  detailedBio?: any; // PortableText
  quotes?: string[];
  timeline?: Array<{ year: number; title: string; description: string; category: string }>;
  media?: Array<{ // Matches schema's media array structure
    _type: string; // e.g., 'object' for the container object
    title?: string;
    description?: string;
    type?: string; // e.g., 'Image', 'Video', 'Audio', 'Document'
    url?: string;
    asset?: { _ref: string; url?: string; originalFilename?: string; };
    alt?: string; // For image alt text
  }>;
  contributions?: Array<{
    _type: string;
    title?: string;
    content?: string;
    contributorName?: string;
    submittedAt?: string;
    tags?: string[];
  }>;
  // Add other rich fields from your Sanity Person schema (birthYear, deathYear, keyWorks etc.)
  birthYear?: number;
  deathYear?: number;
  keyWorks?: string[];
}

interface AdvisorMemorialProps {
  advisorData: {
    basic: SupabaseAdvisorBasic;
    detailed: SanityPersonRichData | null; // Sanity data, can be null
  };
}

export default function AdvisorMemorial({ advisorData }: AdvisorMemorialProps) {
  const { basic, detailed } = advisorData;
  const [activeTab, setActiveTab] = useState("overview");
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For refreshing contributions

  // --- LOCAL STATE & FUNCTIONS FOR VOICE/CHAT (if previously in this component) ---
  // You would move these from your app/page.tsx or where they were defined.
  // Placeholder definitions for voice functions (implement if voice is needed here)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [chatMessages, setChatMessages] = useState<{ [key: string]: Array<{ role: "user" | "assistant"; content: string; timestamp: Date; audioUrl?: string; isPlaying?: boolean; }> }>({});
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setCurrentMessage(transcript);
          setIsListening(false);
          // showSuccessToast('Speech recognized.'); // Needs toast setup
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          // showErrorToast('Speech recognition error. Please try again.'); // Needs toast setup
        };
        recognitionRef.current.onend = () => setIsListening(false);
      }
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
  }, []);

  const voiceProfiles = { // Example profiles, connect to actual advisor data if needed
    "minerva-haugabrooks": { rate: 0.9, pitch: 1.1, volume: 0.8, voiceName: "female" },
    "james-smith": { rate: 1.0, pitch: 0.9, volume: 0.8, voiceName: "male" },
  };

  const showInfoToast = (message: string) => toast.info(message); // Using sonner toast
  const showSuccessToast = (message: string) => toast.success(message);
  const showErrorToast = (message: string) => toast.error(message);

  const speakText = (text: string, advisorId: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    const profile = voiceProfiles[advisorId as keyof typeof voiceProfiles];
    if (profile) {
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      utterance.volume = profile.volume;
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => voice.name.toLowerCase().includes(profile.voiceName) || voice.lang.includes('en-US'));
      if (preferredVoice) utterance.voice = preferredVoice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); currentUtteranceRef.current = null; };
    utterance.onerror = (event) => { console.error('Speech synthesis error:', event.error); setIsSpeaking(false); currentUtteranceRef.current = null; };
    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };
  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false); currentUtteranceRef.current = null;
  };
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) stopSpeaking();
  };
  const handleSendMessage = (advisorId: string) => {
    if (!currentMessage.trim()) return;
    const newMessage = { role: "user" as const, content: currentMessage, timestamp: new Date() };
    setChatMessages((prev) => ({ ...prev, [advisorId]: [...(prev[advisorId] || []), newMessage] }));
    setCurrentMessage("");
    // Simulate AI response with voice (simplified, connect to actual AI later)
    setTimeout(() => {
      const aiResponseText = `Thank you for your question. As ${advisorData.basic.full_name.split(" ")[0]}, I acknowledge your query: "${currentMessage}". Please allow me a moment to process this.`;
      const aiResponse = { role: "assistant" as const, content: aiResponseText, timestamp: new Date() };
      setChatMessages((prev) => ({ ...prev, [advisorId]: [...(prev[advisorId] || []), aiResponse] }));
      if (voiceEnabled) speakText(aiResponseText, advisorId);
    }, 1500);
  };

  // --- END LOCAL STATE & FUNCTIONS FOR VOICE/CHAT ---


  // --- MOCK DATA FOR DEMONSTRATION (will be replaced by Sanity data) ---
  const mockTimeline = detailed?.timeline || [
    {_key: "1945", year: 1945, title: "Born in Rural Alabama", description: "Born to sharecropper parents in Macon County, Alabama, during the height of the Jim Crow era.", category: "education"},
    {_key: "1967", year: 1967, title: "Graduated from Tuskegee University", description: "Earned Bachelor's degree in Sociology, inspired by the civil rights movement and community organizing.", category: "education"},
    {_key: "1972", year: 1972, title: "PhD in Urban Planning", description: "Completed doctoral studies at MIT, focusing on community-controlled development strategies.", category: "education"},
    {_key: "1975", year: 1975, title: "First Community Development Project", description: "Led the revitalization of the Historic Auburn Avenue district in Atlanta, establishing the first community land trust in Georgia.", category: "career"},
    {_key: "1987", year: 1987, title: "Published Seminal Work", description: "Released 'Participatory Economic Development,' which became the foundational text for community-centered development.", category: "publication"},
    {_key: "1995", year: 1995, title: "Founded Community Development Institute", description: "Established the Institute at Clark Atlanta University to train the next generation of community developers.", category: "achievement"},
    {_key: "2003", year: 2003, title: "MacArthur Fellowship", description: "Received the MacArthur 'Genius Grant' for her innovative approaches to community economic development.", category: "achievement"},
    {_key: "2019", year: 2019, title: "Legacy Continues", description: "Passed away at age 74, leaving behind a network of thriving communities and hundreds of trained practitioners.", category: "legacy"},
  ];

  const mockQuotes = detailed?.quotes || [
    "True development doesn't happen to a community—it happens with a community.",
    "The best solutions are already within the community; our job is to help them emerge.",
    "Economic democracy is not just an ideal—it's a practical necessity for sustainable development.",
    "When communities control their own development, they create wealth that stays and grows.",
  ];

  const mockMedia = detailed?.media || [
    { id: "minerva-1", type: "Image", title: "Community Meeting, 1985", description: "Leading a participatory planning session in Birmingham, Alabama", url: "/placeholder.svg?height=300&width=400&text=Community+Meeting", asset: null },
    { id: "minerva-2", type: "Document", title: "Original Manuscript", description: "Handwritten notes of 1987 book", url: "/placeholder.svg?height=300&width=400&text=Manuscript", asset: null },
    { id: "minerva-3", type: "Video", title: "1995 Lecture", description: "Lecture at Harvard Kennedy School", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", asset: null },
    { id: "minerva-4", type: "Audio", title: "Voice Sample", description: "Audio interview 1998", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", asset: null },
  ];

  const mockContributions = detailed?.contributions || [
    { id: "contrib-1", type: "Memory", title: "Working with Dr. Haugabrooks", content: "She taught me that the best development strategies come from the community itself.", contributorName: "James Washington", submittedAt: "2024-01-15T00:00:00Z" },
    { id: "contrib-2", type: "Quote", title: "On Community Ownership", content: "Dr. Haugabrooks once told our class: 'When a community owns its development process, it owns its future.'", contributorName: "Maria Rodriguez", submittedAt: "2024-01-20T00:00:00Z" },
  ];
  // --- END MOCK DATA ---


  const handleContributionSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
    // Potentially refetch data here if contributions are saved to a live DB
  };

  // Render the component
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/?advisor=${basic.slug}`} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with {basic.full_name.split(" ")[0]}
            </Link>
          </Button>
          <Button className="ml-auto" onClick={() => setShowContributionModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Contribute Memory
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl" />
          <Card className="relative bg-gray-900/50 border-gray-700 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 border-4 border-gray-600">
                    <AvatarImage
                      src={basic.avatar || "/placeholder.svg?height=128&width=128&text=Dr.+Minerva"}
                      alt={basic.full_name}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=No+Image";
                      }}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                      {basic.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{basic.full_name}</h1>
                      <p className="text-xl text-gray-300 mb-2">{basic.role}</p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        AI Memorial Agent
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {basic.is_active ? "Active AI Agent" : "Legacy Archive"}
                    </Badge>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{basic.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {basic.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-800">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-gray-800">
              Quotes
            </TabsTrigger>
            <TabsTrigger value="memories" className="data-[state=active]:bg-gray-800">
              Community Memories
            </TabsTrigger>
            <TabsTrigger value="legacy" className="data-[state=active]:bg-gray-800">
              Legacy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Conditional rendering for detailedBio: PortableText if from Sanity, else basic string */}
                {detailed?.detailedBio ? (
                  <div className="prose prose-invert max-w-none">
                    <PortableText value={detailed.detailedBio} components={portableTextComponents} />
                  </div>
                ) : (
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {basic.detailed_bio.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Life & Career Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {detailed?.timeline && detailed.timeline.length > 0 ? (
                  <div className="space-y-6">
                    {detailed.timeline.map((event) => (
                      <div key={event.year} className="flex items-start gap-4"> {/* Use event.year for key */}
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {event.year}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-white text-lg font-semibold mb-2">{event.title}</h3>
                          <p className="text-gray-300">{event.description}</p>
                          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400 capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback to mock data if no detailed.timeline from Sanity
                  <div className="space-y-6">
                    {mockTimeline.map((event) => (
                      <div key={event._key} className="flex items-start gap-4"> {/* Use _key for mock */}
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {event.year}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-white text-lg font-semibold mb-2">{event.title}</h3>
                          <p className="text-gray-300">{event.description}</p>
                          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400 capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Notable Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detailed?.quotes && detailed.quotes.length > 0 ? (
                  <div className="space-y-6">
                    {detailed.quotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                        <p className="text-gray-300 text-lg italic mb-2">"{quote}"</p>
                        <cite className="text-gray-400">— {basic.full_name}</cite>
                        {/* Voice playback feature - needs local functions (speakText, isSpeaking, Volume2/X) */}
                      </blockquote>
                    ))}
                  </div>
                ) : (
                  // Fallback to mock data if no detailed.quotes from Sanity
                  <div className="space-y-6">
                    {mockQuotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                        <p className="text-gray-300 text-lg italic mb-2">"{quote}"</p>
                        <cite className="text-gray-400">— {basic.full_name}</cite>
                      </blockquote>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Community Memories Tab (Directly rendering richAdvisorData.media for now) */}
          <TabsContent value="memories">
            <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Community Memories</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Use detailed.media for live data, fallback to mockMedia */}
                {(detailed?.media && detailed.media.length > 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailed.media.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>

                        {/* Rendering logic based on item.type (from Sanity schema) */}
                        {item.type === 'Image' && item.asset && ( // Check item.type, not _type
                            <Image
                                src={urlFor(item.asset).width(400).url()} // <-- CORRECTED: Pass item.asset
                                alt={item.alt || item.title || 'Media image'}
                                width={400}
                                height={225}
                                className="rounded-lg"
                            />
                        )}
                        {item.type === 'Document' && item.asset && item.asset.originalFilename && (
                            <a href={item.asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Download: {item.originalFilename}
                            </a>
                        )}
                        {item.type === 'Video' && item.url && ( // For external Video URLs
                            <div className="my-2 aspect-video w-full">
                                <iframe src={item.url} title={item.title} allowFullScreen className="w-full h-full rounded-lg"></iframe>
                            </div>
                        )}
                        {item.type === 'Audio' && item.url && ( // For external Audio URLs
                            <audio controls src={item.url} className="w-full my-2"></audio>
                        )}
                        {item.type === 'Video' && item.asset && item.asset.url && ( // For uploaded video files
                          <video controls src={item.asset.url} className="w-full my-2 rounded-lg"></video>
                        )}
                        {item.type === 'Audio' && item.asset && item.asset.url && ( // For uploaded audio files
                          <audio controls src={item.asset.url} className="w-full my-2"></audio>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback to mock data if no detailed.media from Sanity
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockMedia.map((item, index) => (
                      <div key={item.id} className="p-4 border border-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        {item.type === 'Image' && item.url && ( // Mock data has 'url' for image
                          <Image
                              src={item.url}
                              alt={item.title || 'Media image'}
                              width={400}
                              height={225}
                              className="rounded-lg"
                          />
                        )}
                        {item.type === 'Document' && item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Download: {item.title}
                            </a>
                        )}
                        {item.type === 'Video' && item.url && (
                            <div className="my-2 aspect-video w-full">
                                <iframe src={item.url} title={item.title} allowFullScreen className="w-full h-full rounded-lg"></iframe>
                            </div>
                        )}
                        {item.type === 'Audio' && item.url && (
                            <audio controls src={item.url} className="w-full my-2"></audio>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legacy Tab */}
          <TabsContent value="legacy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Impact & Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Communities Served</h4>
                      <p className="text-gray-300 text-sm">
                        {/* Placeholder text, replace with actual data from Sanity later */}
                        Over 200 community development projects across the American South
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Students Mentored</h4>
                      <p className="text-gray-300 text-sm">
                        {/* Placeholder text, replace with actual data from Sanity later */}
                        Hundreds of students who became community leaders
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Continuing Legacy</h4>
                      <p className="text-gray-300 text-sm">
                        {/* Placeholder text, replace with actual data from Sanity later */}
                        AI agent continues to provide guidance based on decades of experience
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">How to Engage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" asChild>
                      <Link href={`/?advisor=${basic.slug}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with AI Agent
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowContributionModal(true)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Contribute a Memory
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share This Memorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contribution Modal */}
        <ContributionModal
          isOpen={showContributionModal}
          onClose={() => setShowContributionModal(false)}
          advisorName={basic.full_name}
          advisorSlug={basic.slug}
          onContributionSubmitted={handleContributionSubmitted}
        />
      </div>
    </div>
  )
}
