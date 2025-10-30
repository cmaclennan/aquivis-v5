import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// POST /api/services/:id/maintenance - Add a maintenance task to a service
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert({
        service_id: params.id,
        task_type: body.task_type,
        completed: body.completed || false,
        notes: body.notes,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating maintenance task:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
