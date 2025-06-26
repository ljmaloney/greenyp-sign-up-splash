
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/apiClient';
import { useMemo } from 'react';

export const useApiClient = () => {
  const { accessToken } = useAuth();

  const authenticatedApiClient = useMemo(() => {
    // Create a copy of the apiClient with access to the current token
    const client = { ...apiClient };
    
    // Override the getAccessToken method to return the current token
    client.getAccessToken = async () => accessToken;
    
    return client;
  }, [accessToken]);

  return authenticatedApiClient;
};
