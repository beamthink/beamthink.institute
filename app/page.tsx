"use client";

import TopNavigation from '@/components/TopNavigation';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { ExternalLink, Info, Search, Filter, X, ChevronRight } from 'lucide-react';
import { ngoSectors, type NGOCard, searchNGOs } from '@/lib/ngo-data';

type SelectedNGO = NGOCard | null;

function NGOCard({ ngo, index, onSelect }: { ngo: NGOCard; index: number; onSelect: (ngo: NGOCard) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (ngo.type === 'video' && ngo.website) {
      window.open(ngo.website, '_blank');
    } else {
      onSelect(ngo);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-6 h-48
          ${ngo.type === 'video' ? 'bg-black' : `bg-gradient-to-br ${ngo.color}`}
          shadow-lg hover:shadow-2xl
          transition-all duration-300 ease-out
          border border-white/10 hover:border-white/20
        `}
        onClick={handleCardClick}
      >
        {/* Video Background for Video Type Cards */}
        {ngo.type === 'video' && ngo.videoUrl && (
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
        )}

        {/* Animated Background Elements */}
        {ngo.type === 'animated' && (
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"
          />
        )}

        {/* Interactive Elements */}
        {ngo.type === 'interactive' && (
          <motion.div
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <div className="text-center">
              <Info className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Tap to Explore</p>
            </div>
          </motion.div>
        )}

        {/* Content - Hidden until hover */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-6xl mb-4">{ngo.icon}</div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
              {ngo.name}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {ngo.description}
            </p>
          </div>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl"
        >
          <div className="text-center p-4">
            <div className="text-8xl mb-6">{ngo.icon}</div>
            <h4 className="text-white font-bold text-lg mb-2">{ngo.name}</h4>
            <p className="text-white/90 text-sm mb-4 max-w-xs mx-auto">
              {ngo.description}
            </p>
            {ngo.type === 'video' && ngo.website ? (
              <div className="px-6 py-3 bg-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-sm">
                Click to Visit Website
              </div>
            ) : (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                  Learn More
                </button>
                <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  Connect
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SectorSection({ title, ngos, sectorIndex, searchQuery }: { 
  title: string; 
  ngos: NGOCard[]; 
  sectorIndex: number;
  searchQuery: string;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filter NGOs based on search query
  const filteredNGOs = useMemo(() => {
    if (!searchQuery) return ngos;
    return ngos.filter(ngo => 
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.focus.some(focus => focus.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [ngos, searchQuery]);

  // Calculate scroll progress for this section
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        
        // Calculate distance from center (0 = center, 1 = far from center)
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter) / (windowHeight / 2);
        const progress = Math.max(0, 1 - distanceFromCenter);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (filteredNGOs.length === 0) return null;

  // Calculate dynamic spacing based on scroll progress
  const baseGap = 24; // 6 * 4 (tailwind gap-6)
  const minGap = 8; // 2 * 4 (tailwind gap-2)
  const dynamicGap = baseGap - (baseGap - minGap) * scrollProgress;

  // Calculate title opacity based on scroll progress and hover
  const titleOpacity = Math.max(0.3, scrollProgress) * (isHovered ? 1 : 0);
  const titleScale = 0.8 + (0.2 * scrollProgress);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: sectorIndex * 0.2 }}
      viewport={{ once: false, amount: 0.1 }}
      className="mb-16"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.h2 
        className="text-3xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: sectorIndex * 0.2 + 0.3 }}
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        {title}
      </motion.h2>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ gap: `${dynamicGap}px` }}
      >
        {filteredNGOs.map((ngo, index) => (
          <NGOCard 
            key={ngo.id} 
            ngo={ngo} 
            index={sectorIndex * 10 + index}
            onSelect={() => {}}
          />
        ))}
      </div>
    </motion.section>
  );
}

function SearchAndFilter({ searchQuery, setSearchQuery, selectedSector, setSelectedSector, isVisible }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  isVisible: boolean;
}) {
  const sectors = Object.keys(ngoSectors);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleSearchClick = () => {
    setIsExpanded(true);
    setIsFocused(true);
  };

  const handleSearchBlur = () => {
    // Small delay to allow for button clicks
    setTimeout(() => {
      setIsExpanded(false);
      setIsFocused(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExpanded(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setIsFocused(false);
      setSearchQuery('');
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
        scale: isVisible ? 1 : 0.95
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`fixed top-24 z-30 transition-all duration-300 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      } ${
        isExpanded 
          ? 'left-1/2 transform -translate-x-1/2' 
          : 'right-8'
      }`}
    >
      <div className={`bg-black/80 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl transition-all duration-300 ${
        isExpanded ? 'w-[600px]' : 'w-auto'
      }`}>
        {!isExpanded ? (
          // Collapsed state - icons and buttons
          <div className="flex items-center gap-3 p-3">
            {/* User Login Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.button>

            {/* Select Button */}
            <motion.button
              onClick={toggleSelectionMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSelectionMode 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {isSelectionMode ? 'Done' : 'Select'}
            </motion.button>

            {/* Search Icon */}
            <motion.button
              onClick={handleSearchClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700/50"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>
        ) : (
          // Expanded state - full search and filter
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search NGOs by name, description, or focus areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Sector Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90 pointer-events-none" />
              </div>

              {/* Action Buttons Row */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setIsFocused(false);
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Select Button in Expanded Mode */}
              <div className="pt-2 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={toggleSelectionMode}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSelectionMode 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  {isSelectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function HomeGridPage() {
  const [selectedNGO, setSelectedNGO] = useState<SelectedNGO>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.3 });
  const y = useSpring(my, { stiffness: 80, damping: 20, mass: 0.3 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth - 0.5) * 15;
    const ny = (e.clientY / innerHeight - 0.5) * 15;
    mx.set(nx);
    my.set(ny);
  }, [mx, my]);

  // Enhanced scroll tracking for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-triggered search visibility (like iPhone Photos app)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateSearchVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // Show search when scrolling down, hide when at top
      if (currentScrollY > 100) {
        setIsSearchVisible(true);
      } else {
        setIsSearchVisible(false);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateSearchVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sectors based on search and selection
  const filteredSectors = useMemo(() => {
    if (selectedSector) {
      return { [selectedSector]: ngoSectors[selectedSector as keyof typeof ngoSectors] };
    }
    return ngoSectors;
  }, [selectedSector]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" onMouseMove={handleMouseMove}>
      <TopNavigation />

      {/* Search and Filter - Scroll Triggered */}
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        isVisible={isSearchVisible}
      />

      {/* NGO Grid by Sectors */}
      <div className="relative z-10 pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {Object.entries(filteredSectors).map(([sectorName, ngos], sectorIndex) => (
            <SectorSection
              key={sectorName}
              title={sectorName}
              ngos={ngos}
              sectorIndex={sectorIndex}
              searchQuery={searchQuery}
            />
          ))}
          
          {/* No Results Message */}
          {Object.keys(filteredSectors).length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No NGOs Found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Background Animation with Parallax */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ 
          x: x.get() + (scrollY * 0.1), // Enhanced parallax effect
          y: y.get() + (scrollY * 0.05)  // Subtle vertical parallax
        }}
      >
        {/* Primary background elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.2}px)` // Slower parallax for depth
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.15}px)` // Medium parallax
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.1}px)` // Faster parallax for foreground
          }}
        />
        
        {/* Additional floating elements for richer parallax */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-pink-500/8 to-rose-500/8 rounded-full blur-2xl"
          style={{
            transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * 0.05}px)`
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-gradient-to-r from-yellow-500/8 to-orange-500/8 rounded-full blur-2xl"
          style={{
            transform: `translateY(${scrollY * 0.18}px) translateX(${scrollY * -0.03}px)`
          }}
        />
      </motion.div>

      {/* NGO Detail Modal */}
      <AnimatePresence>
        {selectedNGO && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNGO(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-8xl mb-6">{selectedNGO.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedNGO.name}</h2>
                <p className="text-gray-300 text-lg mb-6">{selectedNGO.description}</p>
                
                {/* Focus Areas */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedNGO.focus.map((area) => (
                      <span key={area} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact Metrics */}
                {selectedNGO.impact && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Impact</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-gray-300">
                        <div className="font-semibold text-orange-500">{selectedNGO.impact.projects}</div>
                        <div>Projects</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="font-semibold text-orange-500">{selectedNGO.impact.communities}</div>
                        <div>Communities</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="font-semibold text-orange-500">{selectedNGO.impact.volunteers}</div>
                        <div>Volunteers</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="font-semibold text-orange-500">{selectedNGO.impact.funding}</div>
                        <div>Funding</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedNGO.status === 'Active Partner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    selectedNGO.status === 'Strategic Partner' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {selectedNGO.status}
                  </span>
                </div>

                <div className="flex gap-4 justify-center">
                  {selectedNGO.website && (
                    <a
                      href={selectedNGO.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {selectedNGO.readyaimgoLink && (
                    <a
                      href={selectedNGO.readyaimgoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      View on ReadyAimGo
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedNGO(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}