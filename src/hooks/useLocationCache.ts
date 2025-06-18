
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';
import { fetchLocations, Location } from '@/services/locationService';

export const useLocationCache = () => {
  const { user } = useAuth();
  const { data: accountData } = useAccountData();
  const queryClient = useQueryClient();
  
  const producerId = accountData?.producer?.producerId;

  const {
    data: locations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['locations-cache', producerId],
    queryFn: () => fetchLocations(producerId!),
    enabled: !!producerId && !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const invalidateLocationCache = () => {
    queryClient.invalidateQueries({ queryKey: ['locations-cache', producerId] });
  };

  const updateLocationCache = (updatedLocation: Location) => {
    queryClient.setQueryData(['locations-cache', producerId], (oldData: Location[] | undefined) => {
      if (!oldData) return [updatedLocation];
      
      const existingIndex = oldData.findIndex(loc => loc.locationId === updatedLocation.locationId);
      if (existingIndex >= 0) {
        // Update existing location
        const newData = [...oldData];
        newData[existingIndex] = updatedLocation;
        return newData;
      } else {
        // Add new location
        return [...oldData, updatedLocation];
      }
    });
  };

  return {
    locations: locations || [],
    isLoading,
    error,
    invalidateLocationCache,
    updateLocationCache,
    producerId
  };
};
