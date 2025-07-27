"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '@/components/sections/Hero';
import ProjectsSection from '@/components/sections/ProjectsSection';
import PodMap from '@/components/sections/PodMap';
import OpportunitiesSection from '@/components/sections/OpportunitiesSection';
import WikiSection from '@/components/sections/WikiSection';
import EchoesSection from '@/components/sections/EchoesSection';
import FloatingNavigation from '@/components/FloatingNavigation';
import TopNavigation from '@/components/TopNavigation';
import NodesSection from '@/components/sections/NodesSection';

const sections = [
  { id: 'hero', component: Hero },
  { id: 'projects', component: ProjectsSection },
  { id: 'workstreams', component: OpportunitiesSection },
  { id: 'wiki', component: WikiSection },
  { id: 'echoes', component: EchoesSection },
  { id: 'nodes', component: NodesSection },
  { id: 'pods', component: PodMap },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Parallax background */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 opacity-50"
        style={{ y }}
      />
      
      {/* Content sections */}
      <div className="relative z-10 pt-20">
        {sections.map(({ id, component: Component }, index) => (
          <section key={id} id={id} className="min-h-screen">
            <Component index={index} />
          </section>
        ))}
      </div>

      {/* Floating Navigation */}
      <FloatingNavigation />
    </div>
  );
}