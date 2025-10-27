# Performance findings and budgets (from previous repo)

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## Budgets
- Desktop TTFB < 300ms for Inbox/Properties/Services list
- p95 API < 400ms; no unindexed scans
- Lighthouse mobile ≥ 85; accessibility ≥ 95

## Key takeaways
- Precompute `scheduled_tasks`; never compute schedules on request
- Index by tenant and date/time for all hot paths
- Keep list views denormalized and minimal; hydrate details lazily
- Add EXPLAIN checks in CI for list queries

## CI gates (to implement later)
- LHCI budgets for web
- Server-Timing budgets for API endpoints
- EXPLAIN ANALYZE checks to block unindexed scans


