
import { ProductsResponse } from '@/types/profile';
import { getApiUrl } from '@/config/api';

export const fetchProducts = async (locationId: string): Promise<ProductsResponse> => {
  const response = await fetch(getApiUrl(`/producer/location/${locationId}/products`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  
  return response.json();
};
