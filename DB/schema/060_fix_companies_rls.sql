-- Fix RLS policies on companies to allow users to read their company
-- This ensures company settings page works even if JWT claims aren't set up yet

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS companies_select ON companies;

-- Create a more permissive policy that allows:
-- 1. Users to read companies they're associated with (via profiles table)
CREATE POLICY companies_select ON companies
  FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
    OR id = request_company_id()  -- Can read if JWT has company_id
  );

