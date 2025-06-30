
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
    userRoles: user?.roles
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
    // Redirect to login with the current location
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // 🚨 CRITICAL: Check if admin user is trying to access dashboard
  if (user?.roles && location.pathname.startsWith('/dashboard')) {
    const userRoles = user.roles.map(role => role.toLowerCase());
    
    // Fix the admin role patterns to match actual role names
    const adminRolePatterns = [
      'greenpages-admin',     // exact match
      'greenp ages-admin',    // handle potential spaces
      'admin',                // generic admin
      'sysadmin'             // system admin
    ];
    
    const hasAdminRole = userRoles.some(userRole => 
      adminRolePatterns.some(pattern => 
        userRole.includes(pattern.replace(/\s+/g, '').toLowerCase()) ||
        pattern.replace(/\s+/g, '').toLowerCase().includes(userRole)
      )
    );
    
    console.log('🔍 Dashboard access check for potential admin:', {
      currentPath: location.pathname,
      userRoles: user.roles,
      normalizedRoles: userRoles,
      adminRolePatterns,
      hasAdminRole,
      shouldRedirectToAdmin: hasAdminRole,
      detailedCheck: userRoles.map(role => ({
        role,
        matchesAnyPattern: adminRolePatterns.some(pattern => 
          role.includes(pattern.replace(/\s+/g, '').toLowerCase()) ||
          pattern.replace(/\s+/g, '').toLowerCase().includes(role)
        )
      }))
    });
    
    if (hasAdminRole) {
      console.log('🔀 ADMIN USER detected accessing dashboard - redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
  }

  if (requiredRole) {
    const hasRequiredRole = (() => {
      const userRoles = user?.roles || [];
      console.log('🔍 Checking roles:', { requiredRole, userRoles });
      
      // Dashboard routes: allow both Greepages-Subscriber and Greepages-SubscriberAdmin (case insensitive)
      if (requiredRole === 'Greepages-Subscriber') {
        const hasSubscriberRole = userRoles.some(role => 
          role.toLowerCase() === 'greepages-subscriber' || 
          role.toLowerCase() === 'greepages-subscriberadmin'
        );
        console.log('📊 Dashboard role check result:', hasSubscriberRole);
        return hasSubscriberRole;
      }
      
      // Admin routes: allow GreenPages-Admin and SysAdmin (case insensitive) - FIXED PATTERN
      if (requiredRole === 'GreenPages-Admin') {
        const hasAdminRole = userRoles.some(role => {
          const normalizedRole = role.toLowerCase().replace(/\s+/g, '');
          return normalizedRole === 'greenpages-admin' || 
                 normalizedRole === 'greenp ages-admin' ||
                 normalizedRole === 'sysadmin' ||
                 normalizedRole === 'admin';
        });
        console.log('🔧 Admin role check result:', hasAdminRole);
        return hasAdminRole;
      }
      
      // For any other role, check case-insensitive match
      const hasOtherRole = userRoles.some(role => 
        role.toLowerCase() === requiredRole.toLowerCase()
      );
      console.log('🎯 Other role check result:', hasOtherRole);
      return hasOtherRole;
    })();

    if (!hasRequiredRole) {
      console.log('❌ User lacks required role, redirecting to unauthorized');
      // User doesn't have required role, redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ Authentication checks passed, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
