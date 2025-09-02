
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RBACGuard } from '@/components/RBAC/RBACGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredResource?: string;
  requiredAction?: string;
  organizationId?: string;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requiredResource,
  requiredAction,
  organizationId,
  fallbackPath = '/auth'
}: ProtectedRouteProps) => {
  const location = useLocation();

  // If authentication is required, wrap in AuthGuard
  if (requireAuth) {
    return (
      <AuthGuard>
        {/* If RBAC is required, wrap in RBACGuard */}
        {requiredResource && requiredAction ? (
          <RBACGuard 
            resource={requiredResource}
            action={requiredAction}
            organizationId={organizationId}
            fallback={<Navigate to={fallbackPath} state={{ from: location }} replace />}
          >
            {children}
          </RBACGuard>
        ) : (
          children
        )}
      </AuthGuard>
    );
  }

  // If only RBAC is required (for already authenticated contexts)
  if (requiredResource && requiredAction) {
    return (
      <RBACGuard 
        resource={requiredResource}
        action={requiredAction}
        organizationId={organizationId}
        fallback={<Navigate to={fallbackPath} state={{ from: location }} replace />}
      >
        {children}
      </RBACGuard>
    );
  }

  // No protection required
  return <>{children}</>;
};
