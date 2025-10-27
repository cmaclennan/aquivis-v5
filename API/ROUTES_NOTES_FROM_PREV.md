# API notes from previous repo (reference-only)

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## Patterns to keep
- Lists: denormalized views with narrow selects; fast filters; pagination cursors
- Details: targeted joins on demand; avoid N+1 with select lists
- Tasks: GET `/api/tasks?date=YYYY-MM-DD&propertyId=…` reads `scheduled_tasks`

## Endpoints (v5 baseline)
- GET /api/tasks?date&propertyId&status
- PATCH /api/tasks/:id (status)
- GET /api/services?propertyId&unitId&date
- POST /api/services; PATCH /api/services/:id
- POST /api/services/:id/water-tests
- POST /api/services/:id/chemicals
- POST /api/services/:id/maintenance
- GET /api/properties; GET /api/properties/:id
- POST /api/properties (admin); POST /api/units (admin)

## Auth & RLS
- Supabase Auth; JWT includes company_id, role
- Policies align with RLS_STRATEGY.md


