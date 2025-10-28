# ADR 2025-10-28: SSO Providers (Google, Apple)

## Status
Accepted (placeholders; provider IDs/secrets to be added later)

## Context
We will support SSO alongside email/password and magic links. Initial providers: Google and Apple. Access remains tenant-controlled; only owners/managers may invite/revoke users and grant Customer Portal access.

## Decision
- Enable SSO for Google and Apple via Supabase Auth when credentials are available.
- Use magic links for Customer Portal as baseline; SSO optional per tenant.
- Callback URLs
  - Dev: http://localhost:3000/auth/callback
  - Prod: https://aquivis.co/auth/callback
- Roles and RLS unchanged: SSO identities map to `profiles(id, company_id, role)`; portal users restricted to their units.

## Required configuration (placeholders)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- APPLE_CLIENT_ID
- APPLE_TEAM_ID
- APPLE_KEY_ID
- APPLE_PRIVATE_KEY (PEM)

## Consequences
- Add SSO setup guide and environment placeholders.
- Add ADR for additional providers in future (e.g., Microsoft) as needed.

## Rollback
Disable providers in Supabase Auth dashboard; core email/password + magic link remain.
