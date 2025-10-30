-- Fix RLS policies to allow users to update their own profile
-- This is the correct approach - fix RLS rather than bypassing it in API routes

-- Add a new policy that allows users to update their own profile
-- This policy allows updating first_name, last_name, and updated_by/updated_at
-- Users cannot change their role, company_id, or email (those are restricted by WITH CHECK)
CREATE POLICY profiles_user_update_own ON profiles
  FOR UPDATE
  USING (auth.uid() = id)  -- User can only update their own profile
  WITH CHECK (
    auth.uid() = id  -- Must be their own profile
    AND id = (SELECT id FROM profiles WHERE id = auth.uid())  -- Ensure id doesn't change
    AND company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())  -- Ensure company_id doesn't change
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())  -- Ensure role doesn't change
    AND email = (SELECT email FROM profiles WHERE id = auth.uid())  -- Ensure email doesn't change
  );

COMMENT ON POLICY profiles_user_update_own ON profiles IS 
  'Allows users to update their own profile (first_name, last_name, updated_by, updated_at) but prevents changes to id, company_id, role, assumption: email changes require separate auth flow';

