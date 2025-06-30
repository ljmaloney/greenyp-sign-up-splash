
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
    // Redirect to login with the current location
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // 🚨 COMPREHENSIVE ROLE ANALYSIS
  console.log('🔍 COMPREHENSIVE ROLE ANALYSIS:', {
    userEmail: user?.email,
    userId: user?.id,
    rawRoles: user?.roles,
    currentPath: location.pathname,
    requiredRole,
    timestamp: new Date().toISOString()
  });

  // 🚨 CRITICAL: Check if admin user is trying to access dashboard
  if (user?.roles && location.pathname.startsWith('/dashboard')) {
    const userRoles = user.roles.map(role => role.toLowerCase());
    
    console.log('🔍 DASHBOARD ACCESS CHECK - DETAILED ROLE ANALYSIS:', {
      originalRoles: user.roles,
      normalizedRoles: userRoles,
      currentPath: location.pathname,
      userEmail: user.email,
      userId: user.id
    });
    
    // COMPREHENSIVE admin role patterns to match actual role names
    const adminRolePatterns = [
      'greenpages-admin',     // correct version
      'greepages-admin',      // handle typo version  
      'admin',                // generic admin
      'sysadmin',             // system admin
      'administrator'         // full administrator
    ];
    
    const hasAdminRole = userRoles.some(userRole => {
      // Direct exact matches after normalization
      const isDirectMatch = adminRolePatterns.includes(userRole);
      
      // Also check if the role contains 'admin' as fallback
      const containsAdmin = userRole.includes('admin');
      
      console.log('🔍 Individual role check:', {
        userRole,
        isDirectMatch,
        containsAdmin,
        matches: isDirectMatch || containsAdmin,
        againstPatterns: adminRolePatterns
      });
      
      return isDirectMatch || containsAdmin;
    });
    
    console.log('🔍 FINAL DASHBOARD ACCESS CHECK:', {
      currentPath: location.pathname,
      userEmail: user.email,
      userRoles: user.roles,
      normalizedRoles: userRoles,
      adminRolePatterns,
      hasAdminRole,
      shouldRedirectToAdmin: hasAdminRole,
      detailedRoleAnalysis: userRoles.map(role => ({
        role,
        isAdmin: adminRolePatterns.includes(role) || role.includes('admin')
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
      console.log('🔍 REQUIRED ROLE CHECK:', { 
        requiredRole, 
        userRoles,
        userEmail: user?.email,
        currentPath: location.pathname
      });
      
      // Dashboard routes: allow both Greepages-Subscriber and Greepages-SubscriberAdmin (case insensitive)
      if (requiredRole === 'Greepages-Subscriber') {
        const hasSubscriberRole = userRoles.some(role => {
          const normalizedRole = role.toLowerCase();
          const isSubscriber = normalizedRole === 'greepages-subscriber' || 
                              normalizedRole === 'greepages-subscriberadmin' ||
                              normalizedRole === 'greenpages-subscriber' ||  // handle typo
                              normalizedRole === 'greenpages-subscriberadmin'; // handle typo
          
          console.log('📊 Subscriber role check:', {
            role,
            normalizedRole,
            isSubscriber,
            checkedAgainst: ['greepages-subscriber', 'greepages-subscriberadmin', 'greenpages-subscriber', 'greenpages-subscriberadmin']
          });
          
          return isSubscriber;
        });
        console.log('📊 Dashboard role check result:', hasSubscriberRole);
        return hasSubscriberRole;
      }
      
      // Admin routes: allow GreenPages-Admin and SysAdmin (case insensitive)
      if (requiredRole === 'GreenPages-Admin') {
        const hasAdminRole = userRoles.some(role => {
          const normalizedRole = role.toLowerCase();
          const isAdmin = normalizedRole === 'greenpages-admin' || 
                         normalizedRole === 'greepages-admin' ||  // handle typo
                         normalizedRole === 'sysadmin' ||
                         normalizedRole === 'admin' ||
                         normalizedRole === 'administrator' ||
                         normalizedRole.includes('admin'); // Fallback for any admin role
          
          console.log('🔧 Admin role check:', {
            role,
            normalizedRole,
            isAdmin,
            checkedAgainst: ['greenpages-admin', 'greepages-admin', 'sysadmin', 'admin', 'administrator', 'contains admin']
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
      // User doesn't have required role, redirect to unauthorized page
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
