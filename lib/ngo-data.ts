export interface NGOCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'animated' | 'video' | 'interactive';
  sector: string;
  focus: string[];
  impact?: {
    projects: number;
    communities: number;
    volunteers: number;
    funding: string;
  };
  status: 'Active Partner' | 'Strategic Partner' | 'Emerging Partner';
  website?: string;
  readyaimgoLink?: string;
  videoUrl?: string;
}

export const ngoSectors = {
  /*
  'Finance & Economic Systems': [
    {
      id: 'beam-fcu',
      name: 'BEAM Federal Credit Union',
      description: 'Financial services cooperative providing banking, lending, and investment solutions for BEAM communities.',
      icon: '🏦',
      color: 'from-blue-500 to-indigo-500',
      type: 'animated' as const,
      sector: 'Finance & Economic Systems',
      focus: ['Banking', 'Loans', 'Investment', 'Community Finance'],
      impact: { projects: 15, communities: 12, volunteers: 120, funding: '$15M' },
      status: 'Active Partner' as const,
      website: 'https://beamfcu.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-fcu'
    },
    {
      id: 'beam-coop',
      name: 'BEAM Cooperative Development Network',
      description: 'Supports worker-owned and cooperative businesses for sustainable local economies.',
      icon: '🤝',
      color: 'from-green-500 to-emerald-500',
      type: 'video' as const,
      sector: 'Finance & Economic Systems',
      focus: ['Cooperative Models', 'Economic Democracy', 'Local Business Development'],
      impact: { projects: 12, communities: 9, volunteers: 85, funding: '$4.5M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamcoop.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-coop'
    },
    {
      id: 'beam-trade',
      name: 'BEAM Trade & Commerce Authority',
      description: 'Facilitates domestic and international trade for BEAM-aligned enterprises.',
      icon: '📦',
      color: 'from-yellow-500 to-orange-500',
      type: 'animated' as const,
      sector: 'Finance & Economic Systems',
      focus: ['Trade Policy', 'Commerce Facilitation', 'Market Access'],
      impact: { projects: 8, communities: 7, volunteers: 60, funding: '$6.2M' },
      status: 'Emerging Partner' as const,
      website: 'https://beamtrade.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-trade'
    }
  ],

  'Healthcare & Life Sciences': [
    {
      id: 'beam-health',
      name: 'BEAM Health & Medical Foundation',
      description: 'Healthcare access and public health programs across BEAM communities.',
      icon: '🏥',
      color: 'from-red-400 to-pink-500',
      type: 'video' as const,
      sector: 'Healthcare & Life Sciences',
      focus: ['Healthcare Access', 'Preventive Care', 'Medical Research'],
      impact: { projects: 20, communities: 14, volunteers: 200, funding: '$12M' },
      status: 'Active Partner' as const,
      website: 'https://beamhealth.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-health'
    },
    {
      id: 'beam-pharma',
      name: 'BEAM Pharmaceuticals & Biotech Network',
      description: 'Research and development of essential medicines and biotech innovations.',
      icon: '💊',
      color: 'from-purple-500 to-violet-500',
      type: 'animated' as const,
      sector: 'Healthcare & Life Sciences',
      focus: ['Pharmaceuticals', 'Biotechnology', 'Clinical Trials'],
      impact: { projects: 9, communities: 6, volunteers: 55, funding: '$8M' },
      status: 'Strategic Partner' as const,
      website: 'https://beampharma.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-pharma'
    }
  ],

  'Education, Research & Innovation': [
    {
      id: 'beam-education',
      name: 'BEAM Education & Learning Institute',
      description: 'Provides educational programs and skill development for BEAM communities.',
      icon: '🎓',
      color: 'from-indigo-500 to-purple-500',
      type: 'animated' as const,
      sector: 'Education, Research & Innovation',
      focus: ['Education', 'Skill Development', 'Community Learning'],
      impact: { projects: 18, communities: 15, volunteers: 150, funding: '$9M' },
      status: 'Active Partner' as const,
      website: 'https://beameducation.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-education'
    },
    {
      id: 'beam-research',
      name: 'BEAM Research & Development Network',
      description: 'Conducts research in science, technology, and social innovation.',
      icon: '🔬',
      color: 'from-cyan-500 to-blue-500',
      type: 'video' as const,
      sector: 'Education, Research & Innovation',
      focus: ['Research', 'Innovation', 'Technology Development'],
      impact: { projects: 14, communities: 10, volunteers: 90, funding: '$7.5M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamresearch.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-research'
    }
  ],

  'Infrastructure & Energy': [
    {
      id: 'beam-infrastructure',
      name: 'BEAM Infrastructure Development Authority',
      description: 'Builds and maintains critical infrastructure for BEAM communities.',
      icon: '🏗️',
      color: 'from-orange-500 to-red-500',
      type: 'animated' as const,
      sector: 'Infrastructure & Energy',
      focus: ['Infrastructure', 'Construction', 'Maintenance'],
      impact: { projects: 22, communities: 18, volunteers: 180, funding: '$25M' },
      status: 'Active Partner' as const,
      website: 'https://beaminfrastructure.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-infrastructure'
    },
    {
      id: 'beam-energy',
      name: 'BEAM Renewable Energy Cooperative',
      description: 'Develops and manages renewable energy projects for sustainable power.',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      type: 'video' as const,
      sector: 'Infrastructure & Energy',
      focus: ['Renewable Energy', 'Solar Power', 'Wind Energy'],
      impact: { projects: 16, communities: 12, volunteers: 110, funding: '$18M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamenergy.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-energy'
    },
    {
      id: 'beam-smart',
      name: 'BEAM Smart Cities Consortium',
      description: 'Designs and implements smart city technologies for BEAM communities.',
      icon: '🏙️',
      color: 'from-teal-500 to-cyan-500',
      type: 'video' as const,
      sector: 'Infrastructure & Energy',
      focus: ['Smart Cities', 'Urban Planning', 'IoT Systems'],
      impact: { projects: 5, communities: 3, volunteers: 25, funding: '$4.2M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamsmart.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-smart'
    }
  ],
*/
  'Media, Culture & Arts': [
    /*
    {
      id: 'beam-media',
      name: 'BEAM Media & Communications Network',
      description: 'Manages media platforms, content creation, and cultural storytelling.',
      icon: '📺',
      color: 'from-purple-400 to-violet-500',
      type: 'animated' as const,
      sector: 'Media, Culture & Arts',
      focus: ['Media Production', 'Cultural Content', 'Communications Strategy'],
      impact: { projects: 9, communities: 6, volunteers: 40, funding: '$3.5M' },
      status: 'Active Partner' as const,
      website: 'https://beammedia.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-media'
    },*/
    {
      id: "beam-band",
      name: "BEAM Band",
      description:
        "A city-based music NGO uniting local bands for fundraising concerts and community projects. Each node builds toward owning land and a rehearsal/performance building for music education, shows, and cultural development.",
      icon: "🎸",
      color: "from-red-500 to-pink-500",
      type: "video" as const,
      sector: "Media, Culture & Arts",
      focus: ["Community", "Concerts", "Education", "Fundraising"],
      impact: { projects: 12, communities: 8, volunteers: 85, funding: '$2.5M' },
      status: "Active Partner" as const,
      website: "https://band.beamthinktank.space",
      readyaimgoLink: "https://readyaimgo.com/projects/beam-band",
      videoUrl: "https://gfqhzuqckfxtzqawdcso.supabase.co/storage/v1/object/public/hero/3345545-hd_1920_1080_25fps.mp4"
    },
    /*
    {
      id: 'beam-heritage',
      name: 'BEAM Cultural Heritage Foundation',
      description: 'Preserves and promotes cultural history, art, and heritage.',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      type: 'video' as const,
      sector: 'Media, Culture & Arts',
      focus: ['Cultural Preservation', 'Art Programs', 'Heritage Projects'],
      impact: { projects: 6, communities: 4, volunteers: 35, funding: '$2.8M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamheritage.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-heritage'
    },
    {
      id: 'beam-orchestra',
      name: 'BEAM Orchestra',
      description: 'Professional orcehstra and training program',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      type: 'video' as const,
      sector: 'Media, Culture & Arts',
      focus: ['Cultural Preservation', 'Art Programs', 'Heritage Projects'],
      impact: { projects: 6, communities: 4, volunteers: 35, funding: '$2.8M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamheritage.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-heritage'
    }*/
  ],
  /*
  'Environmental Stewardship': [
    {
      id: 'beam-environment',
      name: 'BEAM Environmental Protection League',
      description: 'Advocates for environmental sustainability and resource conservation.',
      icon: '🌱',
      color: 'from-green-400 to-emerald-500',
      type: 'animated' as const,
      sector: 'Environmental Stewardship',
      focus: ['Conservation', 'Sustainability', 'Community Education'],
      impact: { projects: 10, communities: 8, volunteers: 70, funding: '$3M' },
      status: 'Active Partner' as const,
      website: 'https://beamenvironment.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-environment'
    },
    {
      id: 'beam-ocean',
      name: 'BEAM Ocean & Waterways Conservancy',
      description: 'Protects marine and freshwater ecosystems through science and community programs.',
      icon: '🌊',
      color: 'from-blue-400 to-indigo-500',
      type: 'video' as const,
      sector: 'Environmental Stewardship',
      focus: ['Marine Conservation', 'Waterways Protection', 'Aquatic Research'],
      impact: { projects: 4, communities: 3, volunteers: 20, funding: '$1.5M' },
      status: 'Strategic Partner' as const,
      website: 'https://beamocean.org',
      readyaimgoLink: 'https://readyaimgo.biz/beam-ocean'
    }
  ]*/
};

// Helper functions
export const getAllNGOs = (): NGOCard[] => {
  return Object.values(ngoSectors).flat();
};

export const getNGOsBySector = (sector: string): NGOCard[] => {
  return ngoSectors[sector as keyof typeof ngoSectors] || [];
};

export const searchNGOs = (query: string): NGOCard[] => {
  const allNGOs = getAllNGOs();
  const lowercaseQuery = query.toLowerCase();
  
  return allNGOs.filter(ngo => 
    ngo.name.toLowerCase().includes(lowercaseQuery) ||
    ngo.description.toLowerCase().includes(lowercaseQuery) ||
    ngo.focus.some(focus => focus.toLowerCase().includes(lowercaseQuery))
  );
};
