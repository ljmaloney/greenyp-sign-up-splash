
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';

export const useProducts = (locationId: string | undefined) => {
  return useQuery({
    queryKey: ['products', locationId],
    queryFn: () => fetchProducts(locationId!),
    enabled: !!locationId,
  });
};
