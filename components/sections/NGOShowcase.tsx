"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { NGOCard, ngoSectors } from '@/lib/ngo-data';

interface NGOShowcaseProps {
  index: number;
}

// Video-based NGO Card Component
function VideoNGOCard({ ngo, index }: { ngo: NGOCard; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (ngo.website) {
      window.open(ngo.website, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer h-80 rounded-2xl overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        preload="metadata"
      >
        <source src={ngo.videoUrl} type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 flex flex-col justify-between p-6">
        {/* Top Section - Icon and Title */}
        <div className="text-center">
          <div className="text-6xl mb-4">{ngo.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{ngo.name}</h3>
          <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
            {ngo.description}
          </p>
        </div>

        {/* Bottom Section - Focus Areas */}
        <div className="text-center">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {ngo.focus.slice(0, 3).map((area) => (
              <span key={area} className="px-3 py-1 bg-white/20 text-white rounded-full text-xs backdrop-blur-sm">
                {area}
              </span>
            ))}
          </div>
          
          {/* Impact Metrics */}
          {ngo.impact && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-white/90">
                <div className="font-semibold text-orange-400">{ngo.impact.projects}</div>
                <div className="text-xs">Projects</div>
              </div>
              <div className="text-white/90">
                <div className="font-semibold text-orange-400">{ngo.impact.communities}</div>
                <div className="text-xs">Communities</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl"
        transition={{ duration: 0.2 }}
      >
        <div className="text-center p-4">
          <div className="text-8xl mb-6">{ngo.icon}</div>
          <h4 className="text-white font-bold text-2xl mb-4">{ngo.name}</h4>
          <p className="text-white/90 text-sm mb-6 max-w-xs mx-auto">
            {ngo.description}
          </p>
          <div className="px-6 py-3 bg-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-sm">
            Click to Visit Website
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NGOShowcase({ index }: NGOShowcaseProps) {
  // Get all NGOs from the data
  const allNGOs = Object.values(ngoSectors).flat();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Partner Organizations</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We collaborate with leading NGOs and organizations worldwide to create 
            sustainable impact and drive positive change in communities.
          </p>
        </motion.div>

        {/* NGO Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {allNGOs.map((ngo, ngoIndex) => (
            <VideoNGOCard 
              key={ngo.id} 
              ngo={ngo} 
              index={ngoIndex}
            />
          ))}
        </div>

        {/* Partnership Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">240</div>
            <div className="text-gray-300">Active Projects</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">168</div>
            <div className="text-gray-300">Communities Served</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">6,980</div>
            <div className="text-gray-300">Total Volunteers</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">$17.7M</div>
            <div className="text-gray-300">Total Funding</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 