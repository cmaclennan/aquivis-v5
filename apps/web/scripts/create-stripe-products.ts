/**
 * Script to create Stripe Products and Prices for Aquivis subscription tiers
 * Run with: npx tsx scripts/create-stripe-products.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function createStripeProducts() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.log('❌ STRIPE_SECRET_KEY not set');
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
    typescript: true,
  });

  console.log('\n🏗️  Creating Stripe Products and Prices...\n');

  const tiers = [
    {
      id: 'starter',
      name: 'Starter',
      amount: 2900,
      description: 'Perfect for small businesses getting started with pool service management',
      features: [
        'Up to 10 properties',
        'Basic task management',
        'Email support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      amount: 7900,
      description: 'Advanced features for growing pool service companies',
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
      amount: 17900,
      description: 'Complete solution for established pool service businesses',
      features: [
        'Unlimited properties',
        'Advanced reporting',
        'Custom integrations',
        'Dedicated support',
      ],
    },
  ];

  const results: Array<{ id: string; name: string; priceId: string }> = [];

  for (const tier of tiers) {
    try {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `name:'${tier.name}' AND active:'true'`,
      });

      let product: Stripe.Product;
      if (existingProducts.data.length > 0) {
        console.log(`✅ Product "${tier.name}" already exists: ${existingProducts.data[0].id}`);
        product = existingProducts.data[0];
      } else {
        // Create product
        product = await stripe.products.create({
          name: tier.name,
          description: tier.description,
          metadata: {
            tier_id: tier.id,
          },
        });
        console.log(`✅ Created product "${tier.name}": ${product.id}`);
      }

      // Check if price already exists for this product
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      let price: Stripe.Price;
      const matchingPrice = existingPrices.data.find(
        (p) => p.unit_amount === tier.amount && p.currency === 'usd' && p.recurring?.interval === 'month'
      );

      if (matchingPrice) {
        console.log(`✅ Price for "${tier.name}" already exists: ${matchingPrice.id}`);
        price = matchingPrice;
      } else {
        // Create price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: tier.amount,
          currency: 'usd',
          recurring: {
            interval: 'month',
          },
          metadata: {
            tier_id: tier.id,
          },
        });
        console.log(`✅ Created price for "${tier.name}": ${price.id} ($${(tier.amount / 100).toFixed(2)}/month)`);
      }

      results.push({
        id: tier.id,
        name: tier.name,
        priceId: price.id,
      });
    } catch (error: any) {
      console.error(`❌ Error creating tier "${tier.name}":`, error.message);
    }
  }

  // Enterprise tier - no product/price needed (custom pricing)
  results.push({
    id: 'enterprise',
    name: 'Enterprise',
    priceId: 'price_enterprise_custom', // Enterprise uses custom pricing, no actual Stripe price
  });

  console.log('\n📋 Results:\n');
  results.forEach((r) => {
    console.log(`${r.id}: ${r.priceId}`);
  });

  console.log('\n💡 Update apps/web/lib/stripe.ts with these Price IDs\n');
}

createStripeProducts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

