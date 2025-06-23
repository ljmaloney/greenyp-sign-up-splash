
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';

export const useProducts = (producerId: string | undefined, locationId: string | undefined) => {
  console.log('useProducts called with:', { producerId, locationId });
  
  return useQuery({
    queryKey: ['products', producerId, locationId],
    queryFn: () => {
      console.log('Executing fetchProducts with:', { producerId, locationId });
      return fetchProducts(producerId!, locationId!);
    },
    enabled: !!producerId && !!locationId,
  });
};
