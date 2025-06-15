
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Leaf } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loginAsPrototype } = useAuth();
  const location = useLocation();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Check if we're in a prototyping environment (Lovable platform)
  const isPrototyping = window.location.hostname.includes('lovable') || 
                       window.location.hostname === 'localhost';

  // If already authenticated, redirect to intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = () => {
    if (isPrototyping) {
      // In prototyping mode, offer both options but don't auto-redirect
      login(); // Try real OIDC first
    } else {
      login();
    }
  };

  const handlePrototypeLogin = () => {
    loginAsPrototype();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sign in to your account
          </CardTitle>
          {isPrototyping && (
            <p className="text-sm text-gray-600 mt-2">
              Development environment detected
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white" 
            >
              Sign in with OpenID Connect
            </Button>
            
            {isPrototyping && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-gray-500">
                      Or for development
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePrototypeLogin}
                  variant="outline"
                  className="w-full"
                >
                  Continue as Prototype User
                </Button>
              </>
            )}
          </div>
          
          <div className="flex justify-center">
            <Link
                to={`/subscriber/signup`}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Create subscriber account`}
            >
              List Your Business
            </Link>
            <br/>
            <Link
                to={`/subscriber`}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Show more information for subscribers`}
            >
              More Information
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
