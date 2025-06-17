
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAccountData } from '../services/accountService';

export const useAccountData = () => {
  const { user } = useAuth();
  const externalUserRef = user?.id || null;
  
  return useQuery({
    queryKey: ['account-data', externalUserRef],
    queryFn: () => {
      if (!externalUserRef) {
        throw new Error('User ID is required to fetch account data');
      }
      return fetchAccountData(externalUserRef);
    },
    enabled: !!externalUserRef,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
  });
};
