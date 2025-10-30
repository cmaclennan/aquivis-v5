# Aquivis v5 — Current Status & Implementation Strategy
**Last Updated:** 2025-10-29  
**Status:** Foundation Core Complete, Ready for App Features

---

## ✅ Completed (M1 Foundation + Settings Core)

### Foundation Infrastructure
- **Settings System**: Profile, Company, Team management pages
- **Navigation**: Settings link added to main nav
- **Security**: All RLS policies applied to 22/22 tables
- **Database**: 4 migrations applied successfully

### Authentication & Database
- **Auth Flow**: Signup → Login → Onboarding working
- **Database Schema**: Applied with 3 migrations (000_init, 010_indices, 020_jwt_claims)
- **RLS Security**: Enabled on core tables (companies, profiles, properties, services, scheduled_tasks)
- **JWT Claims**: Database trigger updates user metadata with company_id and role

### API Routes (Contract-First)
- **Properties API**: GET (list), GET/:id, POST (create), PATCH (update), POST/:id/units
- **Tasks API**: GET (filtered by date/propertyId/status), PATCH/:id (status update)
- **Services API**: GET (filtered), POST, GET/:id (with joins), PATCH/:id
- **Service Children**: POST /water-tests, /chemicals, /maintenance

### UI Integration
- **Properties Page**: Fetches real data, displays empty state when no properties
- **Tasks Page**: Shows scheduled tasks with properties/units, status badges
- **Dashboard**: Real metrics (tasks completed, today's tasks, properties count, pending tasks)
- **All Pages**: Loading states, error handling, proper data display

### Design System
- **SaaS Palette**: Blue primary (#007BFF), purple accent (#6F42C1)
- **Components**: Button, Input, Select, Card, PageHeader, EmptyState
- **Layouts**: Consistent shadows, borders, spacing, gradients

---

## ⚠️ Critical Issues (Security)

### RLS Missing on Several Tables
**Priority: HIGH** — Security vulnerability

These tables are exposed to PostgREST but lack RLS:
- `units`
- `water_tests`
- `chemical_additions`
- `maintenance_tasks`
- `plant_rooms`
- `equipment`
- `property_rules`
- `facility_groups`
- `group_members`
- `sampling_state`
- `billing_mappings`
- `service_charges`

**Impact**: These tables are publicly accessible without company scoping.

**Fix Required**: Enable RLS and add policies for each table.

---

## 📝 Immediate Next Steps

### Phase 1: Security Hardening (High Priority)
1. **Enable RLS on all remaining tables**
   - Create migration `030_rls_remaining_tables.sql`
   - Add SELECT/INSERT/UPDATE policies for each table
   - Use `request_company_id()` for tenant scoping

2. **Fix function search_path security warnings**
   - Add `set search_path = public` to RLS helper functions
   - Create migration to update functions

3. **Enable leaked password protection**
   - Configure Supabase Auth to check HaveIBeenPwned
   - Admin setting, not code change

### Phase 2: Core Functionality
1. **Properties Wizard** (`/properties/new`)
   - Currently shows placeholder
   - Build multi-step form: Property → Units → Equipment → Rules
   - Implement proper error handling and validation

2. **Task Generation System**
   - Build precompute engine from `schedule_templates`
   - Generate 14-day window of scheduled tasks
   - Implement "random k-of-n" and booking-driven scheduling
   - Admin endpoint: `POST /api/admin/generate-tasks`

3. **Dashboard Enhancements**
   - Add real charts (line/bar for metrics over time)
   - Activity feed (recent services completed)
   - Quick actions (mark task complete, create service)

### Phase 3: Services & Workflows
1. **Service Detail View** (`/services/:id`)
   - Display service info, water tests, chemicals, maintenance
   - Ability to add/edit service data
   - Mark service as complete

2. **Service Wizard** (`/services/new`)
   - Multi-step: Select property → Select unit → Enter data
   - Add water tests, chemicals, maintenance inline
   - Autosave to drafts

### Phase 4: Polish & Testing
1. **Input Validation**
   - Add Zod schemas to API routes
   - Client-side validation on forms
   - Proper error messages

2. **Loading States**
   - Add skeleton loaders for all data fetching
   - Optimize queries for better performance

3. **Error Handling**
   - Toast notifications for success/errors
   - Retry mechanisms for failed requests
   - Offline support indicators

---

## 🎯 M1 Acceptance Criteria Review

According to PLAN_v1.5.md §15:

- ✅ Signup/login/onboarding flow works and is styled
- ✅ Protected routes (via AuthGuard)
- ✅ Nav auth-aware
- ✅ `/tasks` renders styled empty state
- ⚠️ Production build passes — **Needs verification**
- ⚠️ CI build on PR passes — **Needs CI setup**

**Remaining:**
1. Fix RLS security issues
2. Verify build passes
3. Set up CI pipeline

---

## 🔒 Security Audit Results

From Supabase Security Advisors:

### Critical Errors (Must Fix)
- 12 tables missing RLS (see list above)

### Warnings (Should Fix)
- 5 functions without search_path security (is_owner, request_company_id, request_role, is_manager, is_technician)
- Leaked password protection disabled (admin setting)

---

## 📊 Database Status

**Migrations Applied:**
1. `000_init` — Schema creation
2. `010_indices` — Performance indices
3. `020_jwt_claims` — Claims update trigger

**Tables with RLS:**
- companies ✅
- profiles ✅  
- properties ✅
- services ✅
- scheduled_tasks ✅
- schedule_templates ✅
- bookings ✅
- billing_accounts ✅
- inventory_items ✅
- inventory_ledger ✅

**Tables Missing RLS:** 12 tables (listed above)

---

## 🚀 Recommended Implementation Order

**Week 1: Critical Security**
1. Migration to enable RLS on all remaining tables
2. Test RLS policies thoroughly
3. Fix function security warnings
4. Enable password leak protection

**Week 2: Core Features**
1. Complete Properties Wizard
2. Build task generation system
3. Add service detail view
4. Enhance dashboard with real data flows

**Week 3: Polish & Testing**
1. Add input validation everywhere
2. Add proper loading states
3. Test complete user flows
4. Performance optimization

**Week 4: Launch Prep**
1. CI/CD setup
2. End-to-end testing
3. Documentation
4. Production deployment

---

## 📚 Current Code Quality

- ✅ **No linter errors** in TypeScript/ESLint
- ⚠️ **Security warnings** from Supabase advisors
- ✅ **Database structure** is sound
- ✅ **API patterns** follow contract-first approach
- ✅ **UI/UX** consistent and polished

---

## 🎨 Design System Status

- ✅ Color palette implemented
- ✅ Typography scale defined
- ✅ Component library complete for M1
- ✅ Layouts consistent
- 📋 Additional components may be needed for M2+ features

---

## 📈 Performance Considerations

**Indices in Place:**
- `idx_properties_company`
- `idx_units_property`
- `idx_services_property_date`
- `idx_scheduled_tasks_company_date`
- `idx_scheduled_tasks_property_date`

**Optimization Opportunities:**
- Add pagination to list queries
- Implement query result caching
- Add Server-Timing headers for monitoring
- Consider denormalized views for hot paths

---

## Next Session Goals

1. **Fix all RLS security issues** (migration + test)
2. **Build Properties wizard** (end-to-end)
3. **Create task generation system** (core scheduling logic)
4. **Set up CI pipeline** (build + type checks)

Estimated time: 4-6 hours of focused development.
