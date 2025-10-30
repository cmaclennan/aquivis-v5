# Backup & Restore Runbook

## Scope
- Postgres (Supabase) automated nightly backups
- Point-in-time restore (PITR) approach and test procedure

## Objectives
- RPO: 24h (nightly backups)
- RTO: < 2h (restore + app re-point)

## Backup Configuration
- Supabase: enable automated daily backups in project settings
- Retention: 14–30 days (per cost tolerance)
- Verify WAL/PITR is enabled if available

## Restore Test (Quarterly)
1. Create a temporary database (Supabase branch or fork)
2. Restore latest backup into the temp database
3. Run smoke tests:
   - `/api/health` returns OK
   - Sign in and load dashboard
   - Verify a sample of tables and counts
4. Destroy the temp database after validation

## Disaster Recovery Procedure
1. Decide restore point (last good backup time)
2. Restore to a new database
3. Update app env vars to point to the restored DB
4. Run migrations if needed
5. Validate health checks and critical flows
6. Announce recovery complete

## Notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` and connection strings in a secure vault
- Document last restore drill date and findings below

### Drill Log
- YYYY-MM-DD: Created branch, restored backup, ran health checks – PASS/FAIL, notes
