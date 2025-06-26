
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useApiClient } from './useApiClient';
import { createAccountService } from '../services/accountService';

export const useAccountData = () => {
  const { user } = useAuth();
  const apiClient = useApiClient();
  
  // Use the external user reference (user.id) to look up the producer
  const externalUserRef = user?.id || null;
  
  const accountService = createAccountService(apiClient);
  
  return useQuery({
    queryKey: ['account-data', externalUserRef],
    queryFn: () => {
      if (!externalUserRef) {
        throw new Error('User ID is required to fetch account data');
      }
      return accountService.fetchAccountData(externalUserRef);
    },
    enabled: !!externalUserRef,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
  });
};
