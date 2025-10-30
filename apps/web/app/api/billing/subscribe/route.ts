import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = await createServerClient(false, req);

    // Get user's company and stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    if (!profile?.company_id) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

    const { data: company } = await supabase
      .from('companies')
      .select('id, name, stripe_customer_id')
      .eq('id', profile.company_id)
      .single();

    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

    const stripe = getStripeClient();

    // Ensure Stripe customer exists
    let customerId = company.stripe_customer_id as string | null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: company.name || undefined,
        metadata: { company_id: company.id },
      });
      customerId = customer.id;
      await supabase
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', company.id);
    }

    // Create checkout session
    const sessionCheckout = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: { company_id: company.id },
    });

    return NextResponse.json({ url: sessionCheckout.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

