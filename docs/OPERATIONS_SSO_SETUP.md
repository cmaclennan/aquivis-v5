# SSO Setup (Supabase) – Google & Apple (Placeholders)

## Callback URLs
- Dev: http://localhost:3000/auth/callback
- Prod: https://aquivis.co/auth/callback

## Supabase Console Steps
1. Go to Authentication → Providers.
2. Enable Google and Apple.
3. Enter client IDs/secrets. Use the callback URLs above.
4. Save.

## Environment Variables (placeholders)
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=
- APPLE_CLIENT_ID=
- APPLE_TEAM_ID=
- APPLE_KEY_ID=
- APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

## Access Control
- Only owners/managers can invite or revoke users.
- Portal users restricted to their units via RLS; technicians cannot invite.

## Notes
- Magic link login remains enabled for Customer Portal.
- Add more providers via new ADRs when needed.
