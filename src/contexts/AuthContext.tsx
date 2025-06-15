
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
      console.log('🔄 Initializing authentication (one-time check)...');
      
      const oidcUser = await oidcService.getUser();
      
      console.log('🔍 Initial auth check result:', {
        hasUser: !!oidcUser,
        userDetails: oidcUser ? {
          sub: oidcUser.profile?.sub,
          email: oidcUser.profile?.email,
          name: oidcUser.profile?.name,
          expired: oidcUser.expired,
          expiresAt: oidcUser.expires_at,
          currentTime: Math.floor(Date.now() / 1000),
          hasAccessToken: !!oidcUser.access_token
        } : 'no user'
      });
      
      if (oidcUser && !oidcUser.expired) {
        console.log('✅ Valid user found during initialization');
        const userInfo = oidcService.transformUser(oidcUser);
        const transformedUser: User = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['Greepages-Subscriber']
        };
        
        setUser(transformedUser);
        console.log('✅ User set in context:', transformedUser);
      } else {
        console.log('❌ No valid user found during initialization');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setInitialized(true);
      console.log('✅ Auth initialization complete');
    }
  };

  const login = () => {
    console.log('🚀 Starting login process...');
    setIsLoading(true);
    oidcService.login();
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      setIsLoading(true);
      await oidcService.logout();
      setUser(null);
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await oidcService.removeUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
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
