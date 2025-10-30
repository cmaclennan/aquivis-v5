# Aquivis Deployment Guide

This guide covers deploying the Aquivis SaaS platform to production.

## Prerequisites

- Supabase project created and configured
- Stripe account with products/prices created
- Resend account with API key
- Domain configured (for production)
- Environment variables prepared

## Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
```

### Supabase Setup

1. **Storage Bucket**: Create `company-logos` bucket in Supabase Dashboard
   - Public: Enabled
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg,image/png,image/webp,image/svg+xml`
   - See `docs/STORAGE_SETUP.md` for RLS policies

2. **Database Migrations**: Apply all migrations in `DB/schema/`
   ```bash
   # Using Supabase CLI or Dashboard SQL Editor
   psql -h db.your-project.supabase.co -U postgres -d postgres -f DB/schema/000_init.sql
   psql -h db.your-project.supabase.co -U postgres -d postgres -f DB/schema/010_indices.sql
   # ... apply all migrations in order
   ```

3. **RLS Policies**: Verify all tables have proper RLS policies enabled

4. **Stripe Webhook**: Configure webhook endpoint in Stripe Dashboard
   - URL: `https://yourdomain.com/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Build & Deploy

### Vercel Deployment (Recommended)

1. Connect your Git repository to Vercel
2. Configure environment variables in Vercel Dashboard
3. Set build command: `npm run build --workspace=apps/web`
4. Set output directory: `apps/web/.next`
5. Deploy

### Manual Deployment

```bash
# Install dependencies
npm install

# Build
npm run build --workspace=apps/web

# Start production server
npm run start --workspace=apps/web
```

## Post-Deployment Checklist

- [ ] Verify `/api/health` endpoint returns 200
- [ ] Test authentication flow (signup/login)
- [ ] Test team invitation flow
- [ ] Verify Stripe webhook receives events
- [ ] Test logo upload functionality
- [ ] Verify email sending (Resend)
- [ ] Check RLS policies are working correctly
- [ ] Test billing/subscription flow
- [ ] Monitor error logs for issues

## Monitoring

- **Health Checks**: Monitor `/api/health` endpoint
- **Error Tracking**: Configure Sentry (see `docs/ERROR_TRACKING.md`)
- **Database**: Monitor Supabase Dashboard for slow queries
- **Stripe**: Monitor webhook delivery in Stripe Dashboard

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check user's `company_id` in JWT claims
2. **Storage Upload Fails**: Verify `company-logos` bucket exists and is public
3. **Stripe Webhook Fails**: Verify webhook secret matches
4. **Email Not Sending**: Check Resend API key and domain verification

## Security Checklist

- [ ] All environment variables secured (never in Git)
- [ ] RLS enabled on all tables
- [ ] Service role key only used server-side
- [ ] Webhook signature verification enabled
- [ ] CORS configured correctly
- [ ] Rate limiting configured (if applicable)

