
import { ProductsResponse } from '@/types/profile';
// Import the type returned by useApiClient hook
type ApiClient = ReturnType<typeof import('@/hooks/useApiClient').useApiClient>;

export interface ProductCreateRequest {
  producerId: string;
  producerLocationId: string;
  productType: "BAGGED_MATERIAL" | string;
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  attributes: Record<string, any>;
}

export interface ProductUpdateRequest {
  productId: string;
  productType: "BAGGED_MATERIAL" | string;
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  discontinued: boolean;
  discontinueDate?: string;
  lastOrderDate?: string;
  attributeMap: Record<string, any>;
}

export interface ProductDiscontinueRequest {
  productId: string;
  discontinueDate: string;
  lastOrderDate: string;
}

export const fetchProducts = async (apiClient: ApiClient, producerId: string, locationId: string): Promise<ProductsResponse> => {
  const endpoint = `/producer/${producerId}/location/${locationId}/products`;
  console.log('Fetching products from endpoint:', endpoint);
  console.log('Producer ID:', producerId, 'Location ID:', locationId);
  
  const response = await apiClient.get(endpoint, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to fetch products: ${response.error}`);
  }
  
  // Fix: Return the full API response structure, not just the array
  return response as ProductsResponse;
};

export const createProduct = async (apiClient: ApiClient, productData: ProductCreateRequest): Promise<any> => {
  const response = await apiClient.post('/producer/location/product', productData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to create product: ${response.error}`);
  }

  return response.response;
};

export const updateProduct = async (apiClient: ApiClient, productData: ProductUpdateRequest): Promise<any> => {
  const response = await apiClient.put('/producer/location/product', productData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to update product: ${response.error}`);
  }

  return response.response;
};

export const deleteProduct = async (apiClient: ApiClient, productId: string): Promise<any> => {
  const response = await apiClient.delete('/producer/product', { 
    requireAuth: true,
    body: JSON.stringify({ productId })
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to delete product: ${response.error}`);
  }

  return response.response;
};

export const discontinueProduct = async (apiClient: ApiClient, productData: ProductDiscontinueRequest): Promise<any> => {
  const response = await apiClient.delete('/producer/location/product/discontinue', { 
    requireAuth: true,
    body: JSON.stringify(productData)
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to discontinue product: ${response.error}`);
  }

  return response.response;
};
