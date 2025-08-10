"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function CapstoneProjectsPage() {
  const definitionRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const structureRef = useRef<HTMLDivElement>(null);
  const legacyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(definitionRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Definition
          </button>
          <button
            onClick={() => scrollToSection(examplesRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Examples
          </button>
          <button
            onClick={() => scrollToSection(structureRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Structure
          </button>
          <button
            onClick={() => scrollToSection(legacyRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Legacy
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 py-8 space-y-16">
        {/* Definition */}
        <motion.div
          id="definition"
          ref={definitionRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🎯</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Definition</h3>
            <p className="text-gray-700 leading-relaxed">
              Capstone projects are flagship, outcome-driven initiatives that demonstrate BEAM's 
              mission in action. These projects represent the culmination of our interdisciplinary 
              approach, bringing together research, community engagement, and practical implementation 
              to create measurable impact and lasting change.
            </p>
          </div>
        </motion.div>

        {/* Examples */}
        <motion.div
          id="examples"
          ref={examplesRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Performance Series</h4>
                <p className="text-gray-700 text-sm">
                  Reinterpreting classical music through decolonial research and contemporary performance.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Blockchain Systems</h4>
                <p className="text-gray-700 text-sm">
                  Community credit systems built on blockchain technology for economic empowerment.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Documentary Productions</h4>
                <p className="text-gray-700 text-sm">
                  Cultural history documentaries that preserve and share community narratives.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        </motion.div>

        {/* Structure */}
        <motion.div
          id="structure"
          ref={structureRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🏗️</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Structure</h3>
            <p className="text-gray-700 leading-relaxed">
              Our capstone projects are typically cross-disciplinary, involving research, public 
              engagement, and measurable outcomes. Each project follows a structured methodology 
              that includes community consultation, iterative development, public presentation, 
              and impact assessment to ensure both quality and relevance.
            </p>
          </div>
        </motion.div>

        {/* Legacy */}
        <motion.div
          id="legacy"
          ref={legacyRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Legacy</h3>
            <p className="text-gray-700 leading-relaxed">
              These projects create lasting impact that influences long-term policy, culture, or 
              economic development. Through their success, they establish new models, inform 
              future initiatives, and demonstrate the power of interdisciplinary collaboration 
              in addressing complex community challenges.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🌱</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 