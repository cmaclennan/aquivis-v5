-- Fix RLS policies to allow owners and managers to update company details
-- This ensures company settings page can save changes securely via RLS

-- Add UPDATE policy for companies
-- Only owners and managers can update their company
CREATE POLICY companies_update_owner_manager ON companies
  FOR UPDATE
  USING (
    id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
        AND role IN ('owner', 'manager')
        AND company_id IS NOT NULL
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
        AND role IN ('owner', 'manager')
        AND company_id IS NOT NULL
    )
  );

COMMENT ON POLICY companies_update_owner_manager ON companies IS 
  'Allows owners and managers to update their company details. Prevents unauthorized updates and role escalation.';

