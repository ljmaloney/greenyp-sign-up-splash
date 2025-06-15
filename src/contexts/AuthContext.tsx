
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
  loginAsPrototype: () => void;
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

  // Check if we're in a prototyping environment
  const isPrototyping = window.location.hostname.includes('lovable') || 
                       window.location.hostname === 'localhost';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      
      // In prototyping mode, check for stored prototype user first
      if (isPrototyping) {
        const prototypeUser = localStorage.getItem('prototype-user');
        if (prototypeUser) {
          console.log('🔧 Found prototype user in localStorage');
          setUser(JSON.parse(prototypeUser));
          setIsLoading(false);
          return;
        }
      }

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
        console.log('✅ User set in context:', transformedUser);
        setUser(transformedUser);
      } else {
        console.log('❌ No valid user found or user expired');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    console.log('🚀 Starting login process...');
    oidcService.login();
  };

  const loginAsPrototype = () => {
    console.log('🔧 Starting prototype login...');
    const prototypeUser: User = {
      id: 'prototype-user-123',
      email: 'prototype@example.com',
      name: 'Prototype User',
      roles: ['Greepages-Subscriber', 'Greepages-SubscriberAdmin']
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('prototype-user', JSON.stringify(prototypeUser));
    setUser(prototypeUser);
    console.log('✅ Prototype user logged in:', prototypeUser);
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      
      // Clear prototype user if in prototyping mode
      if (isPrototyping) {
        localStorage.removeItem('prototype-user');
        setUser(null);
        return;
      }

      await oidcService.logout();
      setUser(null);
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await oidcService.removeUser();
      localStorage.removeItem('prototype-user');
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
    loginAsPrototype,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
