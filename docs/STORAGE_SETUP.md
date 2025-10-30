# Supabase Storage Setup Guide

This guide covers setting up Supabase Storage for company logo uploads.

## Prerequisites

- Supabase project created and configured
- RLS policies migration applied (`DB/schema/120_storage_bucket_rls.sql`)

## Step 1: Create Storage Bucket

1. Open your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `company-logos`
   - **Public bucket**: ✅ **Enabled** (logos need to be publicly accessible)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/svg+xml`

5. Click **Create bucket**

## Step 2: Apply RLS Policies

The RLS policies are defined in `DB/schema/120_storage_bucket_rls.sql`. Apply this migration:

### Using Supabase Dashboard

1. Navigate to **SQL Editor** in Supabase Dashboard
2. Open `DB/schema/120_storage_bucket_rls.sql`
3. Copy and paste the SQL into the SQL Editor
4. Run the query

### Using Supabase CLI

```bash
supabase db push
```

Or apply manually:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f DB/schema/120_storage_bucket_rls.sql
```

## Step 3: Verify Setup

1. **Test Upload**: Use the logo upload feature in `/settings/company`
2. **Check Permissions**: Verify that:
   - Owners and managers can upload logos
   - Technicians cannot upload logos
   - All authenticated users can view logos
   -已验证 Users outside the company cannot access other company logos

## File Path Structure

Logos are stored with the following path structure:
```
company-logos/
  └── {company_id}/
      └── company-{company_id}-{timestamp}.{ext}
```

Example:
```
company-logos/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── company-123e4567-e89b-12d3-a456-426614174000-1699123456789.png
```

## Security

- **RLS Policies**: All access is controlled by Row Level Security policies
- **File Validation**: Server-side validation for file type and size (5MB max)
- **Permission Checks**: Only owners and managers can upload/delete logos
- **Public Access**: Logos are publicly readable but only by authenticated users (via RLS)

## Troubleshooting

### Upload Fails with "Permission Denied"

- Verify the user's role is `owner` or `manager`
- Check that RLS policies are applied correctly
- Ensure the user is authenticated (has a valid session)

### Upload Fails with "File Too Large"

- Check file size is under 5MB
- Verify bucket file size limit is set correctly in Supabase Dashboard

### Upload Fails with "Invalid File Type"

- Ensure file is one of: JPEG, PNG, WebP, or SVG
- Check MIME type detection is working correctly

### Images Not Displaying

- Verify bucket is set to **Public**
- Check that the `logo_url` is saved correctly in the `companies` table
- Ensure the URL is accessible (test in browser)

## Maintenance

### Cleaning Up Old Logos

When a logo is replaced, the old logo file is automatically deleted by the upload API route. However, if you need to manually clean up:

1. Check for orphaned files in Storage dashboard
2. Remove files that are no longer referenced in the `companies.logo_url` column

### Backup Strategy

- Logos are stored in Supabase Storage, which provides automatic backups
- Consider implementing a backup strategy for critical company assets

## Future Enhancements

- [ ] Image optimization/resizing on upload
- [ ] Support for additional image formats
- [ ] Batch logo upload for multiple companies
- [ ] Logo versioning/history
