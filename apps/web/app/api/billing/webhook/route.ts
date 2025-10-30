import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set');
  }

  if (!webhookSecret || !sig) {
    return new NextResponse('Missing webhook signature/secret', { status: 400 });
  }

  let event: any;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return new NextResponse('Bad signature', { status: 400 });
  }

  try {
    const supabase = await createServerClient(true);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const companyId = session.metadata?.company_id;
        if (companyId) {
          await supabase
            .from('companies')
            .update({ subscription_status: 'active' })
            .eq('id', companyId);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        if (customerId) {
          const { data: companies } = await supabase
            .from('companies')
            .select('id')
            .eq('stripe_customer_id', customerId);
          if (companies && companies.length > 0) {
            await supabase
              .from('companies')
              .update({ subscription_status: subscription.status })
              .eq('id', companies[0].id);
          }
        }
        break;
      }
      default:
        // Ignore other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error handling Stripe webhook:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

