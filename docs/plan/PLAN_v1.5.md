# Aquivis v5 – Plan v1.5 (Comprehensive, Clean‑room)

Status: Draft • Date: 2025‑10‑28 • Supersedes: v1.4

## Change Summary vs v1.4
- Subscriber auth UX clarified: email/password primary; magic link optional; Customer Portal deferred.
- Onboarding flow: company name + timezone; profile auto‑provision and role assignment.
- Server‑side route protection (middleware) for Tasks/Properties.
- Styling via Tailwind with Palette A + Inter; component primitives applied.

## 1. Objectives
- Stable, fast, clean‑room rebuild; enforce SLOs via CI.

## 2. Users & Apps
- Desktop (subscriber): plan/schedule, properties/units, services, reports/exports.
- Customer Portal (later): read‑only + bookings for unit owners/managers.

## 3. Non‑negotiables
- Clean‑room; spec‑first; evidence‑driven; RLS‑first; deterministic migrations + rollback; WCAG AA gate.

## 4. UX/Design System
- Palette A + Inter; tokens for colors/spacing/radii/shadows/motion.
- Components: Button, Inputs, Cards, StatusPill, Tabs, Stepper, TableLite, Toast, EmptyState.
- Layouts: Dashboard, Inbox + Side Panel, Properties, 6‑step Wizard.

## 5. IA
- Desktop: /dashboard, /tasks, /properties, /services, /schedule, /customers, /reports, /settings
- Portal: /portal/* (later)

## 6. Architecture & Monorepo
- apps/web (Next.js App Router), apps/mobile (later), packages/ui/types/db, Supabase DB/Auth/Storage.

## 7. Data Model (Ground‑up)
- Tenancy via `company_id`. Core tables + bookings, facility_groups, sampling_state, billing_* and inventory_* (v1.1).

## 8. RLS & Auth
- JWT: company_id, role; helpers: request_company_id()/role(), is_owner/manager/technician().
- Policies tenant‑scoped; tech limited writes to own work.

## 9. Scheduling
- Templates: plant checks twice‑daily; daily tests 2–3/day; random k‑of‑n with fairness; booking‑driven; recurrences.
- Precompute 14‑day window; idempotent upsert; unique composite key with time_slot.

## 10. Lists/Views/Indices
- Lists from denormalized views; detail joins targeted; indices per INDEX_PLAN.md; CI EXPLAIN gates later.

## 11. APIs (Contract‑first)
- Tasks list, Services CRUD + children, Properties/Units, Bookings, Billing exports (CSV/PDF with branding), Onboarding complete.

## 12. Subscriber Flows (M1 focus)
- Signup (/signup) → Login (/login) → Onboarding (/onboarding) → Tasks (/tasks)
- Middleware protects /tasks, /properties; nav visible only when authed.
- Onboarding stores company + timezone; links profile with owner role.

## 13. Quality Gates
- SLOs: TTFB < 300ms lists; p95 API < 400ms; Lighthouse mobile ≥ 85; a11y ≥ 95.
- CI (staged): build + typechecks on PR; later add LHCI, axe, EXPLAIN, Server‑Timing budgets.

## 14. Milestones
- M1: Auth+Onboarding complete and styled; Inbox mock; schema/RLS in place; CI build passing on PR.
- M2: Properties wizard (Plant Rooms/Units/Groups/Billing); side panel actions; CSV exports.
- M3: Precompute engine (random k‑of‑n + booking‑driven); billing CSV/PDF.
- M4: Mobile Today + Wizard offline.

## 15. Acceptance Criteria (M1)
- Signup/login/onboarding flow works and is styled; protected routes; nav auth‑aware.
- `companies` created and `profiles` linked to company with owner role.
- /tasks renders styled empty state; Server‑Timing present for lists.
- Production build passes; CI build on PR passes.

## 16. Immediate Next Steps
- Finalize auth/onboarding polish; docs for environment and local run.
- Flesh Properties wizard; admin action to generate 14‑day tasks for testing.

## 17. Versioning & Governance
- Plans in `docs/plan/`; ADRs in `docs/adr/`; PRs carry evidence packs.
