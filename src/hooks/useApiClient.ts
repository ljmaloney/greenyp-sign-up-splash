
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/apiClient';
import { useMemo } from 'react';

export const useApiClient = () => {
  const { accessToken } = useAuth();

  const authenticatedApiClient = useMemo(() => {
    // Set the access token getter on the existing apiClient instance
    apiClient.setAccessTokenGetter(async () => {
      console.log('🔑 Getting access token:', accessToken ? 'Token available' : 'No token');
      return accessToken;
    });
    
    return apiClient;
  }, [accessToken]);

  return authenticatedApiClient;
};
