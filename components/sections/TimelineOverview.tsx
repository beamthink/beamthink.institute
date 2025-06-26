"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, TrendingUp, Award, Target } from 'lucide-react';

interface TimelineOverviewProps {
  index: number;
}

// Placeholder timeline data
const timelineEvents = [
  {
    id: 1,
    year: '2018',
    title: 'Foundation Established',
    description: 'BEAM Institute was founded with a vision to create community-owned infrastructure and cooperative economics.',
    category: 'Foundation',
    location: 'Atlanta, GA',
    icon: Award,
    color: 'from-blue-500 to-cyan-500',
    status: 'Completed'
  },
  {
    id: 2,
    year: '2019',
    title: 'First POD Launch',
    description: 'Launched our first Point of Development (POD) in Atlanta, establishing the model for community innovation hubs.',
    category: 'POD Network',
    location: 'Atlanta, GA',
    icon: MapPin,
    color: 'from-green-500 to-emerald-500',
    status: 'Completed'
  },
  {
    id: 3,
    year: '2020',
    title: 'Regional Expansion',
    description: 'Expanded to 5 regions across the United States, establishing PODs in Florida, California, Texas, and Colorado.',
    category: 'Expansion',
    location: 'Multiple States',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    status: 'Completed'
  },
  {
    id: 4,
    year: '2021',
    title: 'NGO Partnerships',
    description: 'Formed strategic partnerships with 12 leading NGOs, creating collaborative networks for sustainable development.',
    category: 'Partnerships',
    location: 'National',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    status: 'Completed'
  },
  {
    id: 5,
    year: '2022',
    title: 'Real Estate Portfolio',
    description: 'Acquired and developed our first major real estate portfolio, including innovation centers and sustainable housing.',
    category: 'Real Estate',
    location: 'Multiple Locations',
    icon: Award,
    color: 'from-teal-500 to-cyan-500',
    status: 'Completed'
  },
  {
    id: 6,
    year: '2023',
    title: 'Digital Platform Launch',
    description: 'Launched our comprehensive digital platform connecting communities, PODs, and resources nationwide.',
    category: 'Technology',
    location: 'Global',
    icon: TrendingUp,
    color: 'from-indigo-500 to-purple-500',
    status: 'Completed'
  },
  {
    id: 7,
    year: '2024',
    title: 'International Expansion',
    description: 'Expanding operations to Europe and Asia, establishing global networks for community development.',
    category: 'Global',
    location: 'International',
    icon: MapPin,
    color: 'from-yellow-500 to-orange-500',
    status: 'In Progress'
  },
  {
    id: 8,
    year: '2025',
    title: 'Climate Innovation Hub',
    description: 'Launching specialized PODs focused on climate innovation and renewable energy solutions.',
    category: 'Innovation',
    location: 'Multiple Locations',
    icon: Target,
    color: 'from-green-500 to-teal-500',
    status: 'Planned'
  }
];

export default function TimelineOverview({ index }: TimelineOverviewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Our Journey</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From our founding to future goals, explore the key milestones that have shaped 
            BEAM Institute's mission to build sustainable, community-driven infrastructure.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-600 to-gray-800 transform -translate-x-1/2" />
          
          <div className="space-y-12">
            {timelineEvents.map((event, eventIndex) => {
              const IconComponent = event.icon;
              const isEven = eventIndex % 2 === 0;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: (index * 0.1) + (eventIndex * 0.1) }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col gap-8`}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
                    <Card className="bg-gray-900/50 border-gray-700 rounded-2xl hover:border-gray-600 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                          <Badge 
                            variant="outline" 
                            className={`border-gray-600 text-gray-300 ${
                              event.status === 'Completed' ? 'border-green-500 text-green-400' :
                              event.status === 'In Progress' ? 'border-yellow-500 text-yellow-400' :
                              'border-blue-500 text-blue-400'
                            }`}
                          >
                            {event.status}
                          </Badge>
                          <span className="text-2xl font-bold text-orange-500">{event.year}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>
                        
                        <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {event.category}
                          </Badge>
                        </div>
                        
                        <div className={`${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
                          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-gray-700 rounded-3xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-4xl font-bold text-white mb-6">Our Vision for 2030</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                By 2030, BEAM Institute aims to establish 100+ PODs across 25 countries, 
                creating a global network of community-owned infrastructure serving over 
                1 million people through sustainable development and cooperative economics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
                  <div className="text-gray-300">Global PODs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">25</div>
                  <div className="text-gray-300">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">1M+</div>
                  <div className="text-gray-300">People Served</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 