
import { useQuery } from '@tanstack/react-query';
import { fetchAuthorizedUsers, AuthorizedUserResponse } from '@/services/authorizedUsersService';

export const useAuthorizedUsers = (producerId: string | null) => {
  return useQuery<AuthorizedUserResponse[], Error>({
    queryKey: ['authorizedUsers', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      return fetchAuthorizedUsers(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
