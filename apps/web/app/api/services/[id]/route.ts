import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// GET /api/services/:id - Get a single service with details
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        properties(name, address),
        units(name, unit_type),
        profiles:technician_id(first_name, last_name),
        water_tests(*),
        chemical_additions(*),
        maintenance_tasks(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/services/:id - Update a service
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('services')
      .update({
        property_id: body.property_id,
        unit_id: body.unit_id,
        technician_id: body.technician_id,
        service_date: body.service_date,
        status: body.status,
        notes: body.notes,
      })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
