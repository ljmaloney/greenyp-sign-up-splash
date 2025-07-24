
import React, { useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Leaf } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    console.log('🔍 Login component - Auth state:', {
      isAuthenticated,
      isLoading,
      from,
      currentPath: location.pathname
    });
  }, [isAuthenticated, isLoading, from, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <span>Checking authentication...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = () => {
    console.log('🚀 Initiating login process...');
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white" 
            >
              Sign in with OpenID Connect
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex gap-6 justify-center">
            <Link
                to={`/subscribers/signup`}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
            >
              List Your Business
            </Link>
            <Link
                to={`/subscribers`}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
            >
              More Information
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
