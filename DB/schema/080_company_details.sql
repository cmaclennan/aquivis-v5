-- Add additional company details for invoicing and business operations

ALTER TABLE companies ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN companies.business_address IS 'Full business address for invoicing';
COMMENT ON COLUMN companies.phone IS 'Contact phone number';
COMMENT ON COLUMN companies.website IS 'Company website URL';
COMMENT ON COLUMN companies.tax_id IS 'Tax ID or ABN for invoicing';
COMMENT ON COLUMN companies.logo_url IS 'URL to company logo (stored in Supabase Storage)';

