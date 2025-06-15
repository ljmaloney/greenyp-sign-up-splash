
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, UserData } from '@/services/userService';

export const useUserData = (externalUserRef: string | null) => {
  return useQuery<UserData, Error>({
    queryKey: ['userData', externalUserRef],
    queryFn: () => fetchUserData(externalUserRef!),
    enabled: !!externalUserRef,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
