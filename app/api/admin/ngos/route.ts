import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ngoSectors } from '@/lib/ngo-data';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    // Fetch NGOs from Supabase
    const { data: ngos, error } = await supabaseAdmin
      .from('ngos')
      .select('*')
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch NGOs from database' },
        { status: 500 }
      );
    }

    // Add computed fields for admin display
    const ngosWithMetadata = ngos.map(ngo => ({
      ...ngo,
      subdomain_status: ngo.website ? 'active' : 'inactive',
      deployment_status: ngo.website ? 'deployed' : 'not_deployed',
      readyaimgo_integration: !!ngo.readyaimgo_link,
    }));

    // Get unique sectors for filtering
    const sectors = [...new Set(ngos.map(ngo => ngo.sector).filter(Boolean))];

    return NextResponse.json({
      success: true,
      data: ngosWithMetadata,
      total: ngosWithMetadata.length,
      sectors,
    });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch NGO data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingNGO } = await supabaseAdmin
      .from('ngos')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingNGO) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Prepare NGO data for insertion
    const ngoData = {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      icon: body.icon || null,
      color: body.color || null,
      sector: body.sector || null,
      focus: body.focus || null,
      status: body.status || 'active',
      website: body.website || null,
      readyaimgo_link: body.readyaimgo_link || null,
      webhook_url: body.webhook_url || null,
    };

    // Insert into Supabase
    const { data: newNGO, error } = await supabaseAdmin
      .from('ngos')
      .insert(ngoData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create NGO in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newNGO,
      message: 'NGO created successfully',
    });
  } catch (error) {
    console.error('Error creating NGO:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create NGO' },
      { status: 500 }
    );
  }
}
