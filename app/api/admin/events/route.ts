import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Mock event data - replace with real Supabase queries
const mockEvents = [
  { 
    id: 1, 
    type: 'donation.created', 
    ngo: 'BEAM Federal Credit Union', 
    data: { amount: 5000, donor: 'Anonymous', transaction_id: 'txn_001' }, 
    timestamp: '2024-01-15T10:30:00Z',
    severity: 'info',
    source: 'webhook',
    processed: true
  },
  { 
    id: 2, 
    type: 'milestone.reached', 
    ngo: 'BEAM Health Foundation', 
    data: { milestone: '1000 patients served', impact_score: 85 }, 
    timestamp: '2024-01-14T15:45:00Z',
    severity: 'success',
    source: 'system',
    processed: true
  },
  { 
    id: 3, 
    type: 'user.registered', 
    ngo: 'BEAM Education Network', 
    data: { user: 'New Member', email: 'newmember@example.com' }, 
    timestamp: '2024-01-13T09:15:00Z',
    severity: 'info',
    source: 'api',
    processed: true
  },
  { 
    id: 4, 
    type: 'ngo.status_changed', 
    ngo: 'BEAM Trade & Commerce Authority', 
    data: { old_status: 'Emerging Partner', new_status: 'Strategic Partner' }, 
    timestamp: '2024-01-12T14:20:00Z',
    severity: 'warning',
    source: 'admin',
    processed: true
  },
  { 
    id: 5, 
    type: 'payment.failed', 
    ngo: 'BEAM Cooperative Development Network', 
    data: { amount: 1000, donor: 'John Smith', error: 'Insufficient funds' }, 
    timestamp: '2024-01-11T11:10:00Z',
    severity: 'error',
    source: 'payment_processor',
    processed: false
  },
  { 
    id: 6, 
    type: 'subdomain.deployed', 
    ngo: 'BEAM Pharmaceuticals Network', 
    data: { domain: 'pharma.beam.org', deployment_url: 'https://vercel.com/deploy' }, 
    timestamp: '2024-01-10T16:30:00Z',
    severity: 'success',
    source: 'vercel',
    processed: true
  },
  { 
    id: 7, 
    type: 'webhook.error', 
    ngo: 'BEAM Federal Credit Union', 
    data: { endpoint: '/webhooks/donations', error: 'Timeout after 30s' }, 
    timestamp: '2024-01-09T13:45:00Z',
    severity: 'error',
    source: 'webhook',
    processed: false
  },
  { 
    id: 8, 
    type: 'integration.sync', 
    ngo: 'BEAM Health Foundation', 
    data: { service: 'readyaimgo.biz', records_synced: 150, errors: 0 }, 
    timestamp: '2024-01-09T09:00:00Z',
    severity: 'info',
    source: 'cron',
    processed: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ngo = searchParams.get('ngo');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const source = searchParams.get('source');
    const processed = searchParams.get('processed');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let filteredEvents = [...mockEvents];

    // Apply filters
    if (ngo && ngo !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.ngo === ngo);
    }
    if (type && type !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    if (severity && severity !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }
    if (source && source !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.source === source);
    }
    if (processed !== null && processed !== undefined) {
      const isProcessed = processed === 'true';
      filteredEvents = filteredEvents.filter(event => event.processed === isProcessed);
    }
    if (startDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= startDate);
    }
    if (endDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp <= endDate);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate summary statistics
    const totalEvents = filteredEvents.length;
    const errorEvents = filteredEvents.filter(e => e.severity === 'error').length;
    const warningEvents = filteredEvents.filter(e => e.severity === 'warning').length;
    const unprocessedEvents = filteredEvents.filter(e => !e.processed).length;

    // Get unique values for filter options
    const ngos = [...new Set(mockEvents.map(event => event.ngo))];
    const types = [...new Set(mockEvents.map(event => event.type))];
    const severities = [...new Set(mockEvents.map(event => event.severity))];
    const sources = [...new Set(mockEvents.map(event => event.source))];

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: totalEvents,
      summary: {
        total_events: totalEvents,
        error_events: errorEvents,
        warning_events: warningEvents,
        unprocessed_events: unprocessedEvents
      },
      filters: {
        ngos,
        types,
        severities,
        sources
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.ngo) {
      return NextResponse.json(
        { success: false, error: 'Type and NGO are required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would save to Supabase here
    const newEvent = {
      id: Date.now(),
      type: body.type,
      ngo: body.ngo,
      data: body.data || {},
      timestamp: body.timestamp || new Date().toISOString(),
      severity: body.severity || 'info',
      source: body.source || 'system',
      processed: false
    };

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event logged successfully',
    });
  } catch (error) {
    console.error('Error logging event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log event' },
      { status: 500 }
    );
  }
}
