"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, TrendingUp, Home, Briefcase, Heart, Wrench, Utensils, Construction, Landmark, GraduationCap, Trophy, Gavel, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAllWikiPages } from '@/lib/sanity.queries';

interface ProjectsSectionProps {
  index: number;
}

export default function ProjectsSection({ index }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wikiPages, setWikiPages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(false);
  const [openPublication, setOpenPublication] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load projects.');
          setProjects([]);
        } else {
          setProjects(data || []);
        }
        setLoading(false);
      });
  }, []);

  // Get unique categories from projects
  const allCategories = Array.from(new Set(projects.map((p: any) => p.category).filter(Boolean)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredProjects = selectedCategory ? projects.filter(p => p.category === selectedCategory) : projects;

  // Fetch wiki pages once for tag matching
  useEffect(() => {
    getAllWikiPages().then(setWikiPages);
  }, []);

  // Fetch participants for the selected project
  useEffect(() => {
    if (!selectedProject) return;
    // Fetch by pod_id only
    supabase
      .from('participants')
      .select('*')
      .eq('pod_id', selectedProject.pod_id)
      .then(({ data }) => setParticipants(data || []));
  }, [selectedProject]);

  // Fetch media for the selected project
  useEffect(() => {
    if (!selectedProject) return;
    setMediaLoading(true);
    fetch(`/api/projects/${selectedProject.id}/media`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setMedia(Array.isArray(data) ? data : data ? [data] : []);
        setMediaLoading(false);
      })
      .catch(() => {
        setMedia([]);
        setMediaLoading(false);
      });
  }, [selectedProject]);

  // Fetch publications for the selected project
  useEffect(() => {
    if (!selectedProject) return;
    setPublicationsLoading(true);
    fetch(`/api/projects/${selectedProject.id}/publications`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPublications(Array.isArray(data) ? data : data ? [data] : []);
        setPublicationsLoading(false);
      })
      .catch(() => {
        setPublications([]);
        setPublicationsLoading(false);
      });
  }, [selectedProject]);

  // Helper: Find related wiki pages by tag match
  function getRelatedWikiPages(project: any) {
    if (!project?.tags || !wikiPages.length) return [];
    return wikiPages.filter(wp => wp.tags && wp.tags.some((tag: string) => project.tags.includes(tag)));
  }

  // Helper: Render media by type
  function renderMediaItem(item: any) {
    const url = item.file_url;
    const ext = url?.split('.').pop()?.toLowerCase();
    if (!url) return null;
    if (ext === 'mp4') {
      return <video controls className="w-full max-h-64 rounded-lg" src={url} />;
    }
    if (ext === 'mp3') {
      return <audio controls className="w-full" src={url} />;
    }
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt={item.title || 'media'} className="w-full max-h-64 object-contain rounded-lg border border-cyan-800" />
        </a>
      );
    }
    if (ext === 'pdf') {
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Download PDF</a>;
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Download File</a>;
  }

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const getHexPosition = (index: number) => {
    const itemsPerRow = 3;
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const xOffset = row % 2 === 0 ? 0 : 95;
    return {
      x: col * 190 + xOffset,
      y: row * 165
    };
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          style={{ zIndex: 0 }}
        >
          <source src="https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/site-static-media/projectssection/7661317-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80" style={{ zIndex: 1 }} />
        {/* Content */}
        <div className="container mx-auto max-w-7xl flex flex-col items-center relative" style={{ zIndex: 2 }}>
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge
              className={`cursor-pointer px-4 py-2 text-cyan-200 border border-cyan-400 bg-black/60 hover:bg-cyan-800/40 transition-all ${!selectedCategory ? 'ring-2 ring-cyan-400' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {allCategories.map(category => (
              <Badge
                key={category}
                className={`cursor-pointer px-4 py-2 text-cyan-200 border border-cyan-400 bg-black/60 hover:bg-cyan-800/40 transition-all ${selectedCategory === category ? 'ring-2 ring-cyan-400' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          {loading && <div className="text-cyan-400 text-lg my-12 animate-pulse">Loading projects...</div>}
          {error && <div className="text-red-400 text-lg my-12">{error}</div>}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="text-cyan-400 text-lg my-12">No projects found.</div>
          )}
          <div className="relative" style={{ width: '700px', height: '800px' }}>
            <AnimatePresence>
              {filteredProjects.map((project, projectIndex) => {
                const pos = getHexPosition(projectIndex);
                const isHovered = hoveredIndex === projectIndex;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.5, x: pos.x, y: pos.y }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + projectIndex * 0.1 }}
                    className="absolute cursor-pointer group"
                    onClick={() => handleProjectClick(project)}
                    onMouseEnter={() => setHoveredIndex(projectIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ zIndex: isHovered ? 10 : 1 }}
                  >
                    <div
                      className={`relative w-48 h-56 flex items-center justify-center transition-all duration-300 shadow-2xl
                        ${isHovered ? 'scale-105 ring-4 ring-cyan-400/80 animate-pulse' : ''}
                      `}
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        boxShadow: isHovered
                          ? '0 0 32px 8px #00fff7, 0 0 64px 16px #0ff, 0 0 8px 2px #fff'
                          : '0 0 16px 2px #222',
                        background: isHovered
                          ? 'radial-gradient(circle at 50% 40%, #0ff 0%, #222 100%)'
                          : 'radial-gradient(circle at 50% 40%, #222 0%, #111 100%)',
                      }}
                    >
                      {/* Glow border */}
                      <div className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300
                        ${isHovered ? 'shadow-[0_0_40px_10px_#00fff7,0_0_80px_20px_#0ff]' : ''}
                      `} />
                      {/* Icon or image */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="h-16 w-16 object-cover rounded-xl mb-2 border-2 border-cyan-400 shadow" />
                        ) : (
                          <Briefcase className="h-16 w-16 text-cyan-300 drop-shadow-[0_0_8px_#0ff]" />
                        )}
                        <h3 className="text-xl font-bold text-center text-cyan-200 font-mono drop-shadow-[0_0_8px_#0ff]">{project.title}</h3>
                        <span className="text-xs text-cyan-400 mt-1">{project.category}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <UIDialog open={!!selectedProject} onOpenChange={open => !open && setSelectedProject(null)}>
            <UIDialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-3xl">
              <UIDialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <UIDialogTitle className="text-3xl font-extrabold tracking-widest text-cyan-200 font-mono flex-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {selectedProject?.title}
                  </UIDialogTitle>
                  <Badge className="bg-cyan-700 text-white font-mono">v{selectedProject?.version || 1}</Badge>
                  <Button variant="outline" className="border-cyan-400 text-cyan-200">Support</Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">Buy Format</Button>
                </div>
              </UIDialogHeader>
              <div className="mb-4 text-cyan-100 text-lg font-semibold">
                {selectedProject?.summary || selectedProject?.description}
              </div>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="publications">Publications</TabsTrigger>
                  <TabsTrigger value="wiki">Wiki Links</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-cyan-200">
                    <div className="bg-gray-900/80 rounded p-2">Category: {selectedProject?.category}</div>
                    <div className="bg-gray-900/80 rounded p-2">Budget: ${selectedProject?.budget?.toLocaleString()}</div>
                    <div className="bg-gray-900/80 rounded p-2">Staffing Gap: {selectedProject?.personnel_needed}</div>
                    <div className="bg-gray-900/80 rounded p-2">Earning Potential: ${selectedProject?.earning_potential?.toLocaleString()}</div>
                  </div>
                </TabsContent>
                <TabsContent value="participants">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participants.length === 0 && <div className="text-cyan-400">No participants found.</div>}
                    {participants.map((person: any) => (
                      <Card key={person.id} className="flex items-center gap-4 p-4 bg-gray-900/80 border-cyan-800">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={person.avatar || '/placeholder-user.jpg'} alt={person.name} />
                          <AvatarFallback>{person.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-cyan-200 text-lg">{person.name}</div>
                          <div className="text-cyan-400 text-sm">{person.role}</div>
                          {/* Link to profile if available */}
                          {person.id && <a href={`/participants/${person.id}`} className="text-cyan-300 underline text-xs">View Profile</a>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="assets">
                  {mediaLoading && <div className="text-cyan-400">Loading assets...</div>}
                  {!mediaLoading && media.length === 0 && <div className="text-cyan-400">No assets found for this project.</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {media.map((item: any) => (
                      <Card key={item.id || item.file_url} className="bg-gray-900/80 border-cyan-800 p-4 flex flex-col gap-2">
                        <div>{renderMediaItem(item)}</div>
                        <div className="font-bold text-cyan-200 text-lg">{item.title}</div>
                        <div className="text-cyan-400 text-sm mb-2">{item.description}</div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="publications">
                  {publicationsLoading && <div className="text-cyan-400">Loading publications...</div>}
                  {!publicationsLoading && publications.length === 0 && <div className="text-cyan-400">No publications yet – contribute?</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publications.map((pub: any) => (
                      <Card key={pub.id} className="bg-gray-900/80 border-cyan-800 p-4 flex flex-col gap-2 cursor-pointer" onClick={() => setOpenPublication(pub)}>
                        <div className="font-bold text-cyan-200 text-lg">{pub.title}</div>
                        <div className="inline-block px-2 py-1 bg-cyan-700 text-white text-xs rounded font-mono mb-1">{pub.publication_type}</div>
                        <div className="text-cyan-400 text-xs truncate" title={pub.authors}>{(pub.authors || '').length > 40 ? pub.authors.slice(0, 40) + '…' : pub.authors}</div>
                      </Card>
                    ))}
                  </div>
                  <UIDialog open={!!openPublication} onOpenChange={open => !open && setOpenPublication(null)}>
                    <UIDialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-lg">
                      <UIDialogHeader>
                        <UIDialogTitle className="text-2xl font-extrabold tracking-widest text-cyan-200 font-mono flex items-center gap-2">{openPublication?.title}</UIDialogTitle>
                      </UIDialogHeader>
                      <div className="mb-2 text-cyan-400 text-xs">{openPublication?.publication_type}</div>
                      <div className="mb-2 text-cyan-300 text-xs">Authors: {openPublication?.authors}</div>
                      <div className="mb-4 text-cyan-100 text-sm">{openPublication?.abstract}</div>
                      <div className="mb-2 text-cyan-200 text-xs">Citation: {openPublication?.citation}</div>
                      {openPublication?.file_url && (
                        <a href={openPublication.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Download/View</a>
                      )}
                    </UIDialogContent>
                  </UIDialog>
                </TabsContent>
                <TabsContent value="wiki">
                  <div className="flex flex-col gap-2">
                    {getRelatedWikiPages(selectedProject).length === 0 && <div className="text-cyan-400">No related wiki pages found.</div>}
                    {getRelatedWikiPages(selectedProject).map((wp: any) => (
                      <a key={wp._id || wp.id} href={`#wiki`} className="text-cyan-300 underline text-lg font-mono flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-cyan-400" />
                        {wp.title}
                      </a>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </UIDialogContent>
          </UIDialog>
        </div>
      </div>
    </TooltipProvider>
  );
} 