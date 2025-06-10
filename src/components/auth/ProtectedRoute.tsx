
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Checking authentication...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // User doesn't have required role, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
