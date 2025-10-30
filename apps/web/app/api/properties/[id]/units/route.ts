import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// POST /api/properties/:id/units - Create a unit for a property
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('units')
      .insert({
        property_id: params.id,
        name: body.name,
        unit_type: body.unit_type,
        water_type: body.water_type,
        volume_litres: body.volume_litres,
        is_active: body.is_active ?? true,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating unit:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
