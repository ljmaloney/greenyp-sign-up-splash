
import { useQuery } from '@tanstack/react-query';
import { fetchLocations, Location } from '@/services/locationService';

export const useLocations = (producerId: string | null) => {
  return useQuery<Location[], Error>({
    queryKey: ['locations', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      return fetchLocations(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
