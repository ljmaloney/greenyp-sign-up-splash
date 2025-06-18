
import { getApiUrl } from '@/config/api';

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

export const createService = async (serviceData: ServiceCreateRequest): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/location/service'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create service: ${response.status}`);
  }

  return response.json();
};

export const updateService = async (serviceData: ServiceUpdateRequest): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/location/service'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update service: ${response.status}`);
  }

  return response.json();
};

export const deleteService = async (serviceId: string): Promise<any> => {
  const response = await fetch(getApiUrl('/producer/service'), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete service: ${response.status}`);
  }

  return response.json();
};
