// Permission checking utilities

export type UserRole = 'owner' | 'manager' | 'technician' | 'portal';

export function canManageTeam(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canManageCompany(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canInviteTeamMembers(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canUpdateMemberRole(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canRemoveTeamMember(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canDeleteCompany(role: UserRole): boolean {
  return role === 'owner';
}

export function canViewBilling(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canManageSubscription(role: UserRole): boolean {
  return role === 'owner';
}

export function canCreateProperty(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canDeleteProperty(role: UserRole): boolean {
  return role === 'owner';
}

export function canAssignTasks(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canViewReports(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canExportData(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

// Helper to check if user has at least one of the required roles
export function hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Helper to check if user has all required roles (always returns true for owner)
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === 'owner') return true;
  return userRole === requiredRole;
}

