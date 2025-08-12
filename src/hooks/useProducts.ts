
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';
import { useApiClient } from '@/hooks/useApiClient';

export const useProducts = (producerId: string | undefined, locationId: string | undefined) => {
  console.log('useProducts called with:', { producerId, locationId });
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['products', producerId, locationId],
    queryFn: () => {
      console.log('Executing fetchProducts with:', { producerId, locationId });
      return fetchProducts(apiClient, producerId!, locationId!);
    },
    enabled: !!producerId && !!locationId,
  });
};
