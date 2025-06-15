
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
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', {
    isLoading,
    isAuthenticated,
    requiredRole,
    currentPath: location.pathname
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
      // Dashboard routes: allow both Greepages-Subscriber and Greepages-SubscriberAdmin
      if (requiredRole === 'Greepages-Subscriber') {
        return hasRole('Greepages-Subscriber') || hasRole('Greepages-SubscriberAdmin');
      }
      
      // Admin routes: allow both GreenPages-Admin and SysAdmin
      if (requiredRole === 'GreenPages-Admin') {
        return hasRole('GreenPages-Admin') || hasRole('SysAdmin');
      }
      
      // For any other role, check exact match
      return hasRole(requiredRole);
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
