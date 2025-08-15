
// Import the type returned by useApiClient hook
type ApiClient = ReturnType<typeof import('@/hooks/useApiClient').useApiClient>;

export interface ServiceCreateRequest {
  producerId: string;
  producerLocationId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: "LOT_SIZE" | "PER_HOUR" | "PER_MILE" | "PER_VISIT" | "FIXED_ESTIMATE";
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export interface ServiceUpdateRequest {
  serviceId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: "LOT_SIZE" | "PER_HOUR" | "PER_MILE" | "PER_VISIT" | "FIXED_ESTIMATE";
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export interface ServiceDiscontinueRequest {
  discontinueDate: string;
}

export const createService = async (apiClient: ApiClient, serviceData: ServiceCreateRequest): Promise<any> => {
  const response = await apiClient.post('/producer/location/service', serviceData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to create service: ${response.error}`);
  }

  return response.response;
};

export const updateService = async (apiClient: ApiClient, serviceData: ServiceUpdateRequest): Promise<any> => {
  const response = await apiClient.put('/producer/location/service', serviceData, { requireAuth: true });
  
  if (response.error) {
    throw new Error(`Failed to update service: ${response.error}`);
  }

  return response.response;
};

export const deleteService = async (apiClient: ApiClient, serviceId: string): Promise<any> => {
  const response = await apiClient.delete('/producer/service', { 
    requireAuth: true,
    body: JSON.stringify({ serviceId })
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to delete service: ${response.error}`);
  }

  return response.response;
};

export const discontinueService = async (apiClient: ApiClient, serviceId: string, serviceData: ServiceDiscontinueRequest): Promise<any> => {
  const response = await apiClient.delete('/producer/location/service/discontinue', { 
    requireAuth: true,
    body: JSON.stringify({ serviceId, ...serviceData })
  } as any);
  
  if (response.error) {
    throw new Error(`Failed to discontinue service: ${response.error}`);
  }

  return response.response;
};
