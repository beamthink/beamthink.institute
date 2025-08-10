"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function EducationPipelinePage() {
  const entryRef = useRef<HTMLDivElement>(null);
  const progressionRef = useRef<HTMLDivElement>(null);
  const partnershipsRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(entryRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Entry Points
          </button>
          <button
            onClick={() => scrollToSection(progressionRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Progression
          </button>
          <button
            onClick={() => scrollToSection(partnershipsRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Partnerships
          </button>
          <button
            onClick={() => scrollToSection(focusRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Special Focus
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 py-8 space-y-16">
        {/* Entry Points */}
        <motion.div
          id="entry"
          ref={entryRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🚪</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Entry Points</h3>
            <p className="text-gray-700 leading-relaxed">
              Our education pipeline offers multiple entry points: early education outreach programs, 
              community workshops, internships, and apprenticeships. We believe in meeting learners 
              where they are, providing accessible pathways for individuals at different stages of 
              their educational journey.
            </p>
          </div>
        </motion.div>

        {/* Progression */}
        <motion.div
          id="progression"
          ref={progressionRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Progression</h3>
            <p className="text-gray-700 leading-relaxed">
              We provide clear pathways from beginner exposure to professional or academic mastery. 
              Our structured progression model includes skill development, mentorship opportunities, 
              and increasingly complex projects that build confidence and competence in interdisciplinary 
              approaches to problem-solving.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">📈</span>
          </div>
        </motion.div>

        {/* Partnerships */}
        <motion.div
          id="partnerships"
          ref={partnershipsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🤝</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Partnerships</h3>
            <p className="text-gray-700 leading-relaxed">
              We collaborate with schools, universities, trade programs, and cultural institutions 
              to create comprehensive educational experiences. These partnerships expand our reach, 
              provide diverse learning environments, and ensure our programs align with industry 
              standards and community needs.
            </p>
          </div>
        </motion.div>

        {/* Special Focus */}
        <motion.div
          id="focus"
          ref={focusRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Special Focus</h3>
            <p className="text-gray-700 leading-relaxed">
              We have a special focus on bridging underserved communities to high-demand sectors 
              including technology, creative industries, and policy analysis. Our programs address 
              systemic barriers while providing the skills, networks, and opportunities needed for 
              meaningful career advancement and community leadership.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🌟</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 