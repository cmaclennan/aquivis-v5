# Verification Steps - Settings Pages Data Loading

**Date:** 2025-10-29  
**Status:** Waiting for browser console inspection

---

## What Was Added

### 1. Console Logging
Added comprehensive logging to all settings pages to debug data loading:
- **Profile Page**: Logs user ID, email, and loaded profile data
- **Company Page**: Logs company_id lookup and company data
- **Team Page**: Logs company_id and team member count

### 2. Billing Page
- ✅ New page `/settings/billing`
- ✅ Credit card icon added to sidebar
- ✅ Placeholder UI (plan upgrade, billing info)
- ⏳ Actual billing integration not yet implemented

### 3. Error Handling
- ✅ Try-catch blocks around all async operations
- ✅ Proper error logging to console
- ✅ Graceful fallbacks on data loading failures

---

## Verification Steps

### Step 1: Check Browser Console
1. Open http://localhost:3000/settings/profile
2. Open DevTools (F12) → Console tab
3. Look for these logs:
   - `Loading profile for user: <uuid> <email>`
   - `Profile loaded: <data> Email: <email>`
4. If email is empty or missing, note the issue

### Step 2: Check Profile Data in Database
Run this SQL query:
```sql
SELECT 
  p.id, 
  p.email, 
  p.first_name, 
  p.last_name, 
  u.email as supabase_email
FROM profiles p
JOIN auth.users u ON u.id = p.id
LIMIT 10;
```

**Expected:** `profiles.email` should match `auth.users.email`

### Step 3: Check Company Data
Run this SQL query:
```sql
SELECT 
  p.id as profile_id,
  p.company_id,
  c.name as company_name,
  c.timezone
FROM profiles p
LEFT JOIN companies c ON c.id = p.company_id
WHERE p.company_id IS NOT NULL
LIMIT 10;
```

**Expected:** Each profile should have a valid `company_id`

### Step 4: Test Team Page
1. Go to http://localhost:3000/settings/team
2. Check console for:
   - `Loading team for user: <uuid>`
   - `Found company_id: <uuid>`
   - `Team data loaded: <count> members`

---

## Known Issues to Investigate

### Issue 1: Email Field Empty
**Possible Causes:**
1. `session.user.email` is null (Supabase Auth issue)
2. Profile data not synced with Auth users
3. Database migration issue

**Solution:** If this is found, need to ensure:
- `profiles.email` is properly populated from `auth.users.email`
- Onboarding creates profile with correct email
- Database trigger syncs email updates

### Issue 2: Blank Cards on Company/Team Pages
**Possible Causes:**
1. RLS blocking queries
2. `company_id` not set correctly
3. Missing data in database

**Solution:** Check console logs to see which error occurs

---

## Debugging Commands

```bash
# Check if dev server is running
npm run dev

# Check database tables
# Run in Supabase SQL Editor
SELECT * FROM profiles WHERE email IS NOT NULL;
SELECT * FROM companies WHERE id IS NOT NULL;
```

---

## What to Report

Please provide:
1. Screenshot of browser console when visiting `/settings/profile`
2. Screenshot of browser console when visiting `/settings/company`  
3. Screenshot of browser console when visiting `/settings/team`
4. What you see on each page (blank cards or loaded data)
5. Any error messages in console

This will help diagnose exactly where the data loading is failing.

