import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// GET /api/tasks - List scheduled tasks with optional filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date');
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    
    const supabase = await createServerClient(false, req);
    
    let query = supabase
      .from('scheduled_tasks')
      .select('*, properties(name), units(name)')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });
    
    if (date) {
      query = query.eq('date', date);
    }
    
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

