
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { createAuthorizedUsersService, AuthorizedUserResponse } from '@/services/authorizedUsersService';

export const useAuthorizedUsers = (producerId: string | null) => {
  const apiClient = useApiClient();
  const authorizedUsersService = createAuthorizedUsersService(apiClient);
  
  return useQuery<AuthorizedUserResponse[], Error>({
    queryKey: ['authorizedUsers', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      return authorizedUsersService.fetchAuthorizedUsers(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
