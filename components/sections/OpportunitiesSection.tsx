"use client";

import { useState, useEffect } from 'react';
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

export default function OpportunitiesSection() {
  const [jobType, setJobType] = useState<'public' | 'member'>('public');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [websitePreviewUrl, setWebsitePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/jobs/public')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then(data => setJobs(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(job => job.type === jobType);

  return (
    <section id="workstreams" className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/site-static-media/projectssection/8626284-uhd_3840_2160_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Gradient overlay (existing gradient via Tailwind remains) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-10 pointer-events-none" />
      {/* Content */}
      <div className="relative z-20 w-full flex flex-col items-center">
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
          {loading && <div className="text-cyan-300 font-mono">Loading jobs...</div>}
          {error && <div className="text-red-400 font-mono">{error}</div>}
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
            {selectedJob?.client_name && (
              <div className="mb-2 text-cyan-300 font-mono">Client: {selectedJob.client_name}</div>
            )}
            <div className="mb-2 text-cyan-100 text-lg font-semibold">{selectedJob?.description}</div>
            <div className="mb-4 text-cyan-200">{selectedJob?.details}</div>
            {selectedJob?.website_url && (
              <div className="mb-4">
                <button
                  className="text-cyan-400 underline font-mono hover:text-cyan-200 transition"
                  onClick={() => setWebsitePreviewUrl(selectedJob.website_url)}
                  type="button"
                >
                  Visit Website
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedJob?.tags?.map((tag: string) => (
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
        {/* Website Preview Lightbox */}
        <Dialog open={!!websitePreviewUrl} onOpenChange={open => !open && setWebsitePreviewUrl(null)}>
          <DialogContent className="bg-black border-cyan-400/30 text-white shadow-2xl max-w-3xl flex flex-col items-center">
            <div className="w-full h-[70vh] flex flex-col">
              <iframe
                src={websitePreviewUrl || ''}
                title="Website Preview"
                className="w-full h-full rounded-lg border-2 border-cyan-400"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <button
              className="mt-4 text-cyan-400 underline font-mono hover:text-cyan-200 transition"
              onClick={() => setWebsitePreviewUrl(null)}
              type="button"
            >
              Close Preview
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
} 