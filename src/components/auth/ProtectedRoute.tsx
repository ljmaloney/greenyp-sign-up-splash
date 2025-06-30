
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
      // Allow both subscriber and admin roles for dashboard access
      hasRequiredRole = userRoles.some(role => {
        const lowerRole = role.toLowerCase();
        return lowerRole === 'greenpages-subscriber' || 
               lowerRole === 'greenpages-subscriberadmin' || 
               lowerRole === 'greenpages-admin';
      });
      
      console.log('🎯 PROTECTED ROUTE - Dashboard access check:', {
        userRoles,
        hasRequiredRole
      });
    } else if (requiredRole === 'GreenPages-Admin') {
      // Only allow admin role
      hasRequiredRole = userRoles.some(role => 
        role.toLowerCase() === 'greenpages-admin'
      );
      
      console.log('🔧 PROTECTED ROUTE - Admin role check:', {
        userRoles,
        hasRequiredRole
      });
    } else {
      // Exact role match
      hasRequiredRole = userRoles.includes(requiredRole);
      
      console.log('🎯 PROTECTED ROUTE - Exact role check:', {
        requiredRole,
        userRoles,
        hasRequiredRole
      });
    }

    if (!hasRequiredRole) {
      console.log('❌ PROTECTED ROUTE - ACCESS DENIED:', {
        requiredRole,
        userRoles,
        userEmail: user?.email,
        redirectingTo: '/unauthorized'
      });
      return <Navigate to="/unauthorized" replace />;
    } else {
      console.log('✅ PROTECTED ROUTE - ACCESS GRANTED:', {
        requiredRole,
        userRoles,
        userEmail: user?.email
      });
    }
  }

  console.log('✅ PROTECTED ROUTE - Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
