
import { oidcService } from '@/services/oidcService';
import { User } from '@/types/auth';

export const useAuthActions = (
  setIsLoading: (loading: boolean) => void,
  setUser: (user: User | null) => void,
  setAccessToken: (token: string | null) => void,
  user: User | null
) => {
  const login = () => {
    console.log('🚀 AUTH CONTEXT - Starting login process...');
    setIsLoading(true);
    oidcService.login();
  };

  const logout = async () => {
    try {
      console.log('🚪 AUTH CONTEXT - Starting logout...');
      setIsLoading(true);
      await oidcService.logout();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('❌ AUTH CONTEXT - Logout failed:', error);
      await oidcService.removeUser();
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    const result = user?.roles.includes(role) ?? false;
    console.log('🔍 AUTH CONTEXT - Role check:', {
      requestedRole: role,
      userRoles: user?.roles,
      hasRole: result
    });
    return result;
  };

  return {
    login,
    logout,
    hasRole
  };
};
