import { getApiUrl } from '@/config/api';

export interface ProductResponse {
  productId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
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
  attributes: Record<string, any>;
}

export interface ProductsResponse {
  response: ProductResponse[];
  errorMessageApi?: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}

// Keep the ServiceResponse interface for backward compatibility
export interface ServiceResponse {
  producerServiceId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: "LOT_SIZE" | "PER_HOUR" | "PER_MILE" | "PER_VISIT" | "FIXED_ESTIMATE";
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export interface ServicesResponse {
  response: ServiceResponse[];
  errorMessageApi?: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}

export const fetchServices = async (producerId: string, locationId: string): Promise<ProductsResponse> => {
  const url = getApiUrl(`/producer/${producerId}/locationId/${locationId}/products`);
  
  console.log('🔧 Fetching products from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  
  const data: ProductsResponse = await response.json();
  
  console.log('🔧 Products response:', data);
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi.displayMessage || 'Failed to fetch products');
  }
  
  return data;
};

export const fetchAllLocationServices = async (producerId: string, locationIds: string[]): Promise<Record<string, ProductResponse[]>> => {
  const servicesMap: Record<string, ProductResponse[]> = {};
  
  // Fetch products for each location
  const promises = locationIds.map(async (locationId) => {
    try {
      const response = await fetchServices(producerId, locationId);
      servicesMap[locationId] = response.response || [];
    } catch (error) {
      console.warn(`Failed to fetch products for location ${locationId}:`, error);
      servicesMap[locationId] = [];
    }
  });
  
  await Promise.all(promises);
  
  return servicesMap;
};
