
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useApiClient } from './useApiClient';
import { createAccountService } from '../services/accountService';

export const useAccountData = () => {
  const { user } = useAuth();
  const apiClient = useApiClient();
  
  // Note: This assumes the user.id is actually the producerId
  // If the user.id is not the producerId, you'll need to adjust this
  const producerId = user?.id || null;
  
  const accountService = createAccountService(apiClient);
  
  return useQuery({
    queryKey: ['account-data', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required to fetch account data');
      }
      return accountService.fetchAccountData(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
  });
};
