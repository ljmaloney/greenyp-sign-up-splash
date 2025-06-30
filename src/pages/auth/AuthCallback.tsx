
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
          
          // Determine redirect URL based on roles - check admin roles FIRST (highest priority)
          let redirectUrl = '/dashboard'; // default fallback
          
          // Normalize roles to lowercase for comparison
          const normalizedRoles = roles.map(role => role.toLowerCase());
          console.log('🔄 CALLBACK - Normalized roles:', normalizedRoles);
          
          // Define COMPREHENSIVE admin role patterns
          const adminRolePatterns = [
            'greenpages-admin',
            'greepages-admin',   // handle typo variation
            'admin', 
            'sysadmin',
            'administrator'
          ];
          
          // Check if user has any admin role - use exact matching
          const hasAdminRole = normalizedRoles.some(userRole => {
            // Check for exact match with admin patterns
            const isExactMatch = adminRolePatterns.includes(userRole);
            // Also check if the user role contains 'admin' 
            const containsAdmin = userRole.includes('admin');
            
            console.log('🔍 CALLBACK - Admin role check for:', userRole, {
              isExactMatch,
              containsAdmin,
              matchesAnyPattern: isExactMatch || containsAdmin,
              checkedAgainst: adminRolePatterns
            });
            
            return isExactMatch || containsAdmin;
          });
          
          console.log('🔧 CALLBACK - Admin role check details:', {
            originalRoles: roles,
            normalizedRoles,
            adminRolePatterns,
            hasAdminRole,
            userEmail: userInfo.email,
            detailedCheck: normalizedRoles.map(role => ({
              role,
              matchesAdmin: adminRolePatterns.includes(role) || role.includes('admin')
            }))
          });
          
          if (hasAdminRole) {
            redirectUrl = '/admin';
            console.log('🔧 CALLBACK - ADMIN USER DETECTED - redirecting to /admin');
          } else {
            // Check for subscriber roles - case insensitive with COMPREHENSIVE patterns
            const subscriberRolePatterns = [
              'greenpages-subscriber', 
              'greepages-subscriber',  // handle typo variation
              'greenpages-subscriberadmin',
              'greepages-subscriberadmin',  // handle typo variation
              'subscriber'
            ];
            
            const hasSubscriberRole = normalizedRoles.some(userRole => 
              subscriberRolePatterns.some(subPattern => 
                userRole.includes(subPattern) || subPattern.includes(userRole)
              )
            );
            
            console.log('👤 CALLBACK - Subscriber role check details:', {
              originalRoles: roles,
              normalizedRoles,
              subscriberRolePatterns,
              hasSubscriberRole,
              userEmail: userInfo.email,
              matchingPatterns: subscriberRolePatterns.filter(pattern => 
                normalizedRoles.some(userRole => 
                  userRole.includes(pattern) || pattern.includes(userRole)
                )
              )
            });
            
            if (hasSubscriberRole) {
              redirectUrl = '/dashboard';
              console.log('👤 CALLBACK - SUBSCRIBER USER DETECTED - redirecting to /dashboard');
            } else {
              console.log('⚠️ CALLBACK - NO RECOGNIZED ROLES - defaulting to /dashboard');
              redirectUrl = '/dashboard';
            }
          }
          
          console.log('🚀 CALLBACK - FINAL REDIRECT DECISION:', {
            userEmail: userInfo.email,
            userId: userInfo.sub,
            userRoles: roles,
            normalizedRoles,
            hasAdminRole,
            finalRedirectUrl: redirectUrl,
            timestamp: new Date().toISOString(),
            willUseWindowLocation: true
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
