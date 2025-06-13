
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { oidcService, UserInfo } from '@/services/oidcService';

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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const tokens = oidcService.getStoredTokens();
      const storedUser = localStorage.getItem('oidc_user');
      
      if (tokens && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      oidcService.clearStoredTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const authUrl = oidcService.generateAuthUrl();
    window.location.href = authUrl;
  };

  const logout = async () => {
    try {
      await oidcService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      oidcService.clearStoredTokens();
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
