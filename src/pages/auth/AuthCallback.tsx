
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { oidcService } from '@/services/oidcService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(`Authentication error: ${errorParam}`);
          return;
        }

        if (!code || !state) {
          setError('Missing authorization code or state');
          return;
        }

        // Exchange code for tokens
        const tokens = await oidcService.exchangeCodeForTokens(code, state);
        oidcService.storeTokens(tokens);

        // Get user info
        const userInfo = await oidcService.getUserInfo(tokens.access_token);
        
        // Transform to our User format
        const user = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          roles: userInfo.roles || ['Greepages-Subscriber']
        };

        localStorage.setItem('oidc_user', JSON.stringify(user));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Completing authentication...</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
