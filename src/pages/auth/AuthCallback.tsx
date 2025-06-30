
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oidcService } from '@/services/oidcService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          
          console.log('👥 User roles:', roles);
          
          // Determine redirect URL based on roles - check admin roles FIRST (highest priority)
          let redirectUrl = '/dashboard'; // default fallback
          
          // Check for admin roles FIRST (highest priority) - case insensitive
          const adminRoles = ['greenpages-admin', 'admin', 'sysadmin'];
          const hasAdminRole = roles.some(role => 
            adminRoles.includes(role.toLowerCase())
          );
          
          console.log('🔧 Admin role check:', {
            userRoles: roles,
            adminRoles,
            hasAdminRole,
            rolesLowerCase: roles.map(r => r.toLowerCase())
          });
          
          if (hasAdminRole) {
            redirectUrl = '/admin';
            console.log('🔧 Admin user detected, redirecting to /admin');
          } else {
            // Check for subscriber roles - case insensitive
            const subscriberRoles = ['greenpages-subscriber', 'greenpages-subscriberadmin'];
            const hasSubscriberRole = roles.some(role => 
              subscriberRoles.includes(role.toLowerCase())
            );
            
            console.log('👤 Subscriber role check:', {
              userRoles: roles,
              subscriberRoles,
              hasSubscriberRole,
              rolesLowerCase: roles.map(r => r.toLowerCase())
            });
            
            if (hasSubscriberRole) {
              redirectUrl = '/dashboard';
              console.log('👤 Subscriber user detected, redirecting to /dashboard');
            } else {
              console.log('⚠️ No recognized roles found, defaulting to /dashboard');
              redirectUrl = '/dashboard';
            }
          }
          
          console.log('🚀 Final redirect decision:', {
            userRoles: roles,
            redirectUrl,
            hasAdminRole,
            timestamp: new Date().toISOString()
          });
          
          // Force a full page reload to ensure the AuthContext picks up the new user
          window.location.href = redirectUrl;
        } else {
          console.error('❌ Invalid user from callback:', user);
          setError('Authentication failed - invalid user session');
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
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
