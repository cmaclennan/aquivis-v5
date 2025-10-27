<!-- 3b13d14d-4178-4e10-aa23-df2367fee0c2 f5ba6c5e-07bb-4ae1-af53-a372e662c8ad -->
# Aquivis v5 – Clean Rebuild Plan

## Objectives

- Simpler, obvious UX for desktop management and mobile field work.
- Instant-feel performance: sub-300ms TTFB on core views; sub-2.5s LCP mobile.
- Clean new database (no legacy RLS debt), minimal moving parts.
- Robust reliability: predictable schedules, offline-friendly mobile.

## Users & Apps

- Desktop (management/admin/billing): planning, reporting, customers, properties, billing.
- Mobile companion (field technicians): Today tasks, guided service wizard, photo capture, offline queue.

## Core Product Scope (v5 parity + simplification)

- Companies, profiles/roles (owner, manager, technician, customer-view).
- Properties, units (shared facilities + individual units combined in one view).
- Services (guided 6-step wizard; autosave; photos), water tests, chemicals, maintenance tasks.
- Scheduling (simple defaults; advanced optional rules), run sheets.
- Customers/billing (basic exports; full billing later).
- Reports (fast summaries; CSV exports).

## Information Architecture

- Desktop IA
  - Dashboard: KPIs + quick filters.
  - Task Inbox (Today/This Week): quick triage; opens side panel.
  - Properties: flat grid with shared + individual units together; single Add flow.
  - Services: list + detail; wizard for create/edit.
  - Schedule: calendar/list backed by precomputed tasks.
  - Customers, Reports, Settings.
- Mobile IA
  - Today: task list; offline cache; sync banner.
  - Service Wizard: linear steps (Type → Test → Chemicals → Maintenance → Equipment → Photos → Review).
  - Minimal navigation; property/unit lookup as needed.

## Experience Principles

- Task-first: always start from actionable items.
- Progressive disclosure: simple defaults; advanced collapsed.
- One way to do a thing: unified Add flow across entities.
- Autosave and resilient: never lose work; offline queue on mobile.

## Architecture

- Monorepo (pnpm/turborepo)
  - apps/web (Next.js App Router)
  - apps/mobile (Expo/React Native)
  - packages/ui (shared components)
  - packages/types (Zod + TS types)
  - packages/db (SQL migrations; DB client)
- Backend
  - Next.js Route Handlers (web) for admin APIs.
  - Supabase (new project) as primary DB/auth/storage.
  - Precompute worker (Edge Function/cron) to generate `scheduled_tasks` per property/day.
- Auth
  - Supabase Auth only (email/password + magic link optional).
  - RLS patterns: tenant_id scoping helpers; role claims in JWT; policies per table.
- Data access
  - Views-first for lists (denormalized views per page).
  - Narrow selects, indexes for all hot filters.

## Database (new project)

- Tenancy: `company_id` on all core entities; `profiles(company_id, role)`.
- Tables (high-level): companies, profiles, properties, units, services, water_tests, chemical_additions, maintenance_tasks, plant_rooms, bookings, schedule_templates, property_rules, equipment, scheduled_tasks.
- Indices: company_id, property_id, unit_id, service_date/test_time, scheduled_date/time, rule lookups.
- RLS: per company; owner/manager read/write; technician limited writes (services, tests, photos).

## Scheduling Model (performance)

- Write scheduling intent to templates/rules.
- Precompute `scheduled_tasks` daily and on config change.
- Web/mobile GET reads from `scheduled_tasks` with fast filters.

## Performance & Reliability SLOs

- Desktop TTFB < 300ms for Inbox, Properties, Services list.
- Mobile Today screen usable < 1s with cached tasks; sync in background.
- P95 API < 400ms; zero unindexed scans (verified by EXPLAIN and logs).
- Lighthouse: mobile performance ≥ 85, accessibility ≥ 95.

## Security & Privacy

- Strict CSP in prod; dev CSP allows refresh.
- RLS-first, least privilege.
- Audit trails for admin actions (optional v1.1).

## Implementation Phases

1) Foundations (Schema, Auth, Monorepo)
   - Create new Supabase project, schema migrations, RLS helpers.
   - Set up monorepo, shared types, UI kit foundations.
   - Implement auth hook, role gates, company scoping.
2) Core UX (Desktop)
   - Task Inbox + side panel.
   - Properties flat grid + unified Add Resource flow.
   - Services list/detail + Wizard with autosave.
   - Read-only Reports summaries.
3) Scheduling
   - Schedule templates (simple first), precompute job, Schedule view (fast list/calendar).
4) Mobile Companion
   - Today tasks offline-first (SQLite/AsyncStorage), Service Wizard, photo capture, retries.
5) Billing/Exports/Polish
   - Customer list, basic exports, CSV reports; perf gates; accessibility pass.

## Reference docs from prior repo (read-only)
- DB/docs/SCHEMA_DIFF_FROM_PREV.md
- DB/docs/INDEX_PLAN.md
- DB/docs/SCHEDULING_PRECOMPUTE_NOTES.md
- IA/WIZARD_STEP_NOTES.md
- API/ROUTES_NOTES_FROM_PREV.md
- OPERATIONS/PERF_FINDINGS.md

## Page Map (Desktop)

- /dashboard, /tasks, /properties, /properties/[id], /services, /services/new, /services/[id], /schedule, /customers, /reports, /settings

## APIs (examples)

- GET /api/tasks?date=YYYY-MM-DD&propertyId=… (scheduled_tasks)
- POST /api/services (create), PATCH /api/services/:id
- POST /api/services/:id/water-tests, /chemicals, /maintenance
- GET /api/properties (view), GET /api/properties/:id

## Mobile (Expo) specifics

- Local store for tasks and service drafts; background sync.
- Camera integration, media upload with retry; metadata linking to service.
- Low-latency UI (no heavy joins on-device).

## Tooling & Quality

- Type-safe Zod schemas shared web/mobile/server.
- E2E (Playwright) for web critical flows; Detox for mobile basics.
- Perf gates: LHCI in CI for web; server-timing budgets.

## Migration & Data

- No legacy carry-over. If import required, build one-off script to map/validate records.
- Media storage new buckets; optional migration later.

## Risks & Mitigations

- Scope creep → fixed MVP list and gates per phase.
- Perf regressions → budgets + CI gates; index reviews each PR.
- RLS complexity → prebuilt helpers and template policies.

## Milestones

- M1 (2 weeks): Schema+RLS, Auth, Monorepo, Desktop Task Inbox.
- M2 (4 weeks): Properties (flat), Services Wizard, Reports summaries.
- M3 (6 weeks): Scheduling precompute + view.
- M4 (8 weeks): Mobile Today + Wizard (offline), photo uploads.
- M5 (9–10 weeks): Billing exports, polish, perf/accessibility gates; pilot.

## Acceptance Criteria (Go/No-Go)

- All SLOs met; inbox/schedule/props/services instant-feel.
- Technicians can complete a service fully offline and sync later.
- Managers can plan week and export summaries without delays.

