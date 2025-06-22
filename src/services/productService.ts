import { ProductsResponse } from '@/types/profile';
import { getApiUrl } from '@/config/api';

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

export const fetchProducts = async (locationId: string): Promise<ProductsResponse> => {
  const response = await fetch(getApiUrl(`/producer/location/${locationId}/products`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  
  return response.json();
};

export const createProduct = async (productData: ProductCreateRequest): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/location/product'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.status}`);
  }

  return response.json();
};

export const updateProduct = async (productData: ProductUpdateRequest): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/location/product'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status}`);
  }

  return response.json();
};

export const deleteProduct = async (productId: string): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/product'), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.status}`);
  }

  return response.json();
};

export const discontinueProduct = async (productData: ProductDiscontinueRequest): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/location/product'), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`Failed to discontinue product: ${response.status}`);
  }

  return response.json();
};
