# Minimal CI Gates

## Goals
- Block deploys when health checks fail
- Dry-run migrations to catch invalid SQL early

## Health Smoke Test
- Run `node scripts/smoke-health.mjs` with `APP_URL` (or `NEXT_PUBLIC_APP_URL`) pointing to the preview/staging URL.
- Expect: HTTP 200 and `{ status: "ok" }`.

## Migration Dry-Run
- Use Supabase branches or a temp database to apply migrations non-destructively.
- Command (example):
  - `supabase db reset --db-url "$PREVIEW_DB_URL" --debug` (destroys and recreates preview DB)
  - Or `psql "$PREVIEW_DB_URL" -v ON_ERROR_STOP=1 -f DB/schema/*.sql` in order
- Expect: All migrations apply successfully.

## Rollout
1. Start gates as advisory (non-blocking) for a week.
2. Flip to blocking once flakes are addressed.
