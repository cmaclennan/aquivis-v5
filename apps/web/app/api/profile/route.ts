import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';
import { profileUpdateSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Get authenticated user (uses getUser() for security)
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient(false, req);

    // Update profile - RLS policy now allows users to update their own profile
    // The profile_user_update_own policy ensures users can only update first_name, last_name
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: validation.data.first_name || null,
        last_name: validation.data.last_name || null,
        updated_by: user.id,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in profile update:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

