import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = await createServerClient(false, req);

    // Get user's company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

    const { data: company } = await supabase
      .from('companies')
      .select('id, stripe_customer_id')
      .eq('id', profile.company_id)
      .single();

    if (!company?.stripe_customer_id) return NextResponse.json({ error: 'No Stripe customer' }, { status: 400 });

    const stripe = getStripeClient();
    const portal = await stripe.billingPortal.sessions.create({
      customer: company.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error('Error creating portal session:', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}

