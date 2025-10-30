import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// POST /api/services/:id/chemicals - Add a chemical addition to a service
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('chemical_additions')
      .insert({
        service_id: params.id,
        chemical_type: body.chemical_type,
        quantity: body.quantity,
        unit_of_measure: body.unit_of_measure,
        cost: body.cost,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating chemical addition:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
