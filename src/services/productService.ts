
import { ProductsResponse, Product } from '@/types/profile';
import { apiClient } from '@/utils/apiClient';

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

export const fetchProducts = async (producerId: string, locationId: string): Promise<ProductsResponse> => {
  const endpoint = `/producer/${producerId}/location/${locationId}/products`;
  console.log('Fetching products from endpoint:', endpoint);
  console.log('Producer ID:', producerId, 'Location ID:', locationId);
  
  const response = await apiClient.get<{ response: Product[] }>(endpoint, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to fetch products: ${response.error}`);
  }
  
  // The API response is already in the correct format
  return response as unknown as ProductsResponse;
};

export const createProduct = async (productData: ProductCreateRequest): Promise<any> => {
  const response = await apiClient.post('/producer/location/product', productData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to create product: ${response.error}`);
  }

  return response.response;
};

export const updateProduct = async (productData: ProductUpdateRequest): Promise<any> => {
  const response = await apiClient.put('/producer/location/product', productData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to update product: ${response.error}`);
  }

  return response.response;
};

export const deleteProduct = async (productId: string): Promise<any> => {
  const response = await apiClient.delete('/producer/product', { 
    requireAuth: true,
    body: JSON.stringify({ productId })
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to delete product: ${response.error}`);
  }

  return response.response;
};

export const discontinueProduct = async (productData: ProductDiscontinueRequest): Promise<any> => {
  const response = await apiClient.delete('/producer/location/product/discontinue', { 
    requireAuth: true,
    body: JSON.stringify(productData)
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to discontinue product: ${response.error}`);
  }

  return response.response;
};
