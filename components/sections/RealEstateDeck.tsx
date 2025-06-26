"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Home, Users, DollarSign, Calendar } from 'lucide-react';

interface RealEstateDeckProps {
  index: number;
}

// Placeholder real estate data
const properties = [
  {
    id: 'prop-1',
    name: 'Community Innovation Center',
    location: 'Atlanta, GA',
    type: 'Commercial',
    status: 'Active',
    description: 'A collaborative workspace and innovation hub for community-driven projects and startups.',
    image: '/placeholder.jpg',
    metrics: {
      size: '25,000 sq ft',
      capacity: '200 people',
      investment: '$2.5M',
      completion: '2023'
    },
    features: ['Co-working Spaces', 'Meeting Rooms', 'Event Hall', 'Green Building'],
    occupancy: 85
  },
  {
    id: 'prop-2',
    name: 'Sustainable Housing Complex',
    location: 'Portland, OR',
    type: 'Residential',
    status: 'Active',
    description: 'Eco-friendly residential complex with shared amenities and community gardens.',
    image: '/placeholder.jpg',
    metrics: {
      size: '150 units',
      capacity: '400 residents',
      investment: '$8.2M',
      completion: '2022'
    },
    features: ['Solar Panels', 'Community Garden', 'Shared Kitchen', 'Green Roof'],
    occupancy: 92
  },
  {
    id: 'prop-3',
    name: 'Educational Campus',
    location: 'Denver, CO',
    type: 'Educational',
    status: 'Active',
    description: 'Modern educational facility focused on sustainable development and community learning.',
    image: '/placeholder.jpg',
    metrics: {
      size: '45,000 sq ft',
      capacity: '500 students',
      investment: '$12.8M',
      completion: '2024'
    },
    features: ['Classrooms', 'Labs', 'Library', 'Auditorium'],
    occupancy: 78
  },
  {
    id: 'prop-4',
    name: 'Urban Farm & Market',
    location: 'Miami, FL',
    type: 'Agricultural',
    status: 'Active',
    description: 'Urban farming facility with local market and educational programs.',
    image: '/placeholder.jpg',
    metrics: {
      size: '5 acres',
      capacity: '50 vendors',
      investment: '$3.1M',
      completion: '2023'
    },
    features: ['Greenhouse', 'Market Space', 'Workshop Area', 'Café'],
    occupancy: 95
  },
  {
    id: 'prop-5',
    name: 'Technology Hub',
    location: 'Austin, TX',
    type: 'Commercial',
    status: 'Active',
    description: 'State-of-the-art technology center for digital innovation and collaboration.',
    image: '/placeholder.jpg',
    metrics: {
      size: '30,000 sq ft',
      capacity: '300 people',
      investment: '$6.5M',
      completion: '2024'
    },
    features: ['Data Center', 'Labs', 'Conference Rooms', 'Innovation Space'],
    occupancy: 88
  },
  {
    id: 'prop-6',
    name: 'Community Health Center',
    location: 'Seattle, WA',
    type: 'Healthcare',
    status: 'Active',
    description: 'Comprehensive healthcare facility serving the local community with modern amenities.',
    image: '/placeholder.jpg',
    metrics: {
      size: '20,000 sq ft',
      capacity: '100 patients/day',
      investment: '$4.7M',
      completion: '2023'
    },
    features: ['Medical Suites', 'Pharmacy', 'Wellness Center', 'Community Room'],
    occupancy: 91
  }
];

export default function RealEstateDeck({ index }: RealEstateDeckProps) {
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
          <h2 className="text-5xl font-bold text-white mb-6">Real Estate Portfolio</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our diverse portfolio of properties supports community development, 
            innovation, and sustainable living across multiple regions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {properties.map((property, propertyIndex) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index * 0.1) + (propertyIndex * 0.1) }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{property.name}</h3>
                    <div className="flex items-center gap-1 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {property.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{property.occupancy}% occupied</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{property.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Key Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span className="font-semibold text-orange-500">{property.metrics.size}</span>
                        </div>
                        <div>Size</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold text-orange-500">{property.metrics.capacity}</span>
                        </div>
                        <div>Capacity</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-orange-500">{property.metrics.investment}</span>
                        </div>
                        <div>Investment</div>
                      </div>
                      <div className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="font-semibold text-orange-500">{property.metrics.completion}</span>
                        </div>
                        <div>Completed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (index * 0.1) + 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">6</div>
              <div className="text-gray-300">Properties</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">175,000</div>
              <div className="text-gray-300">Total Sq Ft</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">$37.8M</div>
              <div className="text-gray-300">Total Investment</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">88%</div>
              <div className="text-gray-300">Average Occupancy</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 