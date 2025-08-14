"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import FullScreenMenu from '@/components/FullScreenMenu';

export default function TopNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
            aria-label="Home"
          >
            <div
              className={
                `w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center transition duration-200 ${
                  isMenuOpen ? 'invert' : ''
                }`
              }
            >
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </motion.a>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-6 text-sm">
            <button
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              Think Tank
            </button>
            <button
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              Participants
            </button>
            <a
              href="https://hood.beamthinktank.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              Hood
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
      </motion.header>

      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} initialContext="think" />
    </>
  );
}