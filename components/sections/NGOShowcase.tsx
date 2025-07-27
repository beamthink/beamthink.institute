"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Heart, Shield, Leaf, Users, TrendingUp } from 'lucide-react';

interface NGOShowcaseProps {
  index: number;
}

// Placeholder NGO data
const ngos = [
  {
    id: 'ngo-1',
    name: 'Green Earth Initiative',
    logo: '/placeholder-logo.png',
    description: 'Leading environmental conservation and sustainable development projects across multiple regions.',
    focus: ['Environmental Conservation', 'Sustainable Development', 'Community Education'],
    impact: {
      projects: 45,
      communities: 23,
      volunteers: 1200,
      funding: '$2.3M'
    },
    status: 'Active Partner',
    icon: Leaf,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'ngo-2',
    name: 'Digital Rights Foundation',
    logo: '/placeholder-logo.png',
    description: 'Advocating for digital rights and building open-source infrastructure for communities.',
    focus: ['Digital Rights', 'Open Source', 'Digital Literacy'],
    impact: {
      projects: 32,
      communities: 18,
      volunteers: 850,
      funding: '$1.8M'
    },
    status: 'Active Partner',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'ngo-3',
    name: 'Community Health Alliance',
    logo: '/placeholder-logo.png',
    description: 'Providing healthcare access and wellness programs to underserved communities.',
    focus: ['Healthcare Access', 'Wellness Programs', 'Community Health'],
    impact: {
      projects: 28,
      communities: 31,
      volunteers: 950,
      funding: '$3.1M'
    },
    status: 'Active Partner',
    icon: Heart,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'ngo-4',
    name: 'Global Education Network',
    logo: '/placeholder-logo.png',
    description: 'Creating educational opportunities and skill development programs worldwide.',
    focus: ['Education', 'Skill Development', 'Digital Learning'],
    impact: {
      projects: 56,
      communities: 42,
      volunteers: 2100,
      funding: '$4.2M'
    },
    status: 'Active Partner',
    icon: Users,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'ngo-5',
    name: 'Innovation Hub Collective',
    logo: '/placeholder-logo.png',
    description: 'Fostering innovation and entrepreneurship in local communities through collaborative spaces.',
    focus: ['Innovation', 'Entrepreneurship', 'Collaborative Spaces'],
    impact: {
      projects: 38,
      communities: 25,
      volunteers: 780,
      funding: '$2.8M'
    },
    status: 'Active Partner',
    icon: TrendingUp,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'ngo-6',
    name: 'Sustainable Communities Foundation',
    logo: '/placeholder-logo.png',
    description: 'Building resilient and sustainable communities through infrastructure and resource management.',
    focus: ['Infrastructure', 'Resource Management', 'Community Resilience'],
    impact: {
      projects: 41,
      communities: 29,
      volunteers: 1100,
      funding: '$3.5M'
    },
    status: 'Active Partner',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500'
  }
];

export default function NGOShowcase({ index }: NGOShowcaseProps) {
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
          <h2 className="text-5xl font-bold text-white mb-6">Partner Organizations</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We collaborate with leading NGOs and organizations worldwide to create 
            sustainable impact and drive positive change in communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ngos.map((ngo, ngoIndex) => {
            const IconComponent = ngo.icon;
            return (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index * 0.1) + (ngoIndex * 0.1) }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 h-full">
                  <div className={`h-2 bg-gradient-to-r ${ngo.color}`} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${ngo.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{ngo.name}</h3>
                        <Badge variant="outline" className="border-green-500 text-green-400 text-xs mt-1">
                          {ngo.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">{ngo.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {ngo.focus.map((area) => (
                          <Badge key={area} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Impact</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-300">
                          <div className="font-semibold text-orange-500">{ngo.impact.projects}</div>
                          <div>Projects</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-orange-500">{ngo.impact.communities}</div>
                          <div>Communities</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-orange-500">{ngo.impact.volunteers}</div>
                          <div>Volunteers</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-orange-500">{ngo.impact.funding}</div>
                          <div>Funding</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Partnership Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">240</div>
              <div className="text-gray-300">Active Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">168</div>
              <div className="text-gray-300">Communities Served</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">6,980</div>
              <div className="text-gray-300">Total Volunteers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">$17.7M</div>
              <div className="text-gray-300">Total Funding</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 