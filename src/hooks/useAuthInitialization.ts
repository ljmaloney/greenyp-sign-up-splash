
import { useState, useEffect } from 'react';
import { oidcService } from '@/services/oidcService';
import { User } from '@/types/auth';

export const useAuthInitialization = () => {
  // Add defensive checks to ensure React is properly initialized
  if (typeof useState !== 'function') {
    throw new Error('React hooks not available - React may not be properly initialized');
  }

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized]);

  const initializeAuth = async () => {
    try {
      console.log('🔄 AUTH CONTEXT - Initializing authentication...');
      console.log('📍 Current URL:', window.location.href);
      console.log('📍 Current pathname:', window.location.pathname);
      
      // Check if we're on a public route that doesn't require auth
      const publicRoutes = ['/', '/categories', '/search', '/profile', '/products', '/services', '/classifieds'];
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route)) || currentPath === '/';
      
      console.log('🔍 Route check:', { currentPath, isPublicRoute });
      
      if (isPublicRoute) {
        console.log('✅ On public route, skipping auth initialization');
        setIsLoading(false);
        setInitialized(true);
        return;
      }
      
      const oidcUser = await oidcService.getUser();
      
      console.log('🔍 AUTH CONTEXT - Initial auth check result:', {
        hasUser: !!oidcUser,
        userDetails: oidcUser ? {
          sub: oidcUser.profile?.sub,
          email: oidcUser.profile?.email,
          expired: oidcUser.expired,
          hasAccessToken: !!oidcUser.access_token
        } : 'no user'
      });
      
      if (oidcUser && !oidcUser.expired) {
        console.log('✅ AUTH CONTEXT - Valid user found during initialization');
        const userInfo = oidcService.transformUser(oidcUser);
        
        const transformedUser: User = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['GreenPages-Subscriber']
        };
        
        console.log('✅ AUTH CONTEXT - Setting user in context:', {
          id: transformedUser.id,
          email: transformedUser.email,
          roles: transformedUser.roles
        });
        
        setUser(transformedUser);
        setAccessToken(oidcUser.access_token);

        // ROLE-BASED REDIRECTION LOGIC - CASE INSENSITIVE
        const userRoles = transformedUser.roles || [];
        
        console.log('🔀 AUTH CONTEXT - Checking if redirection needed:', {
          currentPath,
          userRoles
        });

        // Only redirect if user is on root path or login-related paths
        if (currentPath === '/' || currentPath === '/login' || currentPath.startsWith('/auth/')) {
          const hasAdminRole = userRoles.some(role => 
            role.toLowerCase() === 'greenpages-admin'
          );

          const hasSubscriberRole = userRoles.some(role => {
            const lowerRole = role.toLowerCase();
            return lowerRole === 'greenpages-subscriber' || 
                   lowerRole === 'greenpages-subscriberadmin';
          });

          if (hasAdminRole) {
            console.log('🔀 AUTH CONTEXT - Admin user detected, redirecting to /admin');
            window.location.href = '/admin';
            return;
          } else if (hasSubscriberRole) {
            console.log('🔀 AUTH CONTEXT - Subscriber user detected, redirecting to /dashboard');
            window.location.href = '/dashboard';
            return;
          } else {
            console.log('🔀 AUTH CONTEXT - Unknown role, defaulting to /dashboard');
            window.location.href = '/dashboard';
            return;
          }
        } else {
          console.log('🔀 AUTH CONTEXT - User already on valid page, no redirection needed');
        }

      } else {
        console.log('❌ AUTH CONTEXT - No valid user found during initialization');
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('❌ AUTH CONTEXT - Auth initialization failed:', error);
      console.error('❌ AUTH CONTEXT - Error details:', error.message);
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
