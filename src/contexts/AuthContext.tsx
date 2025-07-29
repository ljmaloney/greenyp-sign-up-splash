
import React, { createContext, useContext } from 'react';
import { AuthContextType, AuthProviderProps } from '@/types/auth';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthActions } from '@/hooks/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Auth Error Boundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-gray-600">Please refresh the page</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Add a try-catch wrapper around the hook calls
  try {
    const {
      user,
      setUser,
      accessToken,
      setAccessToken,
      isLoading,
      setIsLoading
    } = useAuthInitialization();

    const { login, logout, hasRole } = useAuthActions(
      setIsLoading,
      setUser,
      setAccessToken,
      user
    );

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
      <AuthErrorBoundary>
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      </AuthErrorBoundary>
    );
  } catch (error) {
    console.error('AuthProvider initialization error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }
};
