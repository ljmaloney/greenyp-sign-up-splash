
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createLocationService, Location } from '@/services/locationService';

export const useLocations = (producerId: string | null) => {
  const apiClient = useApiClient();
  const locationService = createLocationService(apiClient);
  
  return useQuery<Location[], Error>({
    queryKey: ['locations', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      console.log('🏢 Fetching authenticated locations (legacy hook) for producer:', producerId);
      return locationService.fetchLocations(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
