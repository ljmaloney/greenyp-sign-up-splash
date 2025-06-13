
import { useQuery } from '@tanstack/react-query';
import { fetchAccountData, AccountData } from '@/services/accountService';

export const useAccountData = (externalUserRef: string | null) => {
  return useQuery<AccountData, Error>({
    queryKey: ['accountData', externalUserRef],
    queryFn: () => fetchAccountData(externalUserRef!),
    enabled: !!externalUserRef,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  });
};
