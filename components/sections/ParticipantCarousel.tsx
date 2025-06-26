"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, Users, Award } from 'lucide-react';
import { useState } from 'react';

interface ParticipantCarouselProps {
  index: number;
}

// Placeholder participant data
const participants = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    role: 'Community Director',
    location: 'Atlanta, GA',
    avatar: '/placeholder-user.jpg',
    description: 'Leading sustainable development initiatives across the Southeast region.',
    expertise: ['Urban Planning', 'Community Development', 'Sustainability'],
    rating: 4.9,
    projects: 23
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Technology Lead',
    location: 'Austin, TX',
    avatar: '/placeholder-user.jpg',
    description: 'Building open-source infrastructure for community-owned digital platforms.',
    expertise: ['Software Development', 'Open Source', 'Digital Infrastructure'],
    rating: 4.8,
    projects: 18
  },
  {
    id: 3,
    name: 'Dr. Elena Thompson',
    role: 'Research Coordinator',
    location: 'Denver, CO',
    avatar: '/placeholder-user.jpg',
    description: 'Coordinating research initiatives focused on renewable energy and mountain ecosystems.',
    expertise: ['Research', 'Renewable Energy', 'Ecosystems'],
    rating: 4.9,
    projects: 31
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Agricultural Specialist',
    location: 'Portland, OR',
    avatar: '/placeholder-user.jpg',
    description: 'Developing sustainable farming practices and local food systems.',
    expertise: ['Agriculture', 'Food Systems', 'Sustainability'],
    rating: 4.7,
    projects: 15
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    role: 'Education Coordinator',
    location: 'Miami, FL',
    avatar: '/placeholder-user.jpg',
    description: 'Creating educational programs for coastal communities and environmental awareness.',
    expertise: ['Education', 'Environmental Science', 'Community Outreach'],
    rating: 4.8,
    projects: 27
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Infrastructure Engineer',
    location: 'Seattle, WA',
    avatar: '/placeholder-user.jpg',
    description: 'Designing resilient infrastructure systems for urban communities.',
    expertise: ['Engineering', 'Infrastructure', 'Urban Design'],
    rating: 4.9,
    projects: 22
  }
];

export default function ParticipantCarousel({ index }: ParticipantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % participants.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + participants.length) % participants.length);
  };

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
          <h2 className="text-5xl font-bold text-white mb-6">Our Community</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the dedicated individuals who are building sustainable futures through 
            collaborative innovation and community-driven development.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-900/80 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-900/80 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Cards */}
          <div className="flex gap-8 overflow-hidden">
            {participants.map((participant, participantIndex) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: participantIndex === currentIndex ? 1 : 0.3,
                  x: (participantIndex - currentIndex) * 100,
                  scale: participantIndex === currentIndex ? 1 : 0.9
                }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-full max-w-md"
              >
                <Card className="bg-gray-900/50 border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-600">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{participant.name}</h3>
                      <p className="text-orange-500 font-semibold mb-1">{participant.role}</p>
                      <p className="text-gray-400 text-sm mb-4">{participant.location}</p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-300">{participant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-300">{participant.projects} projects</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">{participant.description}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {participant.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-gray-600 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-8"
        >
          {participants.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentIndex(dotIndex)}
              className={`w-3 h-3 rounded-full transition-all ${
                dotIndex === currentIndex 
                  ? 'bg-orange-500' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">2,847</div>
              <div className="text-gray-300">Active Participants</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">156</div>
              <div className="text-gray-300">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">4.8</div>
              <div className="text-gray-300">Average Rating</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 