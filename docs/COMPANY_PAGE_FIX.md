# Company Page 406 Error - Fixed

**Date:** 2025-10-29  
**Status:** ✅ Fixed

---

## Problem

Company settings page was returning HTTP 406 error:
```
GET /rest/v1/companies?select=name%2Ctimezone&id=eq.9f87799b-c461-4162-a069-958f5f8ef2dd 406 (Not Acceptable)
Error: Cannot coerce the result to a single JSON object
```

**Root Cause:** Same as profiles - RLS policy on `companies` table was too restrictive. It required `request_company_id()` from JWT claims, which weren't set.

---

## Solution

### Updated RLS Policy (Migration #6)
**File:** `DB/schema/060_fix_companies_rls.sql`

Changed from:
```sql
CREATE POLICY companies_select ON companies FOR SELECT
  USING (id = request_company_id());
```

To:
```sql
CREATE POLICY companies_select ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
    OR id = request_company_id()
  );
```

**Result:** Users can now read their own company (where they have a profile) even without JWT claims set.

---

## Changes Made

### Database Migration:
- ✅ Migration #6 applied: `fix_companies_rls`
- ✅ New RLS policy active on companies table

### Migration Logic:
The policy now checks if the user's profile has a `company_id` matching the company being queried. This works even if JWT claims aren't set.

---

## Verification

1. **Refresh browser** (Ctrl+R)
2. **Go to `/settings/company`**
3. **Should see:**
   - Company name field populated
   - Timezone dropdown populated
   - No 406 errors in console

---

## Summary of All RLS Fixes

| Table | Old Policy | New Policy | Status |
|-------|------------|------------|---------|
| profiles | `company_id = request_company_id()` | `auth.uid() = id OR company_id = request_company_id()` | ✅ Fixed |
| companies | `id = request_company_id()` | `id IN (SELECT company_id FROM profiles WHERE id = auth.uid()) OR id = request_company_id()` | ✅ Fixed |
| Other tables | Various | Same pattern (tenant isolation) | ✅ Working |

---

## Why This Happens

The onboarding process creates profiles and companies but doesn't update Supabase Auth user metadata with JWT claims. This is common in new applications. The fix allows:

1. Users to read their own profile immediately
2. Users to read their company immediately
3. Still respects company boundaries (can't read other companies)
4. Still works with JWT claims when they're eventually set up

**Future TODO:** Add a database trigger to sync profile changes to JWT claims automatically.

