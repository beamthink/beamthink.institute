import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Mock user data - replace with real Supabase queries
const mockUsers = [
  { 
    id: 1, 
    name: 'Alice Johnson', 
    email: 'alice@beam.org', 
    ngo: 'BEAM Health Foundation', 
    city: 'Portland', 
    role: 'Volunteer', 
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-01-15T10:30:00Z'
  },
  { 
    id: 2, 
    name: 'Bob Smith', 
    email: 'bob@beam.org', 
    ngo: 'BEAM Federal Credit Union', 
    city: 'Seattle', 
    role: 'Member', 
    status: 'active',
    created_at: '2024-01-02T00:00:00Z',
    last_login: '2024-01-14T15:45:00Z'
  },
  { 
    id: 3, 
    name: 'Carol Davis', 
    email: 'carol@beam.org', 
    ngo: 'BEAM Education Network', 
    city: 'San Francisco', 
    role: 'Staff', 
    status: 'inactive',
    created_at: '2024-01-03T00:00:00Z',
    last_login: '2024-01-10T09:15:00Z'
  },
  { 
    id: 4, 
    name: 'David Wilson', 
    email: 'david@beam.org', 
    ngo: 'BEAM Cooperative Development Network', 
    city: 'Austin', 
    role: 'Board Member', 
    status: 'active',
    created_at: '2024-01-04T00:00:00Z',
    last_login: '2024-01-15T14:20:00Z'
  },
  { 
    id: 5, 
    name: 'Eva Martinez', 
    email: 'eva@beam.org', 
    ngo: 'BEAM Pharmaceuticals Network', 
    city: 'Boston', 
    role: 'Researcher', 
    status: 'active',
    created_at: '2024-01-05T00:00:00Z',
    last_login: '2024-01-15T11:10:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ngo = searchParams.get('ngo');
    const city = searchParams.get('city');
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (ngo && ngo !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.ngo === ngo);
    }
    if (city && city !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.city === city);
    }
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Get unique values for filter options
    const ngos = [...new Set(mockUsers.map(user => user.ngo))];
    const cities = [...new Set(mockUsers.map(user => user.city))];
    const roles = [...new Set(mockUsers.map(user => user.role))];
    const statuses = [...new Set(mockUsers.map(user => user.status))];

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
      filters: {
        ngos,
        cities,
        roles,
        statuses
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.ngo) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and NGO are required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would save to Supabase here
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      ngo: body.ngo,
      city: body.city || 'Unknown',
      role: body.role || 'Member',
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: null
    };

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
