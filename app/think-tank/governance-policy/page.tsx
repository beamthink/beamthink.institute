"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function GovernancePolicyPage() {
  const governanceRef = useRef<HTMLDivElement>(null);
  const policyRef = useRef<HTMLDivElement>(null);
  const decisionRef = useRef<HTMLDivElement>(null);
  const transparencyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(governanceRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Governance Model
          </button>
          <button
            onClick={() => scrollToSection(policyRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Policy Priorities
          </button>
          <button
            onClick={() => scrollToSection(decisionRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Decision Process
          </button>
          <button
            onClick={() => scrollToSection(transparencyRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Transparency
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 py-8 space-y-16">
        {/* Governance Model */}
        <motion.div
          id="governance"
          ref={governanceRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🏛️</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Governance Model</h3>
            <p className="text-gray-700 leading-relaxed">
              BEAM operates through a multi-layered governance structure including a board of directors, 
              advisory panels, and operational nodes or pods. This distributed model ensures diverse 
              perspectives while maintaining clear accountability and decision-making authority across 
              different areas of operation.
            </p>
          </div>
        </motion.div>

        {/* Policy Priorities */}
        <motion.div
          id="policy"
          ref={policyRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Policy Priorities</h3>
            <p className="text-gray-700 leading-relaxed">
              Our policy framework is guided by three core thematic areas: ethical technology use, 
              equity in education, and cultural preservation. These priorities inform all strategic 
              decisions and ensure our work aligns with our mission of advancing interdisciplinary 
              innovation for social impact.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">⚖️</span>
          </div>
        </motion.div>

        {/* Decision-making Process */}
        <motion.div
          id="decision"
          ref={decisionRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🔄</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Decision-making Process</h3>
            <p className="text-gray-700 leading-relaxed">
              Our decision-making process follows a structured approach: strategies are developed 
              through collaborative input, reviewed by relevant advisory panels, approved by the 
              board, and implemented through operational nodes. Regular review cycles ensure 
              continuous improvement and alignment with our mission.
            </p>
          </div>
        </motion.div>

        {/* Transparency */}
        <motion.div
          id="transparency"
          ref={transparencyRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Transparency</h3>
            <p className="text-gray-700 leading-relaxed">
              We are committed to full transparency in our operations. This includes publishing 
              annual reports, sharing research outputs, and distributing policy briefs. We believe 
              that open access to information strengthens our community relationships and enables 
              collaborative problem-solving.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 