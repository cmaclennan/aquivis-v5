# Schema differences vs previous repo (reference-only)

Reference: [cmaclennan/aquivis](https://github.com/cmaclennan/aquivis.git)

## Summary
- v5 keeps the multi-tenant model but simplifies list reads via denormalized views and a precomputed `scheduled_tasks` table.
- Prior repo contained broader scope (bookings, compliance, extensive enums). v5 adopts a smaller core set initially, with optional follow-ons.

## Entities retained (v5)
- companies, profiles (role, company_id)
- properties, units
- services (and linked artifacts): water_tests, chemical_additions, maintenance_tasks
- equipment, plant_rooms (kept, but minimal fields first)
- schedule_templates, property_rules (simple weekly/twice-weekly to start)
- scheduled_tasks (precomputed)

## Entities deferred or simplified
- bookings: only referenced as a future input to scheduling; not core for M1.
- customers/billing: exports only for M1; full billing later.
- enums: start with minimal enums; expand when needed.

## Column/shape simplifications
- services: emphasize `service_date`, `status`, `technician_id`, `notes`; avoid heavy embedded JSON until proven.
- water_tests: keep core chemistry fields; defer edge-case metrics.
- chemical_additions: basic fields (type, quantity, unit_of_measure, cost).
- scheduled_tasks: required fields only for fast list queries (company_id, property_id, unit_id, date, time, task_type, priority, status).

## RLS approach
- Same tenant scoping pattern (company_id in tables + helpers in JWT and SQL).
- Roles: owner, manager, technician; technician limited writes on their work.

## Why these changes
- Reduce query complexity for list views; guarantee p95 < 400ms.
- Avoid overfitting early to niche workflows; keep schema evolvable.

## Migration notes
- No legacy carry-over in v5. If import needed, perform one-off mapping with validation.


