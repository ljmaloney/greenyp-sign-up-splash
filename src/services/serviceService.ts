
import { getApiUrl } from '@/config/api';

export interface ServiceUpdateRequest {
  producerId: string;
  producerLocationId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: string;
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export const updateService = async (serviceId: string, data: ServiceUpdateRequest): Promise<void> => {
  const response = await fetch(getApiUrl(`/producer/location/service/${serviceId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update service: ${response.status}`);
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const response = await fetch(getApiUrl(`/producer/location/service/${serviceId}`), {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete service: ${response.status}`);
  }
};
