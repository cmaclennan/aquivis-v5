# Debugging Blank Cards Issue

**Problem:** Team/Company settings pages show blank cards despite data existing in database.

---

## Root Cause

The RLS policies are strict:
- `companies`: `id = request_company_id()`
- `profiles`: `company_id = request_company_id()`

The `request_company_id()` function extracts company_id from JWT claims. If JWT doesn't have proper claims set, RLS blocks all queries.

---

## Investigation

### Database Check
- ✅ Profiles have `company_id` and `email` 
- ✅ Companies exist with correct data
- ✅ RLS policies are enabled
- ❌ `request_company_id()` returns null when run as service role

### The Issue
When the client queries from the browser:
1. It uses the user's JWT token
2. If that JWT doesn't have `company_id` in `user_metadata`
3. `request_company_id()` returns null
4. RLS blocks the query (company_id = null doesn't match anything)

---

## Solution

Need to verify:
1. Is the JWT being sent with the request?
2. Does the JWT have `user_metadata.company_id` set?
3. Is the client-side Supabase client configured correctly?

Added console logging to all three pages. Check browser console to see:
- User ID
- Whether session exists
- Whether queries succeed
- Error messages if they fail

---

## Next Steps

1. **Check browser console** for error messages
2. **Verify JWT claims** are set correctly
3. **Check if onboarding** properly sets company_id in user_metadata
4. **Test with different user** to see if it's user-specific

---

## Temporary Workaround (if needed)

If RLS is blocking data, could temporarily:
1. Add a policy to allow users to read their own profile regardless of company_id
2. Use service role client to bypass RLS (NOT for production)
3. Fix the JWT claims update trigger

The proper fix is to ensure the JWT has the correct claims.

