# Environment Setup

## Local Development

Create a file `apps/web/.env.local` with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend
RESEND_API_KEY=re_FZN6BemW_5ZLw9E1KUy1yP9HtU5J1UkKC

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Iqa7xF5cJQ9rWgy5NKpPwnl2H1CFiKsVpGP62LshNDTo4mYVz4roGAH3DVsPkgALkbGeQBVkbfTUohO4Rzg9dm700cgaSMEj4
STRIPE_SECRET_KEY=sk_live_your_secret_key_here

# Error Tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://d0152f8296f5e5d5c8419c7476470284@o4510060715180032.ingest.de.sentry.io/4510263520395344
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
```

## Production

Set these environment variables in your hosting platform:

### Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g., https://aquivis.com)
- `RESEND_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

### Optional:
- `SENTRY_DSN` - For error tracking
- `NODE_ENV=production`

## Getting Your Keys

### Supabase
1. Go to your Supabase project dashboard
2. Settings > API
3. Copy URL and keys

### Resend
1. Sign up at https://resend.com
2. Dashboard > API Keys
3. Your API key is already configured above

### Stripe
1. Go to https://dashboard.stripe.com
2. Get your publishable key (already above)
3. Get your secret key from: Developers > API keys
4. Add secret key to environment variables

## Security Notes

- Never commit `.env.local` to git
- `.env.local` is already in `.gitignore`
- Use separate keys for development and production
- Rotate keys regularly

