import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';
import { companyUpdateSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = companyUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Get user's company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check permissions (owner or manager only)
    if (profile.role !== 'owner' && profile.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only owners and managers can update company settings' },
        { status: 403 }
      );
    }

    // Update company with audit trail
    const { data: updatedCompany, error } = await supabase
      .from('companies')
      .update({
        name: validation.data.name,
        timezone: validation.data.timezone,
        business_address: validation.data.business_address || null,
        business_address_street: validation.data.business_address_street || null,
        business_address_city: validation.data.business_address_city || null,
        business_address_state: validation.data.business_address_state || null,
        business_address_postal_code: validation.data.business_address_postal_code || null,
        business_address_country: validation.data.business_address_country || null,
        phone: validation.data.phone || null,
        website: validation.data.website || null,
        tax_id: validation.data.tax_id || null,
        updated_by: user.id,
      })
      .eq('id', profile.company_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: error.message || 'Failed to update company' },
        { status: 500 }
      );
    }

    if (!updatedCompany) {
      console.error('Update succeeded but no data returned');
      return NextResponse.json(
        { error: 'Update completed but no data returned. Check RLS policies.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCompany });
  } catch (err) {
    console.error('Error in company update:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

