
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oidcService } from '@/services/oidcService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔥 AUTH CALLBACK - Component mounted');
    console.log('📍 Current URL:', window.location.href);
    
    const handleCallback = async () => {
      try {
        console.log('🔄 AUTH CALLBACK - Starting callback handling...');
        const user = await oidcService.handleCallback();
        
        console.log('✅ AUTH CALLBACK - Callback completed, user received:', {
          hasUser: !!user,
          userProfile: user ? {
            sub: user.profile?.sub,
            email: user.profile?.email,
            name: user.profile?.name,
            expired: user.expired,
            accessToken: user.access_token ? 'present' : 'missing'
          } : 'no user'
        });
        
        if (user && !user.expired) {
          console.log('🎯 AUTH CALLBACK - User is valid, determining redirect...');
          
          // Transform user to get roles
          const userInfo = oidcService.transformUser(user);
          const roles = userInfo.roles || [];
          
          console.log('👥 AUTH CALLBACK - User roles:', roles);
          
          // SIMPLE ROLE-BASED REDIRECTION - CASE INSENSITIVE
          let redirectUrl = '/dashboard'; // Default
          
          // Check each role (case insensitive)
          const hasAdminRole = roles.some(role => 
            role.toLowerCase() === 'greenpages-admin'
          );
          
          const hasSubscriberRole = roles.some(role => {
            const lowerRole = role.toLowerCase();
            return lowerRole === 'greenpages-subscriber' || 
                   lowerRole === 'greenpages-subscriberadmin';
          });
          
          if (hasAdminRole) {
            redirectUrl = '/admin';
            console.log('🔧 AUTH CALLBACK - ADMIN ROLE DETECTED - redirecting to /admin');
          } else if (hasSubscriberRole) {
            redirectUrl = '/dashboard';
            console.log('👤 AUTH CALLBACK - SUBSCRIBER ROLE DETECTED - redirecting to /dashboard');
          } else {
            console.log('⚠️ AUTH CALLBACK - NO RECOGNIZED ROLES - defaulting to /dashboard');
            redirectUrl = '/dashboard';
          }
          
          console.log('🚀 AUTH CALLBACK - FINAL REDIRECT DECISION:', {
            userEmail: userInfo.email,
            userRoles: roles,
            hasAdminRole,
            hasSubscriberRole,
            finalRedirectUrl: redirectUrl
          });
          
          // Force redirect
          console.log(`🔀 AUTH CALLBACK - Redirecting to: ${redirectUrl}`);
          window.location.href = redirectUrl;
        } else {
          console.error('❌ AUTH CALLBACK - Invalid user from callback:', user);
          setError('Authentication failed - invalid user session');
        }
      } catch (error) {
        console.error('❌ AUTH CALLBACK - Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

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
