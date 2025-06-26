"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HeroProps {
  index: number;
}

export default function Hero({ index }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl z-0" />
          
          <Card className="relative bg-gray-900/50 border-gray-700 rounded-3xl overflow-hidden z-10">
            <CardContent className="p-16 flex flex-col items-center text-center">
              <motion.h1 
                className="text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                BEAM Institute
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Community-owned infrastructure and cooperative economics platform. 
                Building sustainable futures through collaborative innovation.
              </motion.p>
              
              <motion.div 
                className="flex gap-6 mb-12 flex-wrap justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition">
                  Explore Regions
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white font-bold text-lg px-8 py-4 rounded-lg transition hover:bg-gray-800">
                  Join Community
                </Button>
              </motion.div>
              
              {/* Trusted By */}
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-center mb-6 text-lg">Trusted By Communities Worldwide</p>
                <div className="flex gap-12 flex-wrap justify-center items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.img 
                      key={i}
                      src="/placeholder-logo.png" 
                      alt={`Partner ${i}`} 
                      className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 