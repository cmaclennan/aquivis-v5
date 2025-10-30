# Setup Instructions

## Quick Start

### 1. Environment Variables

Create `apps/web/.env.local`:

```env
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend (CONFIGURED)
RESEND_API_KEY=re_FZN6BemW_5ZLw9E1KUy1yP9HtU5J1UkKC

# Stripe (CONFIGURED - publishable key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Iqa7xF5cJQ9rWgy5NKpPwnl2H1CFiKsVpGP62LshNDTo4mYVz4roGAH3DVsPkgALkbGeQBVkbfTUohO4Rzg9dm700cgaSMEj4

# Stripe (NEED TO ADD SECRET KEY)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
```

**Note:** Get `STRIPE_SECRET_KEY` from: https://dashboard.stripe.com/apikeys

### 2. Install Dependencies

```bash
cd apps/web
npm install
```

Dependencies added:
- ✅ `zod` (validation)
- ✅ `stripe` (billing)

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Testing the New Features

### Test Team Management

1. Go to `/settings/team`
2. As an owner/manager, you should see "Invite Team Member" form
3. Enter an email and select a role
4. Click "Send Invitation"
5. Check email inbox for invitation (if RESEND_API_KEY is set)
6. Invitation link should work and redirect to signup

### Test Company Settings

1. Go to `/settings/company`
2. Fill in all the new fields:
   - Business Address
   - Phone
   - Website
   - Tax ID / ABN
3. Save changes
4. Changes should persist

### Test Billing Page

1. Go to `/settings/billing`
2. See 4 subscription tiers displayed
3. Current plan highlighted
4. "Manage Billing" button ready (needs Stripe webhook)

### Test Health Check

Visit: http://localhost:3000/api/health

Should return: `{ status: "healthy", checks: { database: "healthy", api: "healthy" } }`

---

## Environment Variables Guide

### Already Configured ✅
- Resend API key (provided)
- Stripe publishable key (provided)

### Need to Add ⚠️
- Stripe secret key (get from Stripe dashboard)
- Supabase keys (you should already have these)

### Where to Get Keys

#### Stripe Secret Key
1. Go to https://dashboard.stripe.com/apikeys
2. Create or copy secret key
3. Starts with `sk_live_` for production
4. Or `sk_test_` for testing

#### Supabase Keys (if needed)
1. Go to your Supabase project
2. Settings > API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Next Steps After Setup

1. ✅ Test invitation flow
2. ✅ Test company settings
3. ⏳ Set up Stripe webhook (when ready)
4. ⏳ Create Stripe Products
5. ⏳ Configure Supabase Storage for logo upload

---

## Troubleshooting

### "RESEND_API_KEY not configured"
- Check `.env.local` exists in `apps/web/`
- Restart dev server after adding keys

### "STRIPE_SECRET_KEY not configured"  
- Add Stripe secret key to `.env.local`
- Get it from Stripe dashboard

### Invitation email not sending
- Check RESEND_API_KEY is correct
- Check spam folder
- Check Resend dashboard for logs

### Team invitation button not showing
- Make sure you're logged in as owner or manager
- Check browser console for errors

