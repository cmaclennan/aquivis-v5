import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

// POST /api/services/:id/water-tests - Add a water test to a service
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createServerClient(false, req);
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('water_tests')
      .insert({
        service_id: params.id,
        ph: body.ph,
        chlorine: body.chlorine,
        bromine: body.bromine,
        alkalinity: body.alkalinity,
        calcium: body.calcium,
        cyanuric: body.cyanuric,
        salt: body.salt,
        turbidity: body.turbidity,
        temperature: body.temperature,
        notes: body.notes,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating water test:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
