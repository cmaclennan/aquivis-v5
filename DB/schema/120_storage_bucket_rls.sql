-- Storage bucket RLS policies for company logos
-- This migration creates the storage bucket and sets up RLS policies

-- Create the storage bucket if it doesn't exist
-- Note: This must be done via Supabase Dashboard or Storage API
-- Bucket name: company-logos
-- Public: true (for logo URLs to work)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml

-- RLS policies for storage bucket
-- These policies ensure only company owners/managers can upload/delete logos

-- Policy: Allow authenticated users to read logos from their company
CREATE POLICY "Company logos are viewable by authenticated users"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated'
);

-- Policy: Allow company owners/managers to upload logos
CREATE POLICY "Company owners and managers can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated' AND
  -- Extract company_id from path: company-logos/{company_id}/filename
  (storage.foldername(name))[1] IN (
    SELECT id::text 
    FROM companies 
    WHERE id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  )
);

-- Policy: Allow company owners/managers to update logos
CREATE POLICY "Company owners and managers can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text 
    FROM companies 
    WHERE id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  )
);

-- Policy: Allow company owners/managers to delete logos
CREATE POLICY "Company owners and managers can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text 
    FROM companies 
    WHERE id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  )
);

COMMENT ON POLICY "Company logos are viewable by authenticated users" ON storage.objects IS 
  'Allows authenticated users to view company logos';
COMMENT ON POLICY "Company owners and managers can upload logos" ON storage.objects IS 
  'Restricts logo uploads to company owners and managers only';
COMMENT ON POLICY "Company owners and managers can update logos" ON storage.objects IS 
  'Restricts logo updates to company owners and managers only';
COMMENT ON POLICY "Company owners and managers can delete logos" ON storage.objects IS 
  'Restricts logo deletions to company owners and managers only';

