
import { useQuery } from '@tanstack/react-query';
import { useLocationCache } from './useLocationCache';
import { fetchAllLocationServices, ProductResponse } from '@/services/servicesService';

export const useServicesWithLocationCache = () => {
  const { locations, producerId, isLoading: locationsLoading } = useLocationCache();

  const locationIds = locations.map(loc => loc.locationId);

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['all-location-services', producerId, locationIds],
    queryFn: () => fetchAllLocationServices(producerId!, locationIds),
    enabled: !!producerId && locationIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Group products by location
  const groupedServices: Record<string, ProductResponse[]> = servicesData || {};

  // Transform locations data for display
  const transformedLocations = locations.map(location => ({
    id: location.locationId,
    name: location.locationName,
    address: `${location.addressLine1}, ${location.city}, ${location.state} ${location.postalCode}`
  }));

  return {
    locations: transformedLocations,
    groupedServices,
    isLoading: locationsLoading || servicesLoading,
    error,
    refetch,
    producerId
  };
};
