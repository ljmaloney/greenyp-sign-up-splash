
import { useQuery } from '@tanstack/react-query';
import { useLocationCache } from './useLocationCache';
import { fetchAllLocationProducts, ProductResponse } from '@/services/servicesService';

export const useProductsWithLocationCache = () => {
  const { locations, producerId, isLoading: locationsLoading } = useLocationCache();

  const locationIds = locations.map(loc => loc.locationId);

  const {
    data: productsData,
    isLoading: productsLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['all-location-products', producerId, locationIds],
    queryFn: () => fetchAllLocationProducts(producerId!, locationIds),
    enabled: !!producerId && locationIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Group products by location
  const groupedProducts: Record<string, ProductResponse[]> = productsData || {};

  // Transform locations data for display
  const transformedLocations = locations.map(location => ({
    id: location.locationId,
    name: location.locationName,
    address: `${location.addressLine1}, ${location.city}, ${location.state} ${location.postalCode}`
  }));

  return {
    locations: transformedLocations,
    groupedProducts,
    isLoading: locationsLoading || productsLoading,
    error,
    refetch,
    producerId
  };
};
