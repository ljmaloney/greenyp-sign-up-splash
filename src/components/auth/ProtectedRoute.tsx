
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', {
    isLoading,
    isAuthenticated,
    requiredRole,
    currentPath: location.pathname,
    userRoles: user?.roles,
    userEmail: user?.email,
    userId: user?.id
  });

  if (isLoading) {
    console.log('⏳ Auth still loading, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Checking authentication...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const hasRequiredRole = (() => {
      const userRoles = user?.roles || [];
      console.log('🔍 REQUIRED ROLE CHECK:', { 
        requiredRole, 
        userRoles,
        userEmail: user?.email,
        currentPath: location.pathname
      });
      
      // Special handling for Dashboard-Access - allow both subscribers AND admins
      if (requiredRole === 'Dashboard-Access') {
        const normalizedRoles = userRoles.map(role => role.toLowerCase());
        
        // Check for subscriber roles
        const hasSubscriberRole = normalizedRoles.some(role => {
          return role.includes('subscriber') || role.includes('greepages-subscriber') || role.includes('greenpages-subscriber');
        });
        
        // FIXED: Admin role check that includes greepages-subscriber
        const hasAdminRole = normalizedRoles.some(role => {
          return role.includes('admin') || 
                 role === 'greenpages-admin' || 
                 role === 'greepages-admin' || 
                 role === 'sysadmin' ||
                 role === 'greepages-subscriber' ||  // This is actually an admin role
                 role === 'greenpages-subscriber';
        });
        
        console.log('🔍 Dashboard access check:', {
          hasSubscriberRole,
          hasAdminRole,
          normalizedRoles,
          finalResult: hasSubscriberRole || hasAdminRole
        });
        
        return hasSubscriberRole || hasAdminRole;
      }
      
      // Admin routes: allow GreenPages-Admin and SysAdmin (case insensitive)
      if (requiredRole === 'GreenPages-Admin') {
        const hasAdminRole = userRoles.some(role => {
          const normalizedRole = role.toLowerCase();
          
          // FIXED: Include greepages-subscriber as an admin role
          const isAdmin = normalizedRole === 'greenpages-admin' || 
                         normalizedRole === 'greepages-admin' ||
                         normalizedRole === 'sysadmin' ||
                         normalizedRole === 'admin' ||
                         normalizedRole === 'administrator' ||
                         normalizedRole === 'greepages-subscriber' ||  // This is actually an admin role
                         normalizedRole === 'greenpages-subscriber' ||
                         normalizedRole.includes('admin');
          
          console.log('🔧 Admin role check:', {
            role,
            normalizedRole,
            isAdmin,
            checkedAgainst: ['greenpages-admin', 'greepages-admin', 'sysadmin', 'admin', 'administrator', 'greepages-subscriber', 'greenpages-subscriber', 'contains admin']
          });
          
          return isAdmin;
        });
        console.log('🔧 Admin role check result:', hasAdminRole);
        return hasAdminRole;
      }
      
      // For any other role, check case-insensitive match
      const hasOtherRole = userRoles.some(role => 
        role.toLowerCase() === requiredRole.toLowerCase()
      );
      console.log('🎯 Other role check result:', {
        requiredRole,
        userRoles,
        hasOtherRole
      });
      return hasOtherRole;
    })();

    if (!hasRequiredRole) {
      console.log('❌ ROLE CHECK FAILED:', {
        requiredRole,
        userRoles: user?.roles,
        userEmail: user?.email,
        currentPath: location.pathname,
        redirectingTo: '/unauthorized'
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ Authentication checks passed, rendering protected content for:', {
    userEmail: user?.email,
    userRoles: user?.roles,
    currentPath: location.pathname,
    requiredRole
  });
  return <>{children}</>;
};

export default ProtectedRoute;
