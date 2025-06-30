
import { useState, useEffect } from 'react';
import { oidcService } from '@/services/oidcService';
import { User } from '@/types/auth';

export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run the initial auth check once when the provider mounts
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized]);

  const initializeAuth = async () => {
    try {
      console.log('🔄 AUTH CONTEXT - Initializing authentication (one-time check)...');
      
      const oidcUser = await oidcService.getUser();
      
      console.log('🔍 AUTH CONTEXT - Initial auth check result:', {
        hasUser: !!oidcUser,
        userDetails: oidcUser ? {
          sub: oidcUser.profile?.sub,
          email: oidcUser.profile?.email,
          name: oidcUser.profile?.name,
          expired: oidcUser.expired,
          expiresAt: oidcUser.expires_at,
          currentTime: Math.floor(Date.now() / 1000),
          hasAccessToken: !!oidcUser.access_token,
          accessTokenStart: oidcUser.access_token ? oidcUser.access_token.substring(0, 20) + '...' : 'none'
        } : 'no user'
      });
      
      if (oidcUser && !oidcUser.expired) {
        console.log('✅ AUTH CONTEXT - Valid user found during initialization');
        const userInfo = oidcService.transformUser(oidcUser);
        
        console.log('🔍 AUTH CONTEXT - Transformed user info:', {
          sub: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles,
          hasAccessToken: !!oidcUser.access_token
        });
        
        const transformedUser: User = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['GreenPages-Subscriber']
        };
        
        console.log('✅ AUTH CONTEXT - Final user object being set:', {
          id: transformedUser.id,
          email: transformedUser.email,
          name: transformedUser.name,
          roles: transformedUser.roles,
          hasToken: !!oidcUser.access_token
        });
        
        setUser(transformedUser);
        setAccessToken(oidcUser.access_token);
        console.log('✅ AUTH CONTEXT - User and token set in context:', { 
          user: transformedUser, 
          hasToken: !!oidcUser.access_token 
        });

        // SIMPLE ROLE-BASED REDIRECTION LOGIC
        const currentPath = window.location.pathname;
        const userRoles = transformedUser.roles || [];
        
        console.log('🔀 AUTH CONTEXT - Role-based redirection check:', {
          currentPath,
          userRoles,
          userEmail: transformedUser.email
        });

        // Check if user has GreenPages-Admin role
        const hasAdminRole = userRoles.includes('GreenPages-Admin');

        console.log('🔧 AUTH CONTEXT - Role check:', {
          hasAdminRole,
          currentPath,
          userRoles: transformedUser.roles
        });

        // If admin user is accessing non-admin routes, redirect to admin
        if (hasAdminRole && !currentPath.startsWith('/admin')) {
          console.log('🔀 AUTH CONTEXT - GreenPages-Admin detected on non-admin route, redirecting to /admin');
          console.log('🔀 AUTH CONTEXT - Redirect details:', {
            userEmail: transformedUser.email,
            currentPath,
            redirectTo: '/admin',
            reason: 'Admin user accessing non-admin route',
            userRoles: transformedUser.roles
          });
          
          // Force redirect to admin panel
          window.location.href = '/admin';
          return; // Exit early to prevent further initialization
        }

        // If non-admin user is accessing admin routes, they'll be handled by ProtectedRoute
        if (!hasAdminRole && currentPath.startsWith('/admin')) {
          console.log('🔀 AUTH CONTEXT - Non-admin user accessing admin route, will be handled by ProtectedRoute');
        }

      } else {
        console.log('❌ AUTH CONTEXT - No valid user found during initialization');
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('❌ AUTH CONTEXT - Auth initialization failed:', error);
      console.error('AUTH CONTEXT - Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
      setInitialized(true);
      console.log('✅ AUTH CONTEXT - Auth initialization complete');
    }
  };

  return {
    user,
    setUser,
    accessToken,
    setAccessToken,
    isLoading,
    setIsLoading
  };
};
