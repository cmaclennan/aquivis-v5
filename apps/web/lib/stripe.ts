// Stripe client configuration

import Stripe from 'stripe';

// Client-side Stripe (publishable key)
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// Server-side Stripe (secret key)
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    });
  }
  return stripeClient;
}

// Subscription tiers configuration
export interface SubscriptionTier {
  id: string;
  name: string;
  priceId: string; // Stripe Price ID
  amount: number;
  currency: string;
  features: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceId: 'price_1SNhKRF5cJQ9rWgykcAvYgty',
    amount: 2900, // $29.00 in cents
    currency: 'usd',
    features: [
      'Up to 10 properties',
      'Basic task management',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    priceId: 'price_1SNhKSF5cJQ9rWgyHadfBYSk',
    amount: 7900, // $79.00 in cents
    currency: 'usd',
    features: [
      'Up to 50 properties',
      'Advanced task management',
      'Team collaboration',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    priceId: 'price_1SNhKTF5cJQ9rWgyHHp1CsFQ',
    amount: 17900, // $179.00 in cents
    currency: 'usd',
    features: [
      'Unlimited properties',
      'Advanced reporting',
      'Custom integrations',
      'Dedicated support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceId: 'price_enterprise_custom', // Custom pricing - contact sales
    amount: 0, // Custom pricing
    currency: 'usd',
    features: [
      'Everything in Business',
      'Custom features',
      'SLA guarantee',
      'Account manager',
    ],
  },
];

// Helper to create checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  companyId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    metadata: {
      company_id: companyId,
    },
  });

  return session;
}

// Helper to create customer portal session
export async function createPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return session;
}

