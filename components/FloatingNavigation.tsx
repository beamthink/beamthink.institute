"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronUp, MapPin, Users, Building2, Heart, Globe, Calendar, Briefcase, BookOpen, Sparkles, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { id: 'hero', label: 'Home', icon: ChevronUp },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'workstreams', label: 'Workstreams', icon: Users },
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'echoes', label: 'Echoes', icon: Sparkles },
  { id: 'nodes', label: 'Nodes', icon: Network },
  { id: 'pods', label: 'PODs', icon: Building2 },
];

export default function FloatingNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);

      // Update active section based on scroll position
      const sections = navigationItems.map(item => item.id);
      let currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      // If at the bottom of the page, set last section as active
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
        sections.length > 0
      ) {
        currentSection = sections[sections.length - 1];
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-8 z-50"
        >
          <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-full px-4 py-2 flex items-center gap-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-full px-3 py-2 text-xs transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">{item.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 