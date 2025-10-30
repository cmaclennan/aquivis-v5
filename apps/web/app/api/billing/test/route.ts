import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

/**
 * Test endpoint to verify Stripe connection
 * GET /api/billing/test
 */
export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;

    if (!hasSecretKey) {
      return NextResponse.json(
        {
          connected: false,
          error: 'STRIPE_SECRET_KEY not configured',
          env: {
            publishableKey: hasPublishableKey,
            secretKey: hasSecretKey,
            webhookSecret: hasWebhookSecret,
          },
        },
        { status: 400 }
      );
    }

    // Try to create Stripe client and make a test API call
    const stripe = getStripeClient();
    
    // Verify API connection by fetching account details
    const account = await stripe.balance.retrieve();

    return NextResponse.json({
      connected: true,
      account: {
        available: account.available.length > 0,
        currency: account.available[0]?.currency || 'N/A',
      },
      env: {
        publishableKey: hasPublishableKey,
        secretKey: hasSecretKey,
        webhookSecret: hasWebhookSecret,
      },
      apiVersion: '2025-09-30.clover',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        error: err.message,
        type: err.type,
        code: err.code,
      },
      { status: 500 }
    );
  }
}
