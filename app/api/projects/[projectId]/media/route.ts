import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 });
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `project-media/${projectId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
    const fileUrl = publicUrlData?.publicUrl;

    // Insert row into project_media table
    const { data: mediaRow, error: dbError } = await supabase
      .from('project_media')
      .insert([
        {
          project_id: projectId,
          file_url: fileUrl,
          title,
          description,
        },
      ])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(mediaRow, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: { projectId: string } }) {
  const { projectId } = context.params;

  const { data, error } = await supabase
    .from('project_media')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }

  return NextResponse.json(data);
} 