/**
 * Quick script to test Stripe connection
 * Run with: npx tsx scripts/test-stripe.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('\n🔍 Checking Stripe Configuration...\n');
  
  console.log('Environment Variables:');
  console.log(`  STRIPE_SECRET_KEY: ${secretKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${publishableKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  STRIPE_WEBHOOK_SECRET: ${webhookSecret ? '✅ Set' : '❌ Missing'}`);

  if (!secretKey) {
    console.log('\n❌ STRIPE_SECRET_KEY is required. Please add it to .env.local');
    process.exit(1);
  }

  try {
    console.log('\n🔌 Testing Stripe API Connection...\n');
    
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    });

    // Test 1: Retrieve account balance (simple API call)
    const balance = await stripe.balance.retrieve();
    console.log('✅ API Connection: SUCCESS');
    console.log(`   Account Currency: ${balance.available[0]?.currency || 'N/A'}`);
    console.log(`   Available Balance: ${balance.available[0] ? `${balance.available[0].amount / 100} ${balance.available[0].currency}` : 'N/A'}`);

    // Test 2: Check if we can list customers (verify permissions)
    const customers = await stripe.customers.list({ limit: 1 });
    console.log('✅ Customer API: SUCCESS');
    console.log(`   Can create/manage customers: Yes`);

    // Test 3: Check if we can list products (for subscription tiers)
    const products = await stripe.products.list({ limit: 5 });
    console.log('✅ Products API: SUCCESS');
    console.log(`   Existing Products: ${products.data.length}`);
    if (products.data.length > 0) {
      console.log('   Products:');
      products.data.forEach(p => {
        console.log(`     - ${p.name} (${p.id})`);
      });
    } else {
      console.log('   ⚠️  No products found. You\'ll need to create Products and Prices in Stripe Dashboard.');
    }

    console.log('\n✅ Stripe Integration: READY\n');
    console.log('Next Steps:');
    console.log('  1. Create Products in Stripe Dashboard (Starter, Professional, Business)');
    console.log('  2. Create Prices for each Product');
    console.log('  3. Update priceId values in apps/web/lib/stripe.ts');
    console.log('  4. Configure webhook endpoint in Stripe Dashboard');
    console.log('  5. Test subscription flow in your app\n');

  } catch (error: any) {
    console.log('\n❌ Stripe API Connection: FAILED\n');
    console.log('Error Details:');
    console.log(`  Type: ${error.type || 'Unknown'}`);
    console.log(`  Code: ${error.code || 'Unknown'}`);
    console.log(`  Message: ${error.message}`);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 This usually means:');
      console.log('   - Invalid STRIPE_SECRET_KEY');
      console.log('   - Wrong API key (using test key with live mode or vice versa)');
    }
    
    process.exit(1);
  }
}

testStripe();
