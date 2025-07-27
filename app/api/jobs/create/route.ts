import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const JobSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pod_type: z.string(),
  client_name: z.string().optional(),
  website_url: z.string().optional(),
  priority: z.string().optional(),
  pay: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  details: z.string().optional(),
  deadline: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: 'Supabase admin client not available.' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformed JSON body.' }, { status: 400 });
  }

  const parsed = JobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors }, { status: 400 });
  }

  const {
    title,
    description,
    tags,
    pod_type,
    client_name,
    website_url,
    priority,
    pay,
    category,
    type,
    details,
    deadline
  } = parsed.data;

  // Try to resolve pod_type_id by slug or name
  let podTypeRecord = null;
  let podTypeError = null;
  {
    const { data, error } = await supabaseAdmin
      .from('pod_types')
      .select('id')
      .or(`slug.eq.${pod_type},name.eq.${pod_type}`)
      .single();
    podTypeRecord = data;
    podTypeError = error;
  }

  if (podTypeError || !podTypeRecord) {
    return NextResponse.json({ success: false, error: 'Invalid pod_type' }, { status: 400 });
  }

  const jobToInsert = {
    title,
    description,
    tags,
    client_name,
    website_url,
    pay,
    category,
    type,
    details,
    deadline,
    created_at: new Date().toISOString(),
    pod_type_id: podTypeRecord.id,
    status: 'draft',
    source: 'ReadyAimGo',
    priority,
  };

  const { data: insertedJob, error: insertError } = await supabaseAdmin
    .from('jobs')
    .insert([jobToInsert])
    .select('id')
    .single();

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, job_id: insertedJob.id });
} 