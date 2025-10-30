import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// GET /api/services - List services with optional filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const unitId = searchParams.get('unitId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    
    const supabase = await createServerClient(false, req);
    
    let query = supabase
      .from('services')
      .select('*, properties(name), units(name), profiles:technician_id(first_name, last_name)')
      .order('service_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    if (unitId) {
      query = query.eq('unit_id', unitId);
    }
    
    if (date) {
      query = query.eq('service_date', date);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/services - Create a new service
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        property_id: body.property_id,
        unit_id: body.unit_id,
        technician_id: body.technician_id,
        service_date: body.service_date,
        status: body.status || 'scheduled',
        notes: body.notes,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

