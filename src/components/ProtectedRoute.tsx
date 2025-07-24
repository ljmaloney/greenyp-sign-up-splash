
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ PROTECTED ROUTE - Auth check:', {
    isLoading,
    isAuthenticated,
    requiredRole,
    currentPath: location.pathname,
    userRoles: user?.roles,
    userEmail: user?.email
  });

  if (isLoading) {
    console.log('⏳ PROTECTED ROUTE - Auth still loading');
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
    console.log('❌ PROTECTED ROUTE - User not authenticated, redirecting to login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const userRoles = user?.roles || [];
    console.log('🔍 PROTECTED ROUTE - Starting role check:', { 
      requiredRole, 
      userRoles,
      userEmail: user?.email
    });
    
    let hasRequiredRole = false;
    
    if (requiredRole === 'Dashboard-Access') {
      hasRequiredRole = userRoles.some(role => {
        const lowerRole = role.toLowerCase();
        return lowerRole === 'greenpages-subscriber' || 
               lowerRole === 'greenpages-subscriberadmin' || 
               lowerRole === 'greenpages-admin';
      });
    } else if (requiredRole === 'GreenPages-Admin') {
      hasRequiredRole = userRoles.some(role => 
        role.toLowerCase() === 'greenpages-admin'
      );
    } else {
      hasRequiredRole = userRoles.includes(requiredRole);
    }

    if (!hasRequiredRole) {
      console.log('❌ PROTECTED ROUTE - ACCESS DENIED');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export { ProtectedRoute };
