import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';

// GET /api/team/invitations - Get pending invitations for current company
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Get user's company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get pending invitations (not accepted, not expired)
    const { data: invitations, error } = await supabase
      .from('invitations')
      .select('id, email, role, invited_by, created_at, expires_at')
      .eq('company_id', profile.company_id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }

    // Get inviter names
    const inviterIds = [...new Set(invitations?.map(inv => inv.invited_by).filter(Boolean) || [])];
    const { data: inviters } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', inviterIds);

    const inviterMap = new Map(inviters?.map(inv => [inv.id, inv]) || []);

    const invitationsWithInviter = invitations?.map(inv => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      created_at: inv.created_at,
      expires_at: inv.expires_at,
      invited_by: inv.invited_by ? {
        id: inv.invited_by,
        name: inviterMap.get(inv.invited_by)
          ? `${inviterMap.get(inv.invited_by)!.first_name || ''} ${inviterMap.get(inv.invited_by)!.last_name || ''}`.trim() || inviterMap.get(inv.invited_by)!.email
          : 'Unknown',
      } : null,
    })) || [];

    return NextResponse.json({ invitations: invitationsWithInviter });
  } catch (err) {
    console.error('Error in GET /api/team/invitations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

