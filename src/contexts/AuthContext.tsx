
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
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
    // Check if user is already authenticated (e.g., from localStorage or token)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // This is where you'd integrate with FusionAuth or your backend
      // For now, we'll check localStorage for a mock implementation
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This is where you'd call your FusionAuth login endpoint
      // For mock purposes, we'll simulate a successful login
      
      // Mock API call - replace with actual FusionAuth integration
      const mockUser: User = {
        id: '1',
        email,
        name: 'User Name',
        roles: (() => {
          // Mock role assignment based on email for testing
          if (email.includes('admin@')) {
            return ['GreenPages-Admin', 'Greepages-Subscriber'];
          } else if (email.includes('sysadmin@')) {
            return ['SysAdmin', 'GreenPages-Admin', 'Greepages-Subscriber'];
          } else if (email.includes('subadmin@')) {
            return ['Greepages-SubscriberAdmin', 'Greepages-Subscriber'];
          } else {
            return ['Greepages-Subscriber'];
          }
        })()
      };
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call your logout endpoint here
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
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
