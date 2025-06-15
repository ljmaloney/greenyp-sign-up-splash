
import React, { useEffect } from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Leaf } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loginAsPrototype } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Check if we're in a prototyping environment (Lovable platform)
  const isPrototyping = window.location.hostname.includes('lovable') || 
                       window.location.hostname === 'localhost';

  // Auto-redirect in prototyping environment
  useEffect(() => {
    if (isPrototyping && !isAuthenticated) {
      console.log('🔧 Prototyping environment detected, auto-redirecting...');
      loginAsPrototype();
      setTimeout(() => {
        navigate(from);
      }, 100);
    }
  }, [isPrototyping, isAuthenticated, loginAsPrototype, navigate, from]);

  // If already authenticated, redirect to intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = () => {
    if (isPrototyping) {
      loginAsPrototype();
      navigate(from);
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isPrototyping ? 'Prototype Mode' : 'Sign in to your account'}
          </CardTitle>
          {isPrototyping && (
            <p className="text-sm text-gray-600 mt-2">
              Running in prototype mode - authentication is simulated
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white" 
            >
              {isPrototyping ? 'Continue to Dashboard' : 'Sign in with OpenID Connect'}
            </Button>
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
