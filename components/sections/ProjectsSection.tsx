"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, TrendingUp, Home, Briefcase, Heart, Wrench, Utensils, Construction, Landmark, GraduationCap, Trophy, Gavel } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProjectsSectionProps {
  index: number;
}

export default function ProjectsSection({ index }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-7xl flex flex-col items-center">
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
          <Dialog open={!!selectedProject} onOpenChange={open => !open && setSelectedProject(null)}>
            <DialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold tracking-widest text-cyan-200 font-mono" style={{ fontFamily: 'Orbitron, monospace' }}>{selectedProject?.title}</DialogTitle>
              </DialogHeader>
              <div>
                <div className="mb-4 text-cyan-100 text-lg font-semibold">{selectedProject?.description || selectedProject?.summary}</div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-cyan-200">
                  <div className="bg-gray-900/80 rounded p-2">Category: {selectedProject?.category}</div>
                  <div className="bg-gray-900/80 rounded p-2">Budget: ${selectedProject?.budget?.toLocaleString()}</div>
                  <div className="bg-gray-900/80 rounded p-2">Participants: {selectedProject?.participants}</div>
                  <div className="bg-gray-900/80 rounded p-2">Staffing Gap: {selectedProject?.personnel_needed}</div>
                  <div className="bg-gray-900/80 rounded p-2 col-span-2">Earning Potential: ${selectedProject?.earning_potential?.toLocaleString()}</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedProject?.tags || []).map((tag: string) => (
                    <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" className="border-cyan-400 text-cyan-200">Support this Project</Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">Purchase Project Format</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
} 