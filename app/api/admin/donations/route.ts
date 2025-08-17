import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Mock donation data - replace with real Supabase queries
const mockDonations = [
  { 
    id: 1, 
    ngo: 'BEAM Federal Credit Union', 
    amount: 5000, 
    donor: 'Anonymous', 
    donor_email: 'anonymous@example.com',
    date: '2024-01-15', 
    status: 'completed',
    payment_method: 'credit_card',
    transaction_id: 'txn_001',
    created_at: '2024-01-15T10:30:00Z'
  },
  { 
    id: 2, 
    ngo: 'BEAM Health Foundation', 
    amount: 2500, 
    donor: 'John Doe', 
    donor_email: 'john.doe@example.com',
    date: '2024-01-14', 
    status: 'pending',
    payment_method: 'bank_transfer',
    transaction_id: 'txn_002',
    created_at: '2024-01-14T15:45:00Z'
  },
  { 
    id: 3, 
    ngo: 'BEAM Education Network', 
    amount: 10000, 
    donor: 'Corporate Sponsor', 
    donor_email: 'sponsor@corp.com',
    date: '2024-01-13', 
    status: 'completed',
    payment_method: 'wire_transfer',
    transaction_id: 'txn_003',
    created_at: '2024-01-13T09:15:00Z'
  },
  { 
    id: 4, 
    ngo: 'BEAM Cooperative Development Network', 
    amount: 7500, 
    donor: 'Sarah Wilson', 
    donor_email: 'sarah.wilson@example.com',
    date: '2024-01-12', 
    status: 'completed',
    payment_method: 'credit_card',
    transaction_id: 'txn_004',
    created_at: '2024-01-12T14:20:00Z'
  },
  { 
    id: 5, 
    ngo: 'BEAM Pharmaceuticals Network', 
    amount: 15000, 
    donor: 'Research Foundation', 
    donor_email: 'research@foundation.org',
    date: '2024-01-11', 
    status: 'completed',
    payment_method: 'check',
    transaction_id: 'txn_005',
    created_at: '2024-01-11T11:10:00Z'
  },
  { 
    id: 6, 
    ngo: 'BEAM Trade & Commerce Authority', 
    amount: 3000, 
    donor: 'Local Business Association', 
    donor_email: 'info@localbusiness.org',
    date: '2024-01-10', 
    status: 'pending',
    payment_method: 'bank_transfer',
    transaction_id: 'txn_006',
    created_at: '2024-01-10T16:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ngo = searchParams.get('ngo');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const minAmount = searchParams.get('min_amount');
    const maxAmount = searchParams.get('max_amount');

    let filteredDonations = [...mockDonations];

    // Apply filters
    if (ngo && ngo !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.ngo === ngo);
    }
    if (status && status !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.status === status);
    }
    if (startDate) {
      filteredDonations = filteredDonations.filter(donation => donation.date >= startDate);
    }
    if (endDate) {
      filteredDonations = filteredDonations.filter(donation => donation.date <= endDate);
    }
    if (minAmount) {
      filteredDonations = filteredDonations.filter(donation => donation.amount >= parseInt(minAmount));
    }
    if (maxAmount) {
      filteredDonations = filteredDonations.filter(donation => donation.amount <= parseInt(maxAmount));
    }

    // Calculate summary statistics
    const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
    const completedAmount = filteredDonations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);
    const pendingAmount = filteredDonations
      .filter(d => d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);

    // Get unique values for filter options
    const ngos = [...new Set(mockDonations.map(donation => donation.ngo))];
    const statuses = [...new Set(mockDonations.map(donation => donation.status))];
    const paymentMethods = [...new Set(mockDonations.map(donation => donation.payment_method))];

    return NextResponse.json({
      success: true,
      data: filteredDonations,
      total: filteredDonations.length,
      summary: {
        total_amount: totalAmount,
        completed_amount: completedAmount,
        pending_amount: pendingAmount,
        average_donation: totalAmount / filteredDonations.length || 0
      },
      filters: {
        ngos,
        statuses,
        payment_methods: paymentMethods
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donation data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.ngo || !body.amount || !body.donor) {
      return NextResponse.json(
        { success: false, error: 'NGO, amount, and donor are required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would save to Supabase here
    const newDonation = {
      id: Date.now(),
      ngo: body.ngo,
      amount: parseInt(body.amount),
      donor: body.donor,
      donor_email: body.donor_email || '',
      date: body.date || new Date().toISOString().split('T')[0],
      status: 'pending',
      payment_method: body.payment_method || 'credit_card',
      transaction_id: `txn_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newDonation,
      message: 'Donation recorded successfully',
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record donation' },
      { status: 500 }
    );
  }
}
