"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Building2 } from 'lucide-react';

interface HeroProps {
  index: number;
}

// Placeholder region data
const regions = [
  {
    id: 'georgia',
    name: 'Georgia',
    description: 'Southeast hub for community development and innovation',
    population: '10.7M',
    pods: 24,
    director: 'Dr. Sarah Johnson',
    image: '/placeholder.jpg'
  },
  {
    id: 'florida',
    name: 'Florida',
    description: 'Coastal communities driving sustainable growth',
    population: '21.5M',
    pods: 31,
    director: 'Michael Chen',
    image: '/placeholder.jpg'
  },
  {
    id: 'california',
    name: 'California',
    description: 'West Coast innovation and technology leadership',
    population: '39.5M',
    pods: 45,
    director: 'Dr. Elena Rodriguez',
    image: '/placeholder.jpg'
  },
  {
    id: 'texas',
    name: 'Texas',
    description: 'Energy and agriculture transformation',
    population: '29.1M',
    pods: 38,
    director: 'James Wilson',
    image: '/placeholder.jpg'
  },
  {
    id: 'new-york',
    name: 'New York',
    description: 'Urban development and cultural exchange',
    population: '19.5M',
    pods: 28,
    director: 'Lisa Thompson',
    image: '/placeholder.jpg'
  },
  {
    id: 'colorado',
    name: 'Colorado',
    description: 'Mountain communities and renewable energy',
    population: '5.8M',
    pods: 15,
    director: 'David Martinez',
    image: '/placeholder.jpg'
  }
];

export default function RegionGrid({ index }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Our Regions</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how BEAM Institute is transforming communities across the United States 
            through collaborative infrastructure and cooperative economics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region, regionIndex) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index * 0.1) + (regionIndex * 0.1) }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={region.image} 
                    alt={region.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{region.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4">{region.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{region.population} residents</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{region.pods} active PODs</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Director: {region.director}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Explore {region.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 