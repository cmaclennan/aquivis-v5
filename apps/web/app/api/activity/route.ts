import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getServerUser } from '@/lib/supabaseServer';

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

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category'); // 'company', 'team', or null for all

    // Build query - filter by company through entity relationships
    let query = supabase
      .from('companies')
      .select(`
        id,
        name,
        created_at,
        updated_at,
        created_by,
        updated_by,
        created_by_profile:profiles!companies_created_by_fkey(id, email, first_name, last_name),
        updated_by_profile:profiles!companies_updated_by_fkey(id, email, first_name, last_name)
      `)
      .eq('id', profile.company_id)
      .order('updated_at', { ascending: false })
      .limit(limit);

    // For now, we'll fetch activities manually by querying the view
    // The view would need RLS policies, so let's query directly
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('created_at, updated_at, created_by, updated_by, name')
      .eq('id', profile.company_id)
      .single();

    if (companyError) {
      console.error('Error fetching company:', companyError);
    }

    // Get team member activities
    const { data: teamMembers, error: teamError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role, created_at, updated_at, created_by, updated_by')
      .eq('company_id', profile.company_id)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (teamError) {
      console.error('Error fetching team:', teamError);
    }

    // Get user profiles for lookups
    const allUserIds = new Set<string>();
    if (company?.created_by) allUserIds.add(company.created_by);
    if (company?.updated_by) allUserIds.add(company.updated_by);
    teamMembers?.forEach(m => {
      if (m.created_by) allUserIds.add(m.created_by);
      if (m.updated_by) allUserIds.add(m.updated_by);
    });

    const userIds = Array.from(allUserIds);
    let users: any[] = [];
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .in('id', userIds);
      users = usersData || [];
    }

    const userMap = new Map(users.map(u => [u.id, u]));

    // Build activity log entries
    const activities: any[] = [];

    // Company activities
    if (company) {
      if (company.created_by && (!category || category === 'company')) {
        const user = userMap.get(company.created_by);
        activities.push({
          id: `company-created-${company.created_at}`,
          entity_type: 'company',
          entity_name: company.name,
          user: user ? {
            email: user.email,
            name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
          } : { email: 'Unknown', name: 'Unknown' },
          timestamp: company.created_at,
          action: 'created',
          category: 'company',
          details: { name: company.name },
        });
      }
      if (company.updated_by && (!category || category === 'company')) {
        const user = userMap.get(company.updated_by);
        activities.push({
          id: `company-updated-${company.updated_at}`,
          entity_type: 'company',
          entity_name: company.name,
          user: user ? {
            email: user.email,
            name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
          } : { email: 'Unknown', name: 'Unknown' },
          timestamp: company.updated_at,
          action: 'updated',
          category: 'company',
          details: { name: company.name },
        });
      }
    }

    // Team activities
    if (teamMembers && (!category || category === 'team')) {
      teamMembers.forEach(member => {
        if (member.created_by) {
          const user = userMap.get(member.created_by);
          activities.push({
            id: `profile-created-${member.created_at}`,
            entity_type: 'profile',
            entity_name: member.email,
            user: user ? {
              email: user.email,
              name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
            } : { email: 'Unknown', name: 'Unknown' },
            timestamp: member.created_at,
            action: 'created',
            category: 'team',
            details: {
              email: member.email,
              role: member.role,
              name: member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : member.email,
            },
          });
        }
        if (member.updated_by && member.updated_at !== member.created_at) {
          const user = userMap.get(member.updated_by);
          activities.push({
            id: `profile-updated-${member.updated_at}`,
            entity_type: 'profile',
            entity_name: member.email,
            user: user ? {
              email: user.email,
              name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
            } : { email: 'Unknown', name: 'Unknown' },
            timestamp: member.updated_at,
            action: 'updated',
            category: 'team',
            details: {
              email: member.email,
              role: member.role,
              name: member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : member.email,
            },
          });
        }
      });
    }

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit results
    const limited = activities.slice(0, limit);

    return NextResponse.json({ activities: limited });
  } catch (err) {
    console.error('Error fetching activity log:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

