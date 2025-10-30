import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';
import { teamRoleUpdateSchema } from '@/lib/validation';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const memberId = params.id;

  try {
    const body = await req.json();

    // Validate input
    const validation = teamRoleUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Get current user's profile
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!currentUser?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if user can manage team (must be owner or manager)
    if (currentUser.role !== 'owner' && currentUser.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only owners and managers can update team members' },
        { status: 403 }
      );
    }

    // Get member being updated
    const { data: member } = await supabase
      .from('profiles')
      .select('id, company_id, role')
      .eq('id', memberId)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Ensure member is in same company
    if (member.company_id !== currentUser.company_id) {
      return NextResponse.json(
        { error: 'Member not in your company' },
        { status: 403 }
      );
    }

    // Prevent changing role if only owner
    if (member.role === 'owner') {
      const { data: ownerCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', currentUser.company_id)
        .eq('role', 'owner');

      if (ownerCount && ownerCount.length <= 1) {
        return NextResponse.json(
          { error: 'Cannot change role of the only owner' },
          { status: 400 }
        );
      }
    }

    // Update member role with audit trail
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_by: user.id })
      .eq('id', memberId)
      .eq('company_id', currentUser.company_id);

    if (error) {
      console.error('Error updating member role:', error);
      return NextResponse.json(
        { error: 'Failed to update member role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in team role update:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const memberId = params.id;

  try {
    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Prevent self-deletion
    if (user.id === memberId) {
      return NextResponse.json(
        { error: 'Cannot remove yourself from the team' },
        { status: 400 }
      );
    }

    // Get current user's profile
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!currentUser?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if user can manage team (must be owner or manager)
    if (currentUser.role !== 'owner' && currentUser.role !== 'manager') {
      return NextResponse.json(
        { error: 'Only owners and managers can remove team members' },
        { status: 403 }
      );
    }

    // Get member being removed
    const { data: member } = await supabase
      .from('profiles')
      .select('id, company_id, role')
      .eq('id', memberId)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Ensure member is in same company
    if (member.company_id !== currentUser.company_id) {
      return NextResponse.json(
        { error: 'Member not in your company' },
        { status: 403 }
      );
    }

    // Prevent removing last owner
    if (member.role === 'owner') {
      const { data: ownerCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', currentUser.company_id)
        .eq('role', 'owner');

      if (ownerCount && ownerCount.length <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the only owner' },
          { status: 400 }
        );
      }
    }

    // Remove member (set company_id to null)
    const { error } = await supabase
      .from('profiles')
      .update({ company_id: null })
      .eq('id', memberId);

    if (error) {
      console.error('Error removing member:', error);
      return NextResponse.json(
        { error: 'Failed to remove team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in team member removal:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

