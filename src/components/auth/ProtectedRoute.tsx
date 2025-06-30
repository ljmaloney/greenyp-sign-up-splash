
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
    const userRoles = user?.roles || [];
    console.log('🔍 PROTECTED ROUTE - Starting role check:', { 
      requiredRole, 
      userRoles,
      userEmail: user?.email,
      currentPath: location.pathname
    });
    
    let hasRequiredRole = false;
    
    // Handle special Dashboard-Access role for both subscribers and admins
    if (requiredRole === 'Dashboard-Access') {
      console.log('🎯 PROTECTED ROUTE - Checking Dashboard-Access (subscriber or admin roles)');
      
      hasRequiredRole = userRoles.some(role => {
        const normalizedRole = role.toLowerCase();
        const isDashboardAccessRole = normalizedRole === 'greenpages-subscriber' || 
               normalizedRole === 'greepages-subscriber' ||
               role === 'GreenPages-Subscriber' || 
               role === 'GreenPages-SubscriberAdmin' || 
               role === 'GreenPages-Admin';
               
        console.log('🔍 PROTECTED ROUTE - Role check detail:', {
          role,
          normalizedRole,
          isDashboardAccessRole,
          checkingAgainst: 'Dashboard-Access'
        });
        
        return isDashboardAccessRole;
      });
      
      console.log('🎯 PROTECTED ROUTE - Dashboard access check result:', {
        userRoles,
        hasRequiredRole,
        checkingFor: 'Dashboard-Access (subscriber or admin roles)'
      });
    } 
    // Handle GreenPages-Admin role check
    else if (requiredRole === 'GreenPages-Admin') {
      console.log('🔧 PROTECTED ROUTE - Checking GreenPages-Admin role');
      
      hasRequiredRole = userRoles.some(role => {
        const normalizedRole = role.toLowerCase();
        const isAdminRole = normalizedRole === 'greenpages-admin' || 
               normalizedRole === 'greepages-admin' ||
               role === 'GreenPages-Admin';
               
        console.log('🔍 PROTECTED ROUTE - Admin role check detail:', {
          role,
          normalizedRole,
          isAdminRole,
          checkingAgainst: 'GreenPages-Admin'
        });
        
        return isAdminRole;
      });
      
      console.log('🔧 PROTECTED ROUTE - Admin role check result:', {
        userRoles,
        hasRequiredRole
      });
    } 
    // Handle exact role match for other roles
    else {
      console.log('🎯 PROTECTED ROUTE - Checking exact role match for:', requiredRole);
      
      hasRequiredRole = userRoles.includes(requiredRole);
      
      console.log('🎯 PROTECTED ROUTE - Exact role check result:', {
        requiredRole,
        userRoles,
        hasRequiredRole
      });
    }

    if (!hasRequiredRole) {
      console.log('❌ PROTECTED ROUTE - ROLE CHECK FAILED:', {
        requiredRole,
        userRoles,
        userEmail: user?.email,
        currentPath: location.pathname,
        redirectingTo: '/unauthorized',
        finalDecision: 'ACCESS DENIED'
      });
      return <Navigate to="/unauthorized" replace />;
    } else {
      console.log('✅ PROTECTED ROUTE - ROLE CHECK PASSED:', {
        requiredRole,
        userRoles,
        userEmail: user?.email,
        currentPath: location.pathname,
        finalDecision: 'ACCESS GRANTED'
      });
    }
  }

  console.log('✅ PROTECTED ROUTE - All authentication checks passed, rendering protected content for:', {
    userEmail: user?.email,
    userRoles: user?.roles,
    currentPath: location.pathname,
    requiredRole,
    finalDecision: 'CONTENT RENDERED'
  });
  return <>{children}</>;
};

export default ProtectedRoute;
