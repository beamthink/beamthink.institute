"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function DataInsightsPage() {
  const sourcesRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const outputsRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(sourcesRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Data Sources
          </button>
          <button
            onClick={() => scrollToSection(insightsRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Types of Insights
          </button>
          <button
            onClick={() => scrollToSection(outputsRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Outputs
          </button>
          <button
            onClick={() => scrollToSection(applicationRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Application
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 py-8 space-y-16">
        {/* Data Sources */}
        <motion.div
          id="sources"
          ref={sourcesRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">📊</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Data Sources</h3>
            <p className="text-gray-700 leading-relaxed">
              Our research draws from diverse data sources including academic literature, partner 
              institutions, community surveys, historical archives, and open data repositories. 
              This multi-faceted approach ensures comprehensive analysis and robust insights that 
              reflect both theoretical frameworks and real-world contexts.
            </p>
          </div>
        </motion.div>

        {/* Types of Insights */}
        <motion.div
          id="insights"
          ref={insightsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Types of Insights</h3>
            <p className="text-gray-700 leading-relaxed">
              We generate insights across multiple dimensions: identifying trends and patterns, 
              uncovering correlations between variables, measuring policy impacts, establishing 
              industry benchmarks, and conducting deep cultural analysis. These insights provide 
              the foundation for evidence-based decision-making and strategic planning.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </motion.div>

        {/* Outputs */}
        <motion.div
          id="outputs"
          ref={outputsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">📋</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Outputs</h3>
            <p className="text-gray-700 leading-relaxed">
              Our research findings are disseminated through multiple formats: comprehensive white 
              papers, interactive dashboards for data exploration, public reports for community 
              engagement, and compelling infographics for broader accessibility. Each output is 
              designed to maximize impact and usability across different audiences.
            </p>
          </div>
        </motion.div>

        {/* Application */}
        <motion.div
          id="application"
          ref={applicationRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Application</h3>
            <p className="text-gray-700 leading-relaxed">
              Our findings directly inform policy recommendations, community programs, and industry 
              innovations. By translating data into actionable insights, we bridge the gap between 
              research and implementation, ensuring that our work creates tangible impact in the 
              communities and sectors we serve.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 