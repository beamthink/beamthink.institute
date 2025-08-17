"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity, 
  Settings, 
  Search, 
  Bell,
  Plus,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminData, type AdminNGO, type AdminUser, type AdminDonation, type AdminEvent } from '@/hooks/use-admin-data';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNGO, setSelectedNGO] = useState<string>('all');
  
  const { 
    ngos, 
    users, 
    donations, 
    events, 
    stats, 
    loading, 
    error, 
    refreshAll 
  } = useAdminData();

  const filteredNGOs = ngos.filter(ngo => 
    ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ngo.sector && ngo.sector.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRefresh = () => {
    refreshAll();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-cyan-400">BEAM Admin</h1>
            <Badge variant="secondary" className="bg-cyan-900 text-cyan-300">
              Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search NGOs, users, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white w-80"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-cyan-600">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading admin data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={refreshAll} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-800 min-h-screen p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-3">NGOs & Subdomains</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ngos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedNGO === ngo.id 
                        ? 'bg-cyan-900/50 border border-cyan-700' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedNGO(ngo.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{ngo.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{ngo.name}</div>
                        <div className="text-sm text-gray-400 truncate">{ngo.sector || 'Uncategorized'}</div>
                        <div className="text-xs text-cyan-400 font-mono">
                          {ngo.slug ? `${ngo.slug}.beamthinktank.space` : 'No subdomain'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total NGOs:</span>
                  <span className="text-white font-medium">{ngos.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Subdomains:</span>
                  <span className="text-cyan-400 font-medium">
                    {ngos.filter(ngo => ngo.slug).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Users:</span>
                  <span className="text-white font-medium">{users.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedNGO === 'all' ? 'All Organizations' : 
                    ngos.find(ngo => ngo.id === selectedNGO)?.name}
                </h2>
                <p className="text-gray-400">
                  Manage NGOs, track donations, and monitor system activity
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add NGO
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
                <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="ngos" className="data-[state=active]:bg-cyan-600">
                  NGOs
                </TabsTrigger>
                <TabsTrigger value="donations" className="data-[state=active]:bg-cyan-600">
                  Donations
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600">
                  Users
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-cyan-600">
                  Events
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total NGOs</CardTitle>
                      <Building2 className="h-4 w-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats?.total_ngos || 0}</div>
                      <p className="text-xs text-gray-400">Across all sectors</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Active Subdomains</CardTitle>
                      <Activity className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {stats?.active_subdomains || 0}
                      </div>
                      <p className="text-xs text-gray-400">Deployed websites</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Donations</CardTitle>
                      <DollarSign className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        ${(stats?.total_donations || 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-400">This month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {stats?.total_users || 0}
                      </div>
                      <p className="text-xs text-gray-400">Community members</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {events.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              event.severity === 'error' ? 'bg-red-400' :
                              event.severity === 'warning' ? 'bg-yellow-400' :
                              event.severity === 'success' ? 'bg-green-400' :
                              'bg-cyan-400'
                            }`}></div>
                            <div className="flex-1">
                              <div className="text-sm text-white">{event.type}</div>
                              <div className="text-xs text-gray-400">{event.ngo}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Top Performing NGOs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ngos.slice(0, 5).map((ngo, index) => (
                          <div key={ngo.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-lg">{ngo.icon}</div>
                              <div>
                                <div className="text-sm font-medium text-white">{ngo.name}</div>
                                <div className="text-xs text-gray-400">{ngo.sector}</div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              #{index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* NGOs Tab */}
              <TabsContent value="ngos" className="mt-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">NGO Management</CardTitle>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New NGO
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-3 text-gray-400 font-medium">NGO</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Sector</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Subdomain</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredNGOs.map((ngo) => (
                            <tr key={ngo.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">{ngo.icon}</div>
                                  <div>
                                    <div className="font-medium text-white">{ngo.name}</div>
                                    <div className="text-sm text-gray-400">{ngo.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                  {ngo.sector}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge 
                                  variant="secondary" 
                                                                  className={
                                  ngo.status === 'active' ? 'bg-green-900 text-green-300' :
                                  ngo.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                                  'bg-gray-900 text-gray-300'
                                }
                                >
                                  {ngo.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {ngo.website ? (
                                  <a 
                                    href={ngo.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                                  >
                                    {new URL(ngo.website).hostname}
                                  </a>
                                ) : (
                                  <span className="text-gray-500 text-sm">No subdomain</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donations Tab */}
              <TabsContent value="donations" className="mt-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Donation Tracking</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-3 text-gray-400 font-medium">Donation</th>
                            <th className="text-left p-3 text-gray-400 font-medium">NGO</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Donor</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Date</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((donation) => (
                            <tr key={donation.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="p-3">
                                <div className="text-lg font-bold text-white">
                                  ${donation.amount.toLocaleString()}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-white">{donation.ngo}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-gray-300">{donation.donor}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-gray-400">{donation.date}</div>
                              </td>
                              <td className="p-3">
                                <Badge 
                                  variant="secondary" 
                                  className={
                                    donation.status === 'completed' ? 'bg-green-900 text-green-300' :
                                    'bg-yellow-900 text-yellow-300'
                                  }
                                >
                                  {donation.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="mt-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">User Management</CardTitle>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-3 text-gray-400 font-medium">User</th>
                            <th className="text-left p-3 text-gray-400 font-medium">NGO</th>
                            <th className="text-left p-3 text-gray-400 font-medium">City</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Role</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback className="bg-gray-600">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-white">{user.name}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-gray-300">{user.ngo}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-gray-400">{user.city}</div>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge 
                                  variant="secondary" 
                                  className={
                                    user.status === 'active' ? 'bg-green-900 text-green-300' :
                                    'bg-red-900 text-red-300'
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="mt-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Event Logs</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter Events
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Download className="h-4 w-4 mr-2" />
                          Export Logs
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`font-mono text-xs ${
                                    event.severity === 'error' ? 'bg-red-900 text-red-300' :
                                    event.severity === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                                    event.severity === 'success' ? 'bg-green-900 text-green-300' :
                                    'bg-cyan-900 text-cyan-300'
                                  }`}
                                >
                                  {event.type}
                                </Badge>
                                <span className="text-sm text-gray-400">{event.ngo}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    event.processed ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                  }`}
                                >
                                  {event.processed ? 'Processed' : 'Pending'}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-300">
                                {JSON.stringify(event.data, null, 2)}
                              </div>
                              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                <span>Source: {event.source}</span>
                                <span>Severity: {event.severity}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 ml-4">
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
