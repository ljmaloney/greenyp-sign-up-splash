
import { useState, useEffect } from 'react';
import { oidcService } from '@/services/oidcService';
import { User } from '@/types/auth';

export const useAuthInitialization = () => {
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
        const currentPath = window.location.pathname;
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

          if (hasAdminRole) {
            console.log('🔀 AUTH CONTEXT - Admin user on root/login, redirecting to /admin');
            window.location.href = '/admin';
            return;
          } else {
            console.log('🔀 AUTH CONTEXT - Subscriber user on root/login, redirecting to /dashboard');
            window.location.href = '/dashboard';
            return;
          }
        }

      } else {
        console.log('❌ AUTH CONTEXT - No valid user found during initialization');
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('❌ AUTH CONTEXT - Auth initialization failed:', error);
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
