import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/signup?error=invalid_token', req.url));
  }

  try {
    // Check if invitation exists and is valid
    const supabase = await createServerClient(false, req);
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('id, email, role, company_id, expires_at, accepted_at')
      .eq('token', token)
      .single();

    if (error || !invitation) {
      return NextResponse.redirect(new URL('/signup?error=invalid_invitation', req.url));
    }

    if (invitation.accepted_at) {
      return NextResponse.redirect(new URL('/login?message=invitation_already_accepted', req.url));
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/signup?error=invitation_expired', req.url));
    }

    // Show signup page with pre-filled email and company_id
    return NextResponse.redirect(
      new URL(`/signup?invite=true&email=${encodeURIComponent(invitation.email)}&company=${invitation.company_id}&role=${invitation.role}&token=${token}`, req.url)
    );
  } catch (err) {
    console.error('Error accepting invitation:', err);
    return NextResponse.redirect(new URL('/signup?error=server_error', req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token, userId } = await req.json();

    if (!token || !userId) {
      return NextResponse.json({ error: 'Token and user ID required' }, { status: 400 });
    }

    // Get invitation
    const supabase = await createServerClient(false, req);
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('id, email, role, company_id, expires_at, accepted_at')
      .eq('token', token)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
    }

    if (invitation.accepted_at) {
      return NextResponse.json({ error: 'Invitation already accepted' }, { status: 400 });
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (!profile || profile.email !== invitation.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // Update profile with company and role (invitation acceptance)
    // Note: created_by should be the person who sent the invitation
    const { data: invitationDetails } = await supabase
      .from('invitations')
      .select('invited_by')
      .eq('id', invitation.id)
      .single();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        company_id: invitation.company_id,
        role: invitation.role,
        updated_by: invitationDetails?.invited_by || userId,
        // Set created_by if this is first time joining company
        created_by: invitationDetails?.invited_by || userId,
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
    }

    // Mark invitation as accepted
    await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error processing invitation:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

