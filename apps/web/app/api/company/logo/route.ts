import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';

const BUCKET_NAME = 'company-logos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const companyId = formData.get('company_id') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, SVG' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Verify user belongs to this company and has permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.company_id !== companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (profile.role !== 'owner' && profile.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only owners and managers can upload logos' },
        { status: 403 }
      );
    }

    // Generate unique filename: company-{companyId}-{timestamp}.{ext}
    const fileExt = file.name.split('.').pop();
    const fileName = `company-${companyId}-${Date.now()}.${fileExt}`;
    const filePath = `${companyId}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite, create new file
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload logo' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Get current logo URL before updating
    const { data: currentCompany } = await supabase
      .from('companies')
      .select('logo_url')
      .eq('id', companyId)
      .single();

    const oldLogoUrl = currentCompany?.logo_url;

    // Update company record with new logo URL
    const { error: updateError } = await supabase
      .from('companies')
      .update({ logo_url: publicUrl })
      .eq('id', companyId);

    if (updateError) {
      // Try to delete the uploaded file if database update fails
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);
      
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to save logo URL' },
        { status: 500 }
      );
    }

    // Delete old logo if it exists and is different from the new one
    if (oldLogoUrl && oldLogoUrl !== publicUrl) {
      try {
        const oldUrl = new URL(oldLogoUrl);
        const pathParts = oldUrl.pathname.split('/');
        const pathIndex = pathParts.indexOf(BUCKET_NAME);
        if (pathIndex !== -1 && pathIndex < pathParts.length - 1) {
          const oldFilePath = pathParts.slice(pathIndex + 1).join('/');
          // Delete old file (don't fail if it doesn't exist)
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([oldFilePath]);
        }
      } catch (cleanupError) {
        // Log but don't fail the request if cleanup fails
        console.error('Error cleaning up old logo:', cleanupError);
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    });
  } catch (err) {
    console.error('Error uploading logo:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('company_id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Verify user belongs to this company and has permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.company_id !== companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (profile.role !== 'owner' && profile.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only owners and managers can delete logos' },
        { status: 403 }
      );
    }

    // Get current logo URL to extract path
    const { data: company } = await supabase
      .from('companies')
      .select('logo_url')
      .eq('id', companyId)
      .single();

    if (company?.logo_url) {
      // Extract file path from URL
      const url = new URL(company.logo_url);
      const pathParts = url.pathname.split('/');
      const pathIndex = pathParts.indexOf(BUCKET_NAME);
      if (pathIndex !== -1 && pathIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(pathIndex + 1).join('/');
        
        // Delete from storage
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);
      }
    }

    // Update company record
    const { error } = await supabase
      .from('companies')
      .update({ logo_url: null })
      .eq('id', companyId);

    if (error) {
      console.error('Error removing logo:', error);
      return NextResponse.json(
        { error: 'Failed to remove logo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting logo:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

