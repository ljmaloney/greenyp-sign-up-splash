
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
  const [lastCheck, setLastCheck] = useState<number>(0);

  useEffect(() => {
    checkAuthStatus();
    
    // Reduce frequency to every 30 seconds instead of 2 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      // Only check if it's been more than 30 seconds since last check
      if (now - lastCheck > 30000) {
        checkAuthStatus();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [lastCheck]);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      setLastCheck(Date.now());
      
      const oidcUser = await oidcService.getUser();
      
      console.log('🔍 OIDC user check result:', {
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
        console.log('✅ Valid user found, transforming...');
        const userInfo = oidcService.transformUser(oidcUser);
        const transformedUser: User = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['Greepages-Subscriber']
        };
        
        // Only update state if user actually changed
        setUser(prevUser => {
          if (!prevUser || prevUser.id !== transformedUser.id) {
            console.log('✅ User set in context:', transformedUser);
            return transformedUser;
          }
          return prevUser;
        });
      } else {
        console.log('❌ No valid user found or user expired');
        setUser(prevUser => {
          if (prevUser !== null) {
            return null;
          }
          return prevUser;
        });
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(prevUser => {
        if (prevUser !== null) {
          return null;
        }
        return prevUser;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    console.log('🚀 Starting login process...');
    oidcService.login();
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      await oidcService.logout();
      setUser(null);
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await oidcService.removeUser();
      setUser(null);
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
