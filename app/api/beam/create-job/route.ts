import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface BeamRole {
  id?: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  payRange: string;
  deadline: string;
  location?: string;
  workstream: string;
  visibility: 'Public' | 'BEAM Members';
  tags: string[];
  mediaUrl?: string;
}

export async function POST(req: NextRequest) {
  // 1. Authentication
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.error('Supabase service role key is not set.');
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${serviceRoleKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Payload Parsing and Validation
  let body: BeamRole;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Malformed JSON body.' }, { status: 400 });
  }

  const { clientId, title, description, category, skills, payRange, deadline, workstream, visibility, tags } = body;

  if (!clientId || !title || !description || !category || !skills || !payRange || !deadline || !workstream || !visibility || !tags) {
    return NextResponse.json({ 
      error: 'Missing required fields.',
      details: {
        clientId: !!clientId,
        title: !!title,
        description: !!description,
        category: !!category,
        skills: !!skills,
        payRange: !!payRange,
        deadline: !!deadline,
        workstream: !!workstream,
        visibility: !!visibility,
        tags: !!tags
      }
    }, { status: 400 });
  }

  // 3. Supabase Insert
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not available.' }, { status: 500 });
  }

  const roleToInsert = {
    ...body,
    status: 'live' as const,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('beam_roles')
    .insert(roleToInsert)
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to create job role.', details: error.message }, { status: 500 });
  }

  // 4. Success Response
  return NextResponse.json({ message: 'Job created successfully', id: data.id }, { status: 200 });
} 