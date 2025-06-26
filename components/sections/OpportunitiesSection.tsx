"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Truck, Calendar, Code, Users, ClipboardList, Sparkles } from 'lucide-react';

const jobCategories = [
  { id: 'webdev', label: 'Web Dev', icon: Code },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'admin', label: 'Admin', icon: ClipboardList },
  { id: 'branding', label: 'Branding', icon: Sparkles },
  { id: 'staffing', label: 'Staffing', icon: Users },
];

const dummyJobs = [
  {
    id: 'job1',
    title: 'React Web Developer',
    description: 'Build a landing page for a new product launch.',
    category: 'webdev',
    tags: ['React', 'Next.js', 'UI/UX'],
    pay: '$800',
    deadline: '2024-07-10',
    type: 'public',
    details: 'Full project spec available. Must deliver responsive, animated UI. Collaboration with branding team required.'
  },
  {
    id: 'job2',
    title: 'Event Setup Crew',
    description: 'Assist with setup and breakdown for a live event.',
    category: 'events',
    tags: ['Logistics', 'Physical', 'Teamwork'],
    pay: '$150',
    deadline: '2024-07-05',
    type: 'member',
    details: 'Arrive 2 hours before event. Must be able to lift 30 lbs. Black attire required.'
  },
  {
    id: 'job3',
    title: 'Branding Assistant',
    description: 'Support the creative team with asset organization.',
    category: 'branding',
    tags: ['Branding', 'Organization', 'Photoshop'],
    pay: '$300',
    deadline: '2024-07-12',
    type: 'public',
    details: 'Organize digital assets, assist with social media graphics, and prep files for web.'
  },
  {
    id: 'job4',
    title: 'Admin Support',
    description: 'Remote admin support for a logistics company.',
    category: 'admin',
    tags: ['Admin', 'Remote', 'Scheduling'],
    pay: '$400',
    deadline: '2024-07-15',
    type: 'member',
    details: 'Manage schedules, answer emails, and update spreadsheets. Flexible hours.'
  },
];

export default function OpportunitiesSection() {
  const [jobType, setJobType] = useState<'public' | 'member'>('public');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredJobs = dummyJobs.filter(job => job.type === jobType);

  return (
    <section id="workstreams" className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-cyan-200 font-mono mb-8 drop-shadow-[0_0_8px_#0ff]" style={{ fontFamily: 'Orbitron, monospace' }}>
        Workstreams: Real Jobs, Real Time
      </h2>
      <div className="mb-8 flex gap-4 items-center">
        <Tabs value={jobType} onValueChange={(v) => setJobType((v as 'public' | 'member') || 'public')}>
          <TabsList>
            <TabsTrigger value="public" className={jobType === 'public' ? 'bg-cyan-600 text-white' : ''}>Public Jobs</TabsTrigger>
            <TabsTrigger value="member" className={jobType === 'member' ? 'bg-cyan-600 text-white' : ''}>Member Jobs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {jobCategories.map(cat => (
          <div key={cat.id} className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-800 shadow-lg mb-2 border-2 border-cyan-400">
              <cat.icon className="h-8 w-8 text-cyan-100 drop-shadow-[0_0_8px_#0ff]" />
            </div>
            <span className="text-cyan-200 font-bold tracking-wide text-lg font-mono" style={{ fontFamily: 'Orbitron, monospace' }}>{cat.label}</span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px #00fff7' }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-gray-900/80 border border-cyan-400 rounded-2xl p-6 shadow-xl cursor-pointer hover:ring-4 hover:ring-cyan-400/60 transition-all"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-cyan-300 text-lg font-mono" style={{ fontFamily: 'Orbitron, monospace' }}>{job.title}</span>
                <Badge className="ml-auto bg-cyan-700 text-white font-mono">{job.pay}</Badge>
              </div>
              <div className="text-gray-200 mb-2">{job.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.tags.map((tag: string) => (
                  <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
                ))}
              </div>
              <div className="text-xs text-cyan-400 font-mono">Deadline: {job.deadline}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Dialog open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)}>
        <DialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-widest text-cyan-200 font-mono" style={{ fontFamily: 'Orbitron, monospace' }}>{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-cyan-100 text-lg font-semibold">{selectedJob?.description}</div>
          <div className="mb-4 text-cyan-200">{selectedJob?.details}</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedJob?.tags.map((tag: string) => (
              <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            <Badge className="bg-cyan-700 text-white font-mono">{selectedJob?.pay}</Badge>
            <span className="text-xs text-cyan-400 font-mono">Deadline: {selectedJob?.deadline}</span>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="border-cyan-400 text-cyan-200">Apply</Button>
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">Refer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
} 