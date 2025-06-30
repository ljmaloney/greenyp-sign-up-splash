
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oidcService } from '@/services/oidcService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔥 AUTH CALLBACK COMPONENT MOUNTED - This should appear in logs if callback is being called');
    console.log('📍 Current URL in AuthCallback:', window.location.href);
    console.log('📍 URL search params:', window.location.search);
    console.log('📍 URL hash:', window.location.hash);
    
    const handleCallback = async () => {
      try {
        console.log('🔄 Starting callback handling...');
        const user = await oidcService.handleCallback();
        
        console.log('✅ Callback completed, user received:', {
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
          console.log('🎯 User is valid, determining redirect based on roles...');
          
          // Transform user to get roles
          const userInfo = oidcService.transformUser(user);
          const roles = userInfo.roles || [];
          
          console.log('👥 CALLBACK - User roles from token:', roles);
          console.log('🔍 CALLBACK - Raw user info:', userInfo);
          
          // SIMPLE ROLE-BASED REDIRECTION LOGIC
          let redirectUrl = '/dashboard'; // default fallback
          
          // Check for GreenPages-Admin FIRST (highest priority)
          const hasAdminRole = roles.some(role => 
            role === 'GreenPages-Admin'
          );
          
          if (hasAdminRole) {
            redirectUrl = '/admin';
            console.log('🔧 CALLBACK - GreenPages-Admin detected - redirecting to /admin');
          } else {
            // Check for subscriber roles
            const hasSubscriberRole = roles.some(role => 
              role === 'GreenPages-Subscriber' || role === 'GreenPages-SubscriberAdmin'
            );
            
            if (hasSubscriberRole) {
              redirectUrl = '/dashboard';
              console.log('👤 CALLBACK - GreenPages-Subscriber/SubscriberAdmin detected - redirecting to /dashboard');
            } else {
              console.log('⚠️ CALLBACK - NO RECOGNIZED ROLES - defaulting to /dashboard');
              redirectUrl = '/dashboard';
            }
          }
          
          console.log('🚀 CALLBACK - FINAL REDIRECT DECISION:', {
            userEmail: userInfo.email,
            userId: userInfo.sub,
            userRoles: roles,
            hasAdminRole,
            finalRedirectUrl: redirectUrl,
            timestamp: new Date().toISOString()
          });
          
          // Force a full page reload to ensure the AuthContext picks up the new user
          console.log(`🔀 CALLBACK - Redirecting to: ${redirectUrl}`);
          window.location.href = redirectUrl;
        } else {
          console.error('❌ CALLBACK - Invalid user from callback:', user);
          setError('Authentication failed - invalid user session');
        }
      } catch (error) {
        console.error('❌ CALLBACK - Auth callback error:', error);
        console.error('CALLBACK - Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          currentUrl: window.location.href
        });
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
