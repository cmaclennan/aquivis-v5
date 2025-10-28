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

## SSO (placeholders)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- APPLE_CLIENT_ID
- APPLE_TEAM_ID
- APPLE_KEY_ID
- APPLE_PRIVATE_KEY: PEM string

## Notes
- Customer Portal uses magic links by default; SSO optional per tenant.
- Only owners/managers can invite portal users; technicians cannot invite.
- Update Supabase Auth providers when SSO credentials are available.
