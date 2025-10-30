import { ReactNode } from 'react';
import { UserRole } from '@/lib/permissions';

interface PermissionGateProps {
  children: ReactNode;
  roles: UserRole[];
  currentRole: UserRole;
  fallback?: ReactNode;
}

export default function PermissionGate({ 
  children, 
  roles, 
  currentRole,
  fallback = null 
}: PermissionGateProps) {
  if (!roles.includes(currentRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common permission checks
interface HasPermissionProps {
  children: ReactNode;
  role: UserRole;
  currentRole: UserRole;
  fallback?: ReactNode;
}

export function HasPermission({ children, role, currentRole, fallback = null }: HasPermissionProps) {
  return PermissionGate({ children, roles: [role], currentRole, fallback });
}

export function CanManageTeam({ children, currentRole, fallback = null }: Omit<HasPermissionProps, 'role'>) {
  const roles: UserRole[] = ['owner', 'manager'];
  return PermissionGate({ children, roles, currentRole, fallback });
}

