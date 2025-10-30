-- Create invitations table for team member invitations

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'technician')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invitations_token_idx ON invitations(token);
CREATE INDEX IF NOT EXISTS invitations_company_idx ON invitations(company_id);
CREATE INDEX IF NOT EXISTS invitations_email_idx ON invitations(email);

-- RLS policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY invitations_select ON invitations
  FOR SELECT
  USING (company_id = request_company_id() OR company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY invitations_insert ON invitations
  FOR INSERT
  WITH CHECK (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    AND is_owner() OR is_manager()
  );

CREATE POLICY invitations_update ON invitations
  FOR UPDATE
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

COMMENT ON TABLE invitations IS 'Pending team member invitations';
COMMENT ON COLUMN invitations.token IS 'Unique token for invitation acceptance link';
COMMENT ON COLUMN invitations.expires_at IS 'Invitation expiration timestamp';
COMMENT ON COLUMN invitations.accepted_at IS 'Timestamp when invitation was accepted';

