-- Split business_address into separate fields for better structure

ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS business_address_street TEXT,
  ADD COLUMN IF NOT EXISTS business_address_city TEXT,
  ADD COLUMN IF NOT EXISTS business_address_state TEXT,
  ADD COLUMN IF NOT EXISTS business_address_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS business_address_country TEXT;

COMMENT ON COLUMN companies.business_address_street IS 'Street address line';
COMMENT ON COLUMN companies.business_address_city IS 'City';
COMMENT ON COLUMN companies.business_address_state IS 'State or province';
COMMENT ON COLUMN companies.business_address_postal_code IS 'Postal or ZIP code';
COMMENT ON COLUMN companies.business_address_country IS 'Country';

-- Note: business_address (text field) is kept for backward compatibility
-- but can be deprecated in favor of the structured fields above

