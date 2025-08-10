"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function WhatWeDoPage() {
  const missionRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(missionRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Mission
          </button>
          <button
            onClick={() => scrollToSection(approachRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Approach
          </button>
          <button
            onClick={() => scrollToSection(scopeRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Scope
          </button>
          <button
            onClick={() => scrollToSection(valueRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Unique Value
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 py-8 space-y-16">
        {/* Mission Statement */}
        <motion.div
          id="mission"
          ref={missionRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🎯</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mission Statement</h3>
            <p className="text-gray-700 leading-relaxed">
              BEAM exists to advance interdisciplinary innovation at the intersection of arts, 
              technology, education, and social impact. We believe that the most transformative 
              solutions emerge when these domains converge, creating new possibilities for 
              community development and human flourishing.
            </p>
          </div>
        </motion.div>

        {/* Approach */}
        <motion.div
          id="approach"
          ref={approachRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Approach</h3>
            <p className="text-gray-700 leading-relaxed">
              BEAM operates through a unique combination of research, community collaboration, 
              and applied projects. We don't just analyze problems—we actively engage with 
              communities to co-create solutions, bridging the gap between theory and practice 
              through hands-on implementation and iterative learning.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🤝</span>
          </div>
        </motion.div>

        {/* Scope */}
        <motion.div
          id="scope"
          ref={scopeRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🌐</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Scope</h3>
            <p className="text-gray-700 leading-relaxed">
              Our work spans arts integration, tech innovation, historical scholarship, and 
              community economic empowerment. We recognize that these areas are deeply 
              interconnected and that meaningful progress requires addressing them holistically 
              rather than in isolation.
            </p>
          </div>
        </motion.div>

        {/* Unique Value */}
        <motion.div
          id="value"
          ref={valueRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Unique Value</h3>
            <p className="text-gray-700 leading-relaxed">
              What sets BEAM apart is our ability to blend think tank analysis with hands-on 
              project incubation. We don't just publish research—we actively build, test, and 
              scale solutions, creating a feedback loop between theory and practice that 
              continuously improves our understanding and impact.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">💡</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 