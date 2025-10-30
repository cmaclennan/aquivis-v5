# Environment Variables (Clean-room)

Use these names exactly. Store secrets in GitHub Actions repository secrets or local `.env.local` (never commit secrets).

## Supabase (public)
- NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anon key (public)

## Supabase (server)
- SUPABASE_SERVICE_ROLE_KEY: Service role key (server-only)

## Database (direct Postgres for migrations)
- PGHOST: db.<project>.supabase.co
- PGDATABASE: postgres
- PGUSER: postgres
- PGPASSWORD: database password

## Auth
- EMAIL_SENDER: outbound email (e.g., noreply@aquivis.co)
- AUTH_REDIRECT_URLS: comma-separated list of allowed redirect URLs
  - Dev: http://localhost:3000/auth/callback
  - Prod: https://aquivis.co/auth/callback (when live)

## Stripe
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Stripe publishable key (public)
- STRIPE_SECRET_KEY: Stripe secret key (server-only)
- STRIPE_WEBHOOK_SECRET: Stripe webhook signing secret

## Resend
- RESEND_API_KEY: Resend API key for sending emails

## App Configuration
- NEXT_PUBLIC_APP_URL: Application URL (e.g., https://aquivis.com)
  - Dev: http://localhost:3000
  - Prod: https://your-production-domain.com

## SSO (placeholders - optional)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- APPLE_CLIENT_ID
- APPLE_TEAM_ID
- APPLE_KEY_ID
- APPLE_PRIVATE_KEY: PEM string

## Error Tracking (optional)
- NEXT_PUBLIC_SENTRY_DSN: Sentry DSN for error tracking
- SENTRY_AUTH_TOKEN: Sentry auth token
- SENTRY_ORG: Sentry organization slug
- SENTRY_PROJECT: Sentry project slug

## Notes
- Customer Portal uses magic links by default; SSO optional per tenant.
- Only owners/managers can invite portal users; technicians cannot invite.
- Update Supabase Auth providers when SSO credentials are available.
- Store all secrets in `.env.local` (never commit to Git).
- Use Vercel environment variables for production deployment.
