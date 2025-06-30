
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
      
      // Admin routes: allow GreenPages-Admin and SysAdmin (case insensitive)
      if (requiredRole === 'GreenPages-Admin') {
        const hasAdminRole = userRoles.some(role => 
          role.toLowerCase() === 'greenpages-admin' || 
          role.toLowerCase() === 'sysadmin' ||
          role.toLowerCase() === 'admin'
        );
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
