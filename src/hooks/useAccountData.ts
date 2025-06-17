
import { useQuery } from '@tanstack/react-query';
import { fetchAccountData } from '../services/accountService';

export const useAccountData = () => {
  return useQuery({
    queryKey: ['account-data'],
    queryFn: fetchAccountData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
  });
};
