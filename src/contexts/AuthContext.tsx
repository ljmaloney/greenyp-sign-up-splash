
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
  const [cachedUser, setCachedUser] = useState<User | null>(null);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Cache expiry time: 5 minutes
  const CACHE_EXPIRY = 5 * 60 * 1000;

  useEffect(() => {
    // Only check auth once on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress) {
      console.log('🔄 Auth check already in progress, skipping...');
      return;
    }

    const now = Date.now();
    
    // If we have a cached user and it's still fresh, use it
    if (cachedUser && (now - lastAuthCheck) < CACHE_EXPIRY) {
      console.log('✅ Using cached user data, no need to check auth service');
      setUser(cachedUser);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking auth status (cache expired or no cached user)...');
      setAuthCheckInProgress(true);
      setLastAuthCheck(now);
      
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
        console.log('✅ Valid user found, transforming and caching...');
        const userInfo = oidcService.transformUser(oidcUser);
        const transformedUser: User = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['Greepages-Subscriber']
        };
        
        // Cache the user data
        setCachedUser(transformedUser);
        setUser(transformedUser);
        console.log('✅ User cached and set in context:', transformedUser);
      } else {
        console.log('❌ No valid user found or user expired, clearing cache');
        setCachedUser(null);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setCachedUser(null);
      setUser(null);
    } finally {
      setIsLoading(false);
      setAuthCheckInProgress(false);
    }
  };

  const login = () => {
    console.log('🚀 Starting login process...');
    // Clear cache on login attempt
    setCachedUser(null);
    setLastAuthCheck(0);
    oidcService.login();
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      await oidcService.logout();
      // Clear cache on logout
      setCachedUser(null);
      setLastAuthCheck(0);
      setUser(null);
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await oidcService.removeUser();
      setCachedUser(null);
      setLastAuthCheck(0);
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
