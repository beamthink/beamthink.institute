"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BookOpen, Users, Network, BarChart2, Archive, FileText, Download, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllWikiPages } from '@/lib/sanity.queries';

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

type Region = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  info: {
    governance: string;
    scholarly: number;
    strategic: number;
    collaborations: number;
    productivity: number;
    pamphlets: number;
    archive: number;
  };
};

const regions: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    lat: 40,
    lng: -100,
    color: '#00fff7',
    info: {
      governance: 'Council of 7, rotating leadership',
      scholarly: 12,
      strategic: 5,
      collaborations: 8,
      productivity: 0.82,
      pamphlets: 3,
      archive: 14,
    },
  },
  {
    id: 'south-america',
    name: 'South America',
    lat: -15,
    lng: -60,
    color: '#f472b6',
    info: {
      governance: 'Community Assembly',
      scholarly: 7,
      strategic: 2,
      collaborations: 4,
      productivity: 0.68,
      pamphlets: 2,
      archive: 8,
    },
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 2,
    lng: 20,
    color: '#6ee7b7',
    info: {
      governance: 'Elders & Youth Council',
      scholarly: 9,
      strategic: 3,
      collaborations: 6,
      productivity: 0.74,
      pamphlets: 4,
      archive: 10,
    },
  },
  {
    id: 'europe',
    name: 'Europe',
    lat: 54,
    lng: 15,
    color: '#818cf8',
    info: {
      governance: 'Rotating Parliament',
      scholarly: 15,
      strategic: 6,
      collaborations: 10,
      productivity: 0.88,
      pamphlets: 5,
      archive: 16,
    },
  },
  {
    id: 'asia',
    name: 'Asia',
    lat: 35,
    lng: 105,
    color: '#facc15',
    info: {
      governance: 'Regional Clusters',
      scholarly: 11,
      strategic: 4,
      collaborations: 7,
      productivity: 0.79,
      pamphlets: 3,
      archive: 12,
    },
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    lat: 30,
    lng: 45,
    color: '#f59e42',
    info: {
      governance: 'Council of Wisdom',
      scholarly: 6,
      strategic: 2,
      collaborations: 3,
      productivity: 0.65,
      pamphlets: 1,
      archive: 6,
    },
  },
  {
    id: 'pacific',
    name: 'Pacific & Australia',
    lat: -25,
    lng: 135,
    color: '#38bdf8',
    info: {
      governance: 'Island Network',
      scholarly: 5,
      strategic: 1,
      collaborations: 2,
      productivity: 0.61,
      pamphlets: 2,
      archive: 5,
    },
  },
];

export default function NodesSection() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [wikiPages, setWikiPages] = useState<any[]>([]);
  const [governanceMembers, setGovernanceMembers] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dynamic metrics state
  const [crossNodeCollaborations, setCrossNodeCollaborations] = useState<number>(0);
  const [productivity, setProductivity] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState(false);
  
  // Enhanced data state
  const [crossNodeProjects, setCrossNodeProjects] = useState<any[]>([]);
  const [internRevenue, setInternRevenue] = useState<number>(0);
  const [productionRevenue, setProductionRevenue] = useState<number>(0);
  const [revenueGoal, setRevenueGoal] = useState<number>(50000);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Fetch cross-node collaboration count and detailed projects
  useEffect(() => {
    async function fetchCrossNodeCollaborations() {
      setMetricsLoading(true);
      try {
        // 1. Get all projects for this node
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, description')
          .eq('node_id', selectedRegion.id);
        
        if (!projects || projects.length === 0) {
          setCrossNodeCollaborations(0);
          setCrossNodeProjects([]);
          setMetricsLoading(false);
          return;
        }

        const projectIds = projects.map((p: any) => p.id);
        
        // 2. Get all participants for these projects
        const { data: projectParticipants } = await supabase
          .from('project_participants')
          .select('project_id, participant_id')
          .in('project_id', projectIds);
        
        if (!projectParticipants || projectParticipants.length === 0) {
          setCrossNodeCollaborations(0);
          setCrossNodeProjects([]);
          setMetricsLoading(false);
          return;
        }

        // 3. Get participant details to find their node_id
        const participantIds = [...new Set(projectParticipants.map((pp: any) => pp.participant_id))];
        const { data: participants } = await supabase
          .from('participants')
          .select('id, node_id, name')
          .in('id', participantIds);

        // 4. Get node names for display
        const nodeIds = [...new Set(participants?.map((p: any) => p.node_id) || [])];
        const { data: nodes } = await supabase
          .from('nodes')
          .select('id, name')
          .in('id', nodeIds);

        // 5. Group participants by project and analyze cross-node collaborations
        const projectNodeCounts = new Map();
        const projectDetails = new Map();
        
        projectParticipants.forEach((pp: any) => {
          const participant = participants?.find((p: any) => p.id === pp.participant_id);
          if (participant) {
            const projectId = pp.project_id;
            if (!projectNodeCounts.has(projectId)) {
              projectNodeCounts.set(projectId, new Set());
              projectDetails.set(projectId, {
                id: projectId,
                title: projects.find((p: any) => p.id === projectId)?.title || 'Unknown Project',
                description: projects.find((p: any) => p.id === projectId)?.description || '',
                nodes: new Set(),
                participants: []
              });
            }
            projectNodeCounts.get(projectId).add(participant.node_id);
            projectDetails.get(projectId).nodes.add(participant.node_id);
            projectDetails.get(projectId).participants.push(participant.name);
          }
        });

        // 6. Count projects with multiple nodes and build detailed list
        let crossNodeCount = 0;
        const crossNodeProjectsList: any[] = [];
        
        projectNodeCounts.forEach((nodeIds: Set<string>, projectId: string) => {
          if (nodeIds.size > 1) {
            crossNodeCount++;
            const projectDetail = projectDetails.get(projectId);
            if (projectDetail) {
              const nodeNames = Array.from(projectDetail.nodes).map((nodeId: string) => 
                nodes?.find((n: any) => n.id === nodeId)?.name || 'Unknown Node'
              );
              crossNodeProjectsList.push({
                ...projectDetail,
                nodes: nodeNames,
                nodeCount: nodeIds.size
              });
            }
          }
        });

        setCrossNodeCollaborations(crossNodeCount);
        setCrossNodeProjects(crossNodeProjectsList);
      } catch (error) {
        console.error('Error fetching cross-node collaborations:', error);
        setCrossNodeCollaborations(0);
        setCrossNodeProjects([]);
      } finally {
        setMetricsLoading(false);
      }
    }

    fetchCrossNodeCollaborations();
  }, [selectedRegion]);

  // Fetch productivity metrics with detailed breakdown
  useEffect(() => {
    async function fetchProductivity() {
      setMetricsLoading(true);
      try {
        // 1. Get intern earnings for this node
        const { data: internPlacements } = await supabase
          .from('intern_placements')
          .select('earnings, participant_id')
          .eq('node_id', selectedRegion.id);
        
        const internRev = (internPlacements || []).reduce((sum: number, placement: any) => 
          sum + (placement.earnings || 0), 0);
        setInternRevenue(internRev);

        // 2. Get internal NGO production revenue for this node
        const { data: nodeProductions } = await supabase
          .from('node_productions')
          .select('revenue_generated')
          .eq('node_id', selectedRegion.id);
        
        const prodRev = (nodeProductions || []).reduce((sum: number, production: any) => 
          sum + (production.revenue_generated || 0), 0);
        setProductionRevenue(prodRev);

        // 3. Calculate total revenue and productivity
        const totalRev = internRev + prodRev;
        setTotalRevenue(totalRev);
        
        // 4. Get revenue goal for this node (default to $50,000 if not set)
        const goal = 50000; // TODO: Replace with actual node.revenue_goal when available
        setRevenueGoal(goal);

        // 5. Calculate productivity percentage
        const productivityPercentage = Math.min(Math.floor((totalRev / goal) * 100), 100);
        setProductivity(productivityPercentage);
      } catch (error) {
        console.error('Error fetching productivity metrics:', error);
        setProductivity(0);
        setInternRevenue(0);
        setProductionRevenue(0);
        setTotalRevenue(0);
      } finally {
        setMetricsLoading(false);
      }
    }

    fetchProductivity();
  }, [selectedRegion]);

  // Fetch wiki pages (from both Supabase and Sanity, filter by region name and category 'nodes')
  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase
        .from('wiki_pages')
        .select('*')
        .order('updated_at', { ascending: false }),
      getAllWikiPages()
    ])
      .then(([supabaseRes, sanityPages]) => {
        const supabasePages = supabaseRes.data || [];
        const sanityPagesArr = sanityPages || [];
        // Merge by title, prefer Sanity if duplicate
        const merged: Record<string, any> = {};
        supabasePages.forEach((p: any) => {
          if (p.title) merged[p.title] = { ...p, _source: 'supabase' };
        });
        sanityPagesArr.forEach((p: any) => {
          if (p.title) merged[p.title] = { ...p, _source: 'sanity' };
        });
        // Filter by tag (region name) and category 'nodes'
        const filtered = Object.values(merged).filter((p: any) => {
          const tags = Array.isArray(p.tags) ? p.tags : [];
          return (p.category === 'nodes' || p.category === undefined) &&
            tags.map((t: string) => t.toLowerCase()).includes(selectedRegion.name.toLowerCase());
        });
        setWikiPages(filtered);
        setLoading(false);
      })
      .catch(() => {
        setWikiPages([]);
        setLoading(false);
      });
  }, [selectedRegion]);

  // Fetch governance members for the node
  useEffect(() => {
    supabase
      .from('governance_members')
      .select('*')
      .eq('node_id', selectedRegion.id)
      .then(({ data }) => setGovernanceMembers(data || []));
  }, [selectedRegion]);

  // Fetch publications for the node (via projects)
  useEffect(() => {
    async function fetchPublications() {
      // 1. Get projects for this node
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('node_id', selectedRegion.id);
      if (!projects || projects.length === 0) {
        setPublications([]);
        return;
      }
      // 2. Get publications for these projects
      const projectIds = projects.map((p: any) => p.id);
      const { data: pubs } = await supabase
        .from('project_publications')
        .select('*')
        .in('project_id', projectIds);
      setPublications(pubs || []);
    }
    fetchPublications();
  }, [selectedRegion]);

  // Export functionality
  const exportNodeData = () => {
    const data = {
      node: selectedRegion.name,
      crossNodeCollaborations,
      productivity: `${productivity}%`,
      revenue: {
        intern: internRevenue,
        production: productionRevenue,
        total: totalRevenue,
        goal: revenueGoal
      },
      projects: crossNodeProjects,
      governanceMembers,
      publications
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRegion.name}-node-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="nodes" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-0 md:px-8 py-24">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch gap-0 md:gap-8">
        {/* Left: Info Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRegion.id}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 bg-gradient-to-br from-cyan-900/80 to-black border-2 border-cyan-400 rounded-3xl shadow-2xl p-8 flex flex-col justify-between min-h-[600px] max-w-xl relative overflow-hidden"
          >
            {/* VFX overlays */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              style={{ background: `radial-gradient(circle at 30% 30%, ${selectedRegion.color} 0%, transparent 70%)` }}
            />
            <motion.h2
              className="text-4xl font-extrabold tracking-widest text-cyan-200 font-mono mb-6 drop-shadow-[0_0_12px_#00fff7]"
              style={{ fontFamily: 'Orbitron, monospace' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedRegion.name} Node
            </motion.h2>
            <div className="flex flex-col gap-6 z-10">
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <Users className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Governance:</span>
                <span className="text-cyan-100">{selectedRegion.info.governance}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <BookOpen className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Scholarly Output:</span>
                <span className="text-cyan-100">{selectedRegion.info.scholarly} papers</span>
                <span className="font-bold text-cyan-200 font-mono ml-4">Strategic:</span>
                <span className="text-cyan-100">{selectedRegion.info.strategic} reports</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <Network className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Cross-Node Collab:</span>
                <span className="text-cyan-100">
                  {metricsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `${crossNodeCollaborations} active`
                  )}
                </span>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <BarChart2 className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Productivity:</span>
                <span className="text-cyan-100">
                  {metricsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `${productivity}%`
                  )}
                </span>
                <div className="w-32 h-2 bg-cyan-800 rounded ml-4 overflow-hidden">
                  <motion.div
                    className="h-2 bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: metricsLoading ? 0 : `${productivity}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
              <motion.div className="flex items-center gap-3 bg-cyan-900/60 rounded-xl p-4 shadow-inner border border-cyan-400">
                <FileText className="h-6 w-6 text-cyan-300" />
                <span className="font-bold text-cyan-200 font-mono">Digital Pamphlets:</span>
                <span className="text-cyan-100">{selectedRegion.info.pamphlets}</span>
                <Archive className="h-6 w-6 text-cyan-300 ml-4" />
                <span className="font-bold text-cyan-200 font-mono">Archive:</span>
                <span className="text-cyan-100">{selectedRegion.info.archive} items</span>
              </motion.div>
            </div>
            <div className="flex justify-end mt-8 z-10">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold" onClick={() => setModalOpen(true)}>
                View Node Details
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Right: Interactive Globe */}
        <div className="flex-1 flex items-center justify-center min-h-[600px]">
          <div className="w-full h-[600px]">
            <Globe
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              pointsData={regions as Region[]}
              pointLat={(d) => (d as Region).lat}
              pointLng={(d) => (d as Region).lng}
              pointColor={(d) => (d as Region).color}
              pointAltitude={(d) => (selectedRegion.id === (d as Region).id ? 0.15 : 0.08)}
              pointRadius={(d) => (selectedRegion.id === (d as Region).id ? 1.2 : 0.8)}
              onPointClick={d => setSelectedRegion(d as Region)}
              pointLabel={(d) => (d as Region).name}
              backgroundColor="rgba(0,0,0,0)"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
      {/* Enhanced Node Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-extrabold tracking-widest text-cyan-200 font-mono flex items-center gap-2">
                <Network className="h-6 w-6 text-cyan-300" />
                {selectedRegion.name} Node Details
              </DialogTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-cyan-400 text-cyan-200"
                onClick={exportNodeData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </DialogHeader>
          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="mb-4 grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="wiki">Wiki</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab - Key Metrics Dashboard */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Cross-Node Projects</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-200">
                      {metricsLoading ? <span className="animate-pulse">...</span> : crossNodeCollaborations}
                    </div>
                  </Card>
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Productivity</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-200">
                      {metricsLoading ? <span className="animate-pulse">...</span> : `${productivity}%`}
                    </div>
                  </Card>
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Governance</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-200">{governanceMembers.length}</div>
                  </Card>
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Publications</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-200">{publications.length}</div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <CardTitle className="text-cyan-200 text-lg mb-4">Recent Activity</CardTitle>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-300">Wiki Articles</span>
                        <span className="text-cyan-100">{wikiPages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300">Active Projects</span>
                        <span className="text-cyan-100">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300">Total Revenue</span>
                        <span className="text-cyan-100">${totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <CardTitle className="text-cyan-200 text-lg mb-4">Quick Actions</CardTitle>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full border-cyan-400 text-cyan-200">
                        Add Governance Member
                      </Button>
                      <Button variant="outline" size="sm" className="w-full border-cyan-400 text-cyan-200">
                        Create Project
                      </Button>
                      <Button variant="outline" size="sm" className="w-full border-cyan-400 text-cyan-200">
                        Add Publication
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Collaborations Tab - Detailed Cross-Node Analysis */}
            <TabsContent value="collaborations">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-cyan-200">Cross-Node Projects</h3>
                  <Badge className="bg-cyan-700 text-white font-mono">
                    {crossNodeProjects.length} Projects
                  </Badge>
                </div>
                
                {crossNodeProjects.length === 0 ? (
                  <div className="text-cyan-400 text-center py-8">
                    No cross-node projects found for this node.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {crossNodeProjects.map((project, index) => (
                      <Card key={project.id} className="bg-gray-900/80 border-cyan-800 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-cyan-200 text-lg">{project.title}</div>
                            <div className="text-cyan-400 text-sm mt-1">{project.description}</div>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Network className="h-4 w-4 text-cyan-400" />
                                <span className="text-cyan-300 text-sm">Nodes: {project.nodes.join(', ')}</span>
                              </div>
                              <Badge variant="outline" className="border-cyan-400 text-cyan-200 text-xs">
                                {project.nodeCount} Nodes
                              </Badge>
                            </div>
                            <div className="text-cyan-100 text-xs mt-2">
                              Participants: {project.participants.join(', ')}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Revenue Tab - Detailed Financial Breakdown */}
            <TabsContent value="revenue">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Intern Revenue</div>
                    </div>
                    <div className="text-xl font-bold text-cyan-200">
                      ${metricsLoading ? <span className="animate-pulse">...</span> : internRevenue.toLocaleString()}
                    </div>
                  </Card>
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Production Revenue</div>
                    </div>
                    <div className="text-xl font-bold text-cyan-200">
                      ${metricsLoading ? <span className="animate-pulse">...</span> : productionRevenue.toLocaleString()}
                    </div>
                  </Card>
                  <Card className="bg-gray-900/80 border-cyan-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="h-4 w-4 text-cyan-400" />
                      <div className="text-cyan-400 text-sm font-mono">Goal</div>
                    </div>
                    <div className="text-xl font-bold text-cyan-200">
                      ${revenueGoal.toLocaleString()}
                    </div>
                  </Card>
                </div>
                
                <Card className="bg-gray-900/80 border-cyan-800 p-4">
                  <CardTitle className="text-cyan-200 text-lg mb-4">Revenue Progress</CardTitle>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300">Total Revenue</span>
                      <span className="text-cyan-200 font-bold">${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-cyan-800 rounded-full h-3">
                      <motion.div
                        className="bg-cyan-400 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: metricsLoading ? 0 : `${Math.min((totalRevenue / revenueGoal) * 100, 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-cyan-400">
                      <span>0</span>
                      <span>${revenueGoal.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Existing tabs with enhanced styling */}
            <TabsContent value="wiki">
              {loading ? (
                <div className="text-cyan-400">Loading wiki articles…</div>
              ) : wikiPages.length === 0 ? (
                <div className="text-cyan-400">No wiki articles found for this node.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-cyan-200">Wiki Articles</h3>
                    <Badge className="bg-cyan-700 text-white font-mono">
                      {wikiPages.length} Articles
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {wikiPages.map((page: any) => (
                      <Card key={page.id} className="bg-gray-900/80 border-cyan-800 p-4">
                        <div className="font-bold text-cyan-200 text-lg font-mono">{page.title}</div>
                        <div className="text-cyan-100 text-sm mt-1 line-clamp-3">{page.content?.slice(0, 200)}…</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(page.tags || []).map((tag: string) => (
                            <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="governance">
              {governanceMembers.length === 0 ? (
                <div className="text-cyan-400">No governance members found for this node.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-cyan-200">Governance Members</h3>
                    <Badge className="bg-cyan-700 text-white font-mono">
                      {governanceMembers.length} Members
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {governanceMembers.map((member: any) => (
                      <Card key={member.id} className="bg-gray-900/80 border-cyan-800 p-4 flex items-center gap-4">
                        {member.photo_url && <img src={member.photo_url} alt={member.name} className="w-12 h-12 rounded-full border-2 border-cyan-400" />}
                        <div className="flex-1">
                          <div className="font-bold text-cyan-200 text-lg font-mono">{member.name}</div>
                          <div className="text-cyan-400 text-sm">{member.title}</div>
                          <div className="text-cyan-100 text-xs mt-1">{member.bio}</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(member.tags || []).map((tag: string) => (
                              <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
                            ))}
                          </div>
                          <div className="flex gap-4 mt-2 text-xs">
                            {member.email && <span className="text-cyan-300">Email: {member.email}</span>}
                            {member.phone && <span className="text-cyan-300">Phone: {member.phone}</span>}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="publications">
              {publications.length === 0 ? (
                <div className="text-cyan-400">No publications found for this node.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-cyan-200">Publications</h3>
                    <div className="flex gap-2">
                      <Badge className="bg-cyan-700 text-white font-mono">
                        {publications.length} Publications
                      </Badge>
                      <Button 
                        size="sm" 
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                        onClick={() => {
                          publications.forEach((pub: any) => {
                            if (pub.file_url) window.open(pub.file_url, '_blank');
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {publications.map((pub: any) => (
                      <Card key={pub.id} className="bg-gray-900/80 border-cyan-800 p-4 flex flex-col gap-2">
                        <div className="font-bold text-cyan-200 text-lg font-mono">{pub.title}</div>
                        <div className="text-cyan-400 text-sm">{pub.authors}</div>
                        <div className="text-cyan-100 text-xs mt-1">{pub.abstract}</div>
                        {pub.file_url && (
                          <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline text-xs mt-2">
                            Download/View
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
} 