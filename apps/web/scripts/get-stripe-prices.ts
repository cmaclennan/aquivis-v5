/**
 * Script to list Stripe Products and their Prices
 * Run with: npx tsx scripts/get-stripe-prices.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function getStripePrices() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.log('❌ STRIPE_SECRET_KEY not set');
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
    typescript: true,
  });

  console.log('\n📦 Fetching Stripe Products and Prices...\n');

  const products = await stripe.products.list({ limit: 100, active: true });
  const prices = await stripe.prices.list({ limit: 100, active: true });

  // Group prices by product
  const pricesByProduct = new Map<string, Stripe.Price[]>();
  prices.data.forEach(price => {
    const productId = typeof price.product === 'string' ? price.product : price.product.id;
    if (!pricesByProduct.has(productId)) {
      pricesByProduct.set(productId, []);
    }
    pricesByProduct.get(productId)!.push(price);
  });

  console.log('Products and Prices:\n');
  products.data.forEach(product => {
    const productPrices = pricesByProduct.get(product.id) || [];
    console.log(`Product: ${product.name} (${product.id})`);
    console.log(`  Description: ${product.description || 'N/A'}`);
    console.log(`  Prices:`);
    if (productPrices.length === 0) {
      console.log(`    ⚠️  No active prices found`);
    } else {
      productPrices.forEach(price => {
        const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
        const currency = price.currency.toUpperCase();
        const interval = price.recurring?.interval || 'one-time';
        const intervalCount = price.recurring?.interval_count || 1;
        console.log(`    - ${price.id}: ${currency} ${amount} / ${intervalCount} ${interval}`);
      });
    }
    console.log('');
  });

  console.log('\n💡 To use these in your app:');
  console.log('   1. Update SUBSCRIPTION_TIERS in apps/web/lib/stripe.ts');
  console.log('   2. Replace placeholder priceId values with actual Stripe Price IDs');
  console.log('   3. Match products by name or create new ones for Aquivis tiers\n');
}

getStripePrices();
