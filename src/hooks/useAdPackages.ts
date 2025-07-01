
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { AdPackagesResponse } from '@/types/adPackages';

export const useAdPackages = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['ad-packages'],
    queryFn: async (): Promise<AdPackagesResponse> => {
      console.log('🎯 Fetching ad packages from API...');
      const response = await apiClient.get('/reference/classified/ad/types');
      console.log('📦 Ad packages response:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
  });
};
