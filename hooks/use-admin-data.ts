import { useState, useEffect } from 'react';

// Types for admin data - Updated to match Supabase schema
export interface AdminNGO {
  id: string;                    // UUID primary key
  name: string;                  // NGO display name (required)
  slug: string;                  // Short slug for subdomain (unique and required)
  description: string | null;    // Long-form description
  icon: string | null;           // Icon filename or Tailwind icon class
  color: string | null;          // Hex or Tailwind color
  sector: string | null;         // Category (e.g., "Arts & Culture", "Finance")
  focus: string[] | null;        // Array of focus areas/tags
  status: 'active' | 'paused' | 'archived'; // Defaults to 'active'
  website: string | null;        // External link or subdomain link
  readyaimgo_link: string | null; // Connection to ReadyAimGo
  webhook_url: string | null;    // Stripe webhook endpoint (if needed)
  created_at: string;            // Timestamp with timezone
  updated_at: string;            // Timestamp with timezone, updates automatically
  
  // Computed fields for admin display
  subdomain_status?: 'active' | 'inactive';
  deployment_status?: 'deployed' | 'not_deployed';
  readyaimgo_integration?: boolean;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  ngo: string;
  city: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  last_login: string | null;
}

export interface AdminDonation {
  id: number;
  ngo: string;
  amount: number;
  donor: string;
  donor_email: string;
  date: string;
  status: 'completed' | 'pending';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface AdminEvent {
  id: number;
  type: string;
  ngo: string;
  data: any;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  source: string;
  processed: boolean;
}

export interface AdminFilters {
  ngo?: string;
  city?: string;
  status?: string;
  role?: string;
  type?: string;
  severity?: string;
  source?: string;
  processed?: boolean;
  start_date?: string;
  end_date?: string;
  min_amount?: string;
  max_amount?: string;
}

export interface AdminStats {
  total_ngos: number;
  active_subdomains: number;
  total_users: number;
  total_donations: number;
  completed_donations: number;
  pending_donations: number;
  total_events: number;
  error_events: number;
  warning_events: number;
  unprocessed_events: number;
}

// Hook for managing admin data
export function useAdminData() {
  const [ngos, setNgos] = useState<AdminNGO[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch NGOs
  const fetchNGOs = async () => {
    try {
      const response = await fetch('/api/admin/ngos');
      const data = await response.json();
      if (data.success) {
        setNgos(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch NGOs');
    }
  };

  // Fetch Users
  const fetchUsers = async (filters?: AdminFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters?.ngo) params.append('ngo', filters.ngo);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.role) params.append('role', filters.role);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  // Fetch Donations
  const fetchDonations = async (filters?: AdminFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters?.ngo) params.append('ngo', filters.ngo);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      if (filters?.min_amount) params.append('min_amount', filters.min_amount);
      if (filters?.max_amount) params.append('max_amount', filters.max_amount);

      const response = await fetch(`/api/admin/donations?${params}`);
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch donations');
    }
  };

  // Fetch Events
  const fetchEvents = async (filters?: AdminFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters?.ngo) params.append('ngo', filters.ngo);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.source) params.append('source', filters.source);
      if (filters?.processed !== undefined) params.append('processed', filters.processed.toString());
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const response = await fetch(`/api/admin/events?${params}`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  // Create new NGO
  const createNGO = async (ngoData: Partial<AdminNGO>) => {
    try {
      const response = await fetch('/api/admin/ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ngoData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchNGOs(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create NGO');
      throw err;
    }
  };

  // Create new User
  const createUser = async (userData: Partial<AdminUser>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchUsers(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  };

  // Create new Donation
  const createDonation = async (donationData: Partial<AdminDonation>) => {
    try {
      const response = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchDonations(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create donation');
      throw err;
    }
  };

  // Create new Event
  const createEvent = async (eventData: Partial<AdminEvent>) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchEvents(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  // Calculate stats from current data
  const calculateStats = (): AdminStats => {
    const total_ngos = ngos.length;
    const active_subdomains = ngos.filter(ngo => ngo.slug).length;
    const total_users = users.length;
    const total_donations = donations.reduce((sum, d) => sum + d.amount, 0);
    const completed_donations = donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
    const pending_donations = donations.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
    const total_events = events.length;
    const error_events = events.filter(e => e.severity === 'error').length;
    const warning_events = events.filter(e => e.severity === 'warning').length;
    const unprocessed_events = events.filter(e => !e.processed).length;

    return {
      total_ngos,
      active_subdomains,
      total_users,
      total_donations,
      completed_donations,
      pending_donations,
      total_events,
      error_events,
      warning_events,
      unprocessed_events,
    };
  };

  // Refresh all data
  const refreshAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchNGOs(),
        fetchUsers(),
        fetchDonations(),
        fetchEvents(),
      ]);
      setError(null);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    if (ngos.length > 0 || users.length > 0 || donations.length > 0 || events.length > 0) {
      setStats(calculateStats());
    }
  }, [ngos, users, donations, events]);

  return {
    // Data
    ngos,
    users,
    donations,
    events,
    stats,
    
    // State
    loading,
    error,
    
    // Actions
    fetchNGOs,
    fetchUsers,
    fetchDonations,
    fetchEvents,
    createNGO,
    createUser,
    createDonation,
    createEvent,
    refreshAll,
    
    // Utilities
    setError,
  };
}
