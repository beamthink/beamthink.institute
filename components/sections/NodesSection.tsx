"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BookOpen, Users, Network, BarChart2, Archive, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

type Region = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  info: {
    governance: string;
    scholarly: number;
    strategic: number;
    collaborations: number;
    productivity: number;
    pamphlets: number;
    archive: number;
  };
};

const regions: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    lat: 40,
    lng: -100,
    color: '#00fff7',
    info: {
      governance: 'Council of 7, rotating leadership',
      scholarly: 12,
      strategic: 5,
      collaborations: 8,
      productivity: 0.82,
      pamphlets: 3,
      archive: 14,
    },
  },
  {
    id: 'south-america',
    name: 'South America',
    lat: -15,
    lng: -60,
    color: '#f472b6',
    info: {
      governance: 'Community Assembly',
      scholarly: 7,
      strategic: 2,
      collaborations: 4,
      productivity: 0.68,
      pamphlets: 2,
      archive: 8,
    },
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 2,
    lng: 20,
    color: '#6ee7b7',
    info: {
      governance: 'Elders & Youth Council',
      scholarly: 9,
      strategic: 3,
      collaborations: 6,
      productivity: 0.74,
      pamphlets: 4,
      archive: 10,
    },
  },
  {
    id: 'europe',
    name: 'Europe',
    lat: 54,
    lng: 15,
    color: '#818cf8',
    info: {
      governance: 'Rotating Parliament',
      scholarly: 15,
      strategic: 6,
      collaborations: 10,
      productivity: 0.88,
      pamphlets: 5,
      archive: 16,
    },
  },
  {
    id: 'asia',
    name: 'Asia',
    lat: 35,
    lng: 105,
    color: '#facc15',
    info: {
      governance: 'Regional Clusters',
      scholarly: 11,
      strategic: 4,
      collaborations: 7,
      productivity: 0.79,
      pamphlets: 3,
      archive: 12,
    },
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    lat: 30,
    lng: 45,
    color: '#f59e42',
    info: {
      governance: 'Council of Wisdom',
      scholarly: 6,
      strategic: 2,
      collaborations: 3,
      productivity: 0.65,
      pamphlets: 1,
      archive: 6,
    },
  },
  {
    id: 'pacific',
    name: 'Pacific & Australia',
    lat: -25,
    lng: 135,
    color: '#38bdf8',
    info: {
      governance: 'Island Network',
      scholarly: 5,
      strategic: 1,
      collaborations: 2,
      productivity: 0.61,
      pamphlets: 2,
      archive: 5,
    },
  },
];

export default function NodesSection() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);

  return (
    <section id="nodes" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-0 md:px-8 py-24">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch gap-0 md:gap-8">
        {/* Left: Info Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRegion.id}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 bg-gradient-to-br from-cyan-900/80 to-black border-2 border-cyan-400 rounded-3xl shadow-2xl p-8 flex flex-col justify-between min-h-[600px] max-w-xl relative overflow-hidden"
          >
            {/* VFX overlays */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              style={{ background: `radial-gradient(circle at 30% 30%, ${selectedRegion.color} 0%, transparent 70%)` }}
            />
            <motion.h2
              className="text-4xl font-extrabold tracking-widest text-cyan-200 font-mono mb-6 drop-shadow-[0_0_12px_#00fff7]"
              style={{ fontFamily: 'Orbitron, monospace' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedRegion.name} Node
            </motion.h2>
            <div className="flex flex-col gap-6 z-10">
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <Users className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Governance:</span>
                <span className="text-cyan-100">{selectedRegion.info.governance}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <BookOpen className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Scholarly Output:</span>
                <span className="text-cyan-100">{selectedRegion.info.scholarly} papers</span>
                <span className="font-bold text-cyan-200 font-mono ml-4">Strategic:</span>
                <span className="text-cyan-100">{selectedRegion.info.strategic} reports</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <Network className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Cross-Node Collab:</span>
                <span className="text-cyan-100">{selectedRegion.info.collaborations} active</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <BarChart2 className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Productivity:</span>
                <span className="text-cyan-100">{Math.round(selectedRegion.info.productivity * 100)}%</span>
                <div className="w-32 h-2 bg-cyan-800 rounded ml-4 overflow-hidden">
                  <motion.div
                    className="h-2 bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(selectedRegion.info.productivity * 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <FileText className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Digital Pamphlets:</span>
                <span className="text-cyan-100">{selectedRegion.info.pamphlets}</span>
                <Archive className="h-6 w-6 text-cyan-300 ml-4" />
                <span className="font-bold text-cyan-200 font-mono">Archive:</span>
                <span className="text-cyan-100">{selectedRegion.info.archive} items</span>
              </motion.div>
            </div>
            <div className="flex justify-end mt-8 z-10">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">View Node Details</Button>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Right: Interactive Globe */}
        <div className="flex-1 flex items-center justify-center min-h-[600px]">
          <div className="w-full h-[600px]">
            <Globe
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              pointsData={regions as Region[]}
              pointLat={(d) => (d as Region).lat}
              pointLng={(d) => (d as Region).lng}
              pointColor={(d) => (d as Region).color}
              pointAltitude={(d) => (selectedRegion.id === (d as Region).id ? 0.15 : 0.08)}
              pointRadius={(d) => (selectedRegion.id === (d as Region).id ? 1.2 : 0.8)}
              onPointClick={d => setSelectedRegion(d as Region)}
              pointLabel={(d) => (d as Region).name}
              backgroundColor="rgba(0,0,0,0)"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 