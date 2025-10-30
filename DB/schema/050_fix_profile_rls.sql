-- Fix RLS policies on profiles to allow users to read their own profile
-- This ensures settings pages work even if JWT claims aren't set up yet

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS profiles_select ON profiles;

-- Create a more permissive policy that allows:
-- 1. Users to read their own profile
-- 2. Users to read profiles in their company (when JWT has company_id)
CREATE POLICY profiles_select ON profiles
  FOR SELECT
  USING (
    auth.uid() = id  -- Can read own profile
    OR company_id = request_company_id()  -- Can read company profiles if JWT has company_id
  );

-- Keep the update policy as-is
-- (profiles_owner_write already exists)

