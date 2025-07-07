import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) {
    console.error("❌ Supabase admin client not available");
    return NextResponse.json({ error: 'Supabase admin client not available.' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('type', 'public') // or use .ilike('type', 'public') to be safe
      .order('deadline', { ascending: true });

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return NextResponse.json({ error: 'Failed to fetch jobs', details: error.message }, { status: 500 });
    }

    console.log("✅ Jobs fetched:", data); // Add logging
    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message || err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
