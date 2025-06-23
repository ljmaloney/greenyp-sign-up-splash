
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';

export const useProducts = (producerId: string | undefined, locationId: string | undefined) => {
  return useQuery({
    queryKey: ['products', producerId, locationId],
    queryFn: () => fetchProducts(producerId!, locationId!),
    enabled: !!producerId && !!locationId,
  });
};
