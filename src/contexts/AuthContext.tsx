
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { oidcService, UserInfo } from '@/services/oidcService';
import { User as OidcUser } from 'oidc-client-ts';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
          roles: userInfo.roles || ['Greepages-Subscriber']
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

        // 🚨 ROLE-BASED REDIRECTION LOGIC - Check if user should be redirected based on their role
        const currentPath = window.location.pathname;
        const userRoles = transformedUser.roles || [];
        const normalizedRoles = userRoles.map(role => role.toLowerCase());
        
        console.log('🔀 AUTH CONTEXT - Role-based redirection check:', {
          currentPath,
          userRoles,
          normalizedRoles,
          userEmail: transformedUser.email
        });

        // FIXED: Comprehensive admin role detection
        const hasAdminRole = normalizedRoles.some(userRole => {
          // Check for exact admin role matches
          const exactAdminRoles = [
            'greenpages-admin',
            'greepages-admin',
            'admin', 
            'sysadmin',
            'administrator'
          ];
          
          // Check for roles that contain "admin" OR are subscriber admin roles
          const isAdminRole = exactAdminRoles.includes(userRole) || 
                             userRole.includes('admin') ||
                             userRole === 'greepages-subscriber' ||  // This is actually an admin role
                             userRole === 'greenpages-subscriber' ||
                             userRole.includes('subscriberadmin');
          
          console.log('🔍 AUTH CONTEXT - Checking role:', userRole, {
            isExactMatch: exactAdminRoles.includes(userRole),
            containsAdmin: userRole.includes('admin'),
            isSubscriberAdmin: userRole === 'greepages-subscriber' || userRole === 'greenpages-subscriber',
            finalResult: isAdminRole
          });
          
          return isAdminRole;
        });

        console.log('🔧 AUTH CONTEXT - Admin role check:', {
          hasAdminRole,
          currentPath,
          userRoles: transformedUser.roles,
          normalizedRoles,
          detailedCheck: normalizedRoles.map(role => ({
            role,
            isAdmin: role.includes('admin') || role === 'greepages-subscriber' || role === 'greenpages-subscriber'
          }))
        });

        // If admin user is accessing non-admin routes, redirect to admin
        if (hasAdminRole && !currentPath.startsWith('/admin')) {
          console.log('🔀 AUTH CONTEXT - ADMIN USER detected on non-admin route, redirecting to /admin');
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

  const login = () => {
    console.log('🚀 AUTH CONTEXT - Starting login process...');
    setIsLoading(true);
    oidcService.login();
  };

  const logout = async () => {
    try {
      console.log('🚪 AUTH CONTEXT - Starting logout...');
      setIsLoading(true);
      await oidcService.logout();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('❌ AUTH CONTEXT - Logout failed:', error);
      await oidcService.removeUser();
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    const result = user?.roles.includes(role) ?? false;
    console.log('🔍 AUTH CONTEXT - Role check:', {
      requestedRole: role,
      userRoles: user?.roles,
      hasRole: result
    });
    return result;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    accessToken,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
