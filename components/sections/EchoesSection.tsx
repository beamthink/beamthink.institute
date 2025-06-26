"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, BookOpen, Sparkles, MessageCircle, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

const agents = [
  {
    id: 'james',
    name: 'James D Smith',
    description: 'A visionary educator and community builder whose wisdom continues to guide BEAM participants.',
    video: 'https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/ai-advisor-memorial/videos/ScreenRecording_06-25-2025%2019-41-13_1.MP4', // placeholder
    sponsor: { name: 'Ecolab', logo: 'https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/ai-advisor-memorial/pictures/ecolab.png', url: '#' },
    specialities: ['education', 'entrepreneurship'],
  },
  {
    id: 'meh',
    name: 'Minerva Haugabrooks',
    description: 'The AI Memorial of Dr. Minerva Haugabrooks.',
    video: 'https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/ai-advisor-memorial/videos/ScreenRecording_06-25-2025%2019-34-51_1.mp4', // placeholder
    sponsor: { name: 'Lake Sumpter Community College', logo: 'https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/ai-advisor-memorial/pictures/lakesumtercommunitycollege.png', url: '#' },
    specialities: ['healing', 'justice'],
  },
];

const mentorSuggestions = {
  james: [
    {
      icon: '🎓',
      title: 'Teach Your Community',
      desc: "Based on your interests and James' background, explore community teaching through BEAM.",
      link: '#',
      type: 'wiki',
    },
    {
      icon: '🏛️',
      title: 'Start a Learning POD',
      desc: "James' experience as an educator can guide you in forming a local POD.",
      link: '#',
      type: 'project',
    },
    {
      icon: '📚',
      title: 'Join Workstream: Tutor',
      desc: "Here's a paid workstream related to your interests.",
      link: '#',
      type: 'workstream',
    },
  ],
  drg: [
    {
      icon: '🧘',
      title: 'Healing Circles',
      desc: "Dr. G's legacy of restorative justice can help you start a healing circle.",
      link: '#',
      type: 'wiki',
    },
    {
      icon: '⚖️',
      title: 'Justice Project',
      desc: "Get involved in a justice-focused BEAM project inspired by Dr. G.",
      link: '#',
      type: 'project',
    },
    {
      icon: '💬',
      title: 'Peer Support Workstream',
      desc: "Join a workstream for peer support and restorative practice.",
      link: '#',
      type: 'workstream',
    },
  ],
};

export default function EchoesSection() {
  const [openAgent, setOpenAgent] = useState<typeof agents[0] | null>(null);
  const [mentorMode, setMentorMode] = useState(false);
  const [mentorLoading, setMentorLoading] = useState(false);

  const handleMentorMode = () => {
    setMentorMode(true);
    setMentorLoading(true);
    setTimeout(() => setMentorLoading(false), 1500);
  };

  const closeMentorMode = () => {
    setMentorMode(false);
    setMentorLoading(false);
  };

  const suggestions = openAgent ? mentorSuggestions[openAgent.id as 'james' | 'drg'] : [];

  return (
    <section id="echoes" className="py-24 px-4 min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold tracking-widest text-emerald-200 font-mono mb-2 drop-shadow-[0_0_12px_#6ee7b7]"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        Echoes
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-emerald-300 text-lg mb-8 text-center max-w-2xl"
      >
        Explore the wisdom, spirit, and guidance of those who came before us. Engage with AI memorial agents built from the lives, works, and voices of elders, educators, visionaries, and loved ones.
      </motion.p>
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 32px #6ee7b7' }}
            className="relative bg-gradient-to-br from-emerald-900/60 to-black border-2 border-emerald-400 rounded-3xl p-8 flex flex-col items-center cursor-pointer shadow-2xl hover:ring-4 hover:ring-emerald-400/60 transition-all group"
            onClick={() => setOpenAgent(agent)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-emerald-300 shadow-lg bg-black flex items-center justify-center">
              {/* Placeholder looping video or animation */}
              <video src={agent.video} autoPlay loop muted className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-emerald-200 font-mono drop-shadow-[0_0_8px_#6ee7b7]">{agent.name}</span>
            <span className="mt-2 text-emerald-100 text-center text-base">{agent.description}</span>
            <span className="absolute top-4 right-4 bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-mono shadow">Memorial Agent</span>
          </motion.div>
        ))}
      </div>
      <Dialog open={!!openAgent} onOpenChange={open => !open && setOpenAgent(null)}>
        <DialogContent className="bg-gray-950 border-emerald-400/30 text-white shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-widest text-emerald-200 font-mono flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              <User className="h-7 w-7 text-emerald-300" />
              {openAgent?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-emerald-400 shadow-lg bg-black flex items-center justify-center mb-4">
                <video src={openAgent?.video} autoPlay loop muted className="w-full h-full object-cover" />
              </div>
              <div className="text-emerald-100 text-center mb-2">{openAgent?.description}</div>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-xs text-emerald-400 font-mono">Sponsored by:</span>
                <a href={openAgent?.sponsor.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <img src={openAgent?.sponsor.logo} alt={openAgent?.sponsor.name} className="h-6 w-6 rounded-full border border-emerald-300" />
                  <span className="text-emerald-200 text-xs font-mono underline">{openAgent?.sponsor.name}</span>
                </a>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-emerald-900/60 rounded-xl p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                  <span className="text-emerald-200 font-bold font-mono">Chat with {openAgent?.name}</span>
                </div>
                <div className="bg-black/60 rounded p-2 text-emerald-100 text-sm italic">(AI chat coming soon...)</div>
              </div>
              <div className="bg-emerald-900/60 rounded-xl p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-emerald-300" />
                  <span className="text-emerald-200 font-bold font-mono">Document Explorer</span>
                </div>
                <Link
                  href={
                    openAgent?.id === 'james'
                      ? '/advisors/james-smith'
                      : openAgent?.id === 'meh'
                        ? '/advisors/minerva-haugabrooks'
                        : '#'
                  }
                  passHref
                >
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold w-full mt-2">
                    {openAgent ? `View ${openAgent.name}’s Advisor Portal` : 'View Advisor Portal'}
                  </Button>
                </Link>
                <div className="text-emerald-200 text-xs mt-1 text-center">You’ll be redirected to a dedicated portal for this advisor, with all their resources, chat, and more.</div>
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold mt-2" onClick={handleMentorMode}>
                Mentor Mode: Guide Me
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Mentor Mode Fullscreen Modal */}
      <AnimatePresence>
        {mentorMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
          >
            <div className="w-full max-w-3xl mx-auto p-8 flex flex-col items-center">
              {mentorLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center h-96"
                >
                  <Loader2 className="h-16 w-16 text-emerald-400 animate-spin mb-6" />
                  <div className="text-2xl text-emerald-200 font-mono animate-pulse">Calibrating Guidance…</div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="w-full"
                >
                  <div className="text-3xl font-extrabold text-emerald-200 font-mono mb-8 text-center" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {openAgent?.name} recommends…
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.15 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 32px #6ee7b7' }}
                        className="bg-gradient-to-br from-emerald-900/80 to-black border-2 border-emerald-400 rounded-2xl p-6 flex flex-col items-center cursor-pointer shadow-xl hover:ring-4 hover:ring-emerald-400/60 transition-all"
                        onClick={closeMentorMode}
                      >
                        <div className="text-4xl mb-2">{s.icon}</div>
                        <div className="text-xl font-bold text-emerald-200 font-mono mb-2 text-center">{s.title}</div>
                        <div className="text-emerald-100 text-center mb-2">{s.desc}</div>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold mt-2">Explore</Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button variant="outline" className="border-emerald-400 text-emerald-200" onClick={closeMentorMode}>Close</Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 