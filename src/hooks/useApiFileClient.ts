import { useEffect } from 'react';
import { apiFileClient } from '@/utils/apiClientFile';
import { useAuth } from '@/contexts/AuthContext';

export const useApiFileClient = () => {
  const { accessToken } = useAuth();

  useEffect(() => {
    // Set up a simple getter that returns the current access token
    const getToken = async () => {
      return accessToken;
    };
    
    apiFileClient.setAccessTokenGetter(getToken);
  }, [accessToken]);

  return apiFileClient;
};
