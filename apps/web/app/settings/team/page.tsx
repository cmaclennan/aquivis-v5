'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { teamInviteSchema, teamRoleUpdateSchema } from '@/lib/validation';
import { useToast } from '@/lib/toast';

interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
  invited_by: {
    id: string;
    name: string;
  } | null;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'manager' | 'technician'>('technician');
  const [inviteError, setInviteError] = useState('');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadTeam() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session in team page');
          setLoading(false);
          return;
        }

        console.log('Loading team for user:', session.user.id);

        // Get company_id and role from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id, role')
          .eq('id', session.user.id)
          .single();

        console.log('Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setLoading(false);
          return;
        }

        if (!profile?.company_id) {
          console.log('No company_id found');
          setLoading(false);
          return;
        }

        console.log('Found company_id:', profile.company_id);
        setCurrentUserRole(profile.role);
        setCurrentUserId(session.user.id);

        // Get all team members
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, role, created_at')
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false });
        
        console.log('Team query result:', { data, error });

        if (error) {
          console.error('Error loading team:', error);
        } else if (data) {
          console.log('Team data loaded:', data.length, 'members');
          setTeam(data);
        }
      } catch (err) {
        console.error('Unexpected error loading team:', err);
      } finally {
        setLoading(false);
      }
    }

    async function loadPendingInvitations() {
      try {
        const res = await fetch('/api/team/invitations');
        if (res.ok) {
          const data = await res.json();
          setPendingInvitations(data.invitations || []);
        }
      } catch (err) {
        console.error('Error loading pending invitations:', err);
      }
    }

    loadTeam();
    loadPendingInvitations();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');

    try {
      const validation = teamInviteSchema.safeParse({ email: inviteEmail, role: inviteRole });
      if (!validation.success) {
        setInviteError(validation.error.issues[0].message);
        return;
      }

      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInviteError(data.error || 'Failed to send invitation');
        return;
      }

      // Success
      setInviteEmail('');
      setInviteRole('technician');
      showSuccess('Invitation sent successfully!');

      // Reload pending invitations
      const resInvites = await fetch('/api/team/invitations');
      if (resInvites.ok) {
        const inviteData = await resInvites.json();
        setPendingInvitations(inviteData.invitations || []);
      }
    } catch (err) {
      console.error('Error sending invitation:', err);
      setInviteError('Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRoleUpdate(memberId: string, newRole: string) {
    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        showError(data.error || 'Failed to update role');
        return;
      }

      // Update local state
      setTeam(team.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      setEditingMember(null);
      showSuccess('Role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      showError('Failed to update role');
    }
  }

  async function handleRemoveMember(memberId: string, memberEmail: string) {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        showError(data.error || 'Failed to remove member');
        return;
      }

      // Update local state
      setTeam(team.filter(m => m.id !== memberId));
      showSuccess('Team member removed successfully');
    } catch (err) {
      console.error('Error removing member:', err);
      showError('Failed to remove member');
    }
  }

  const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'manager';

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-base text-gray-600">Manage your team members</p>
        </div>
      </div>

      {canManageTeam && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                />
                <Select
                  label="Role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  required
                >
                  <option value="technician">Technician</option>
                  <option value="manager">Manager</option>
                  {currentUserRole === 'owner' && <option value="owner">Owner</option>}
                </Select>
                <Button type="submit" disabled={inviteLoading} className="mt-6">
                  {inviteLoading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
              {inviteError && (
                <p className="text-sm text-danger">{inviteError}</p>
              )}
            </form>
          </CardBody>
        </Card>
      )}

      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Pending Invitations</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => {
                const expiresAt = new Date(invitation.expires_at);
                const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {invitation.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{invitation.email}</p>
                        <p className="text-sm text-gray-600">
                          Invited as <span className="capitalize">{invitation.role}</span>
                          {invitation.invited_by && ` by ${invitation.invited_by.name}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {daysUntilExpiry > 0 
                            ? `Expires in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}`
                            : 'Expired'}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardBody>
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </CardBody>
        </Card>
      ) : (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        </CardHeader>
        <CardBody>
          {team.length === 0 ? (
            <EmptyState
              title="No team members yet"
              description="Start by inviting team members to collaborate"
            />
          ) : (
            <div className="space-y-3">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {member.first_name?.[0] || member.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {member.first_name && member.last_name
                          ? `${member.first_name} ${member.last_name}`
                          : member.email}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {editingMember === member.id ? (
                      <>
                        <Select
                          value={member.role}
                          onChange={(e) => handleRoleUpdate(member.id, e.target.value)}
                          className="min-w-[120px]"
                        >
                          <option value="technician">Technician</option>
                          <option value="manager">Manager</option>
                          {currentUserRole === 'owner' && <option value="owner">Owner</option>}
                        </Select>
                        <Button variant="ghost" onClick={() => setEditingMember(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">
                          {member.role}
                        </span>
                        {canManageTeam && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMember(member.id)}
                              className="text-sm text-primary hover:text-primary/80 font-medium"
                            >
                              Edit
                            </button>
                            {member.id !== currentUserId && (
                              <button
                                onClick={() => handleRemoveMember(member.id, member.email)}
                                className="text-sm text-danger hover:text-danger/80 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      )}
    </div>
  );
}
