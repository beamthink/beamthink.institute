import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest, context: { params: { projectId: string } }) {
  const { projectId } = context.params;
  const { data, error } = await supabase
    .from('project_publications')
    .select('*')
    .eq('project_id', projectId)
    .order('released_at', { ascending: false });
  if (error) {
    console.error('Error fetching project publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
  return NextResponse.json(data);
} 