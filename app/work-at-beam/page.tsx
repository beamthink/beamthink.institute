"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Heart, Globe, Lightbulb, ArrowRight } from "lucide-react";

export default function WorkAtBeamPage() {
  const opportunitiesRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 h-16 flex items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(opportunitiesRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Opportunities
          </button>
          <button
            onClick={() => scrollToSection(cultureRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Culture
          </button>
          <button
            onClick={() => scrollToSection(positionsRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Open Positions
          </button>
          <button
            onClick={() => scrollToSection(applyRef)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            How to Apply
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-8 py-16 text-center bg-gradient-to-br from-orange-50 to-red-50"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Work at BEAM
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Join a team that's building the future of community-owned infrastructure, 
            cooperative economics, and interdisciplinary innovation. Help us create 
            sustainable solutions at the intersection of arts, technology, education, 
            and social impact.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection(positionsRef)}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            View Open Positions
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="px-8 py-16 space-y-20">
        {/* Opportunities */}
        <motion.div
          id="opportunities"
          ref={opportunitiesRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Work at BEAM?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another organization—we're a movement. Here's what makes 
              working at BEAM unique and meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
              <p className="text-gray-600">
                Work directly with communities to solve real-world problems and see 
                the immediate impact of your contributions.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation Hub</h3>
              <p className="text-gray-600">
                Be part of cutting-edge research and development at the intersection 
                of multiple disciplines and emerging technologies.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Network</h3>
              <p className="text-gray-600">
                Connect with partners, researchers, and communities worldwide, building 
                a network that spans continents and cultures.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Culture */}
        <motion.div
          id="culture"
          ref={cultureRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Culture</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At BEAM, we believe that the best work happens when people feel valued, 
                supported, and inspired. Our culture is built on collaboration, creativity, 
                and a shared commitment to making a difference.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Flexible, remote-first work environment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Continuous learning and development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Collaborative, non-hierarchical structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Focus on work-life balance and wellness</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-12 h-80 flex items-center justify-center">
              <span className="text-8xl">🌟</span>
            </div>
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          id="positions"
          ref={positionsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're currently looking for passionate individuals to join our team. 
              Check out the opportunities below and find your perfect fit.
            </p>
          </div>

          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Community Engagement Specialist</h3>
                  <p className="text-gray-600 mb-4">
                    Lead community outreach and engagement initiatives, building strong relationships 
                    with local communities and partners.
                  </p>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Full-time
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Remote
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      Entry-level
                    </span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Research & Development Lead</h3>
                  <p className="text-gray-600 mb-4">
                    Drive innovation in our interdisciplinary research programs, exploring 
                    new solutions at the intersection of arts, technology, and social impact.
                  </p>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Full-time
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Remote
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      Senior
                    </span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Digital Infrastructure Engineer</h3>
                  <p className="text-gray-600 mb-4">
                    Build and maintain the digital platforms that support our community 
                    initiatives and research programs.
                  </p>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Full-time
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Remote
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Mid-level
                    </span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* How to Apply */}
        <motion.div
          id="apply"
          ref={applyRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">How to Apply</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Ready to join the BEAM team? Here's how to get started with your application.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Positions</h3>
              <p className="text-gray-600">
                Browse our open positions and find the role that best matches your skills and interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prepare Application</h3>
              <p className="text-gray-600">
                Gather your resume, cover letter, and any relevant portfolio materials.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit & Connect</h3>
              <p className="text-gray-600">
                Submit your application and we'll be in touch within 48 hours to discuss next steps.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h3>
            <p className="text-gray-600 mb-6">
              Not sure which position is right for you? Want to learn more about working at BEAM? 
              We'd love to hear from you!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200">
              Contact Our Team
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
