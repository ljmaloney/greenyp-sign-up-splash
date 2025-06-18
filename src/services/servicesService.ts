
import { getApiUrl } from '@/config/api';

export interface ServiceResponse {
  producerServiceId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: string;
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

export const fetchServices = async (producerId: string, locationId: string): Promise<ServicesResponse> => {
  const url = getApiUrl(`/producer/${producerId}/locationId/${locationId}/services`);
  
  console.log('🔧 Fetching services from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
  }
  
  const data: ServicesResponse = await response.json();
  
  console.log('🔧 Services response:', data);
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi.displayMessage || 'Failed to fetch services');
  }
  
  return data;
};

export const fetchAllLocationServices = async (producerId: string, locationIds: string[]): Promise<Record<string, ServiceResponse[]>> => {
  const servicesMap: Record<string, ServiceResponse[]> = {};
  
  // Fetch services for each location
  const promises = locationIds.map(async (locationId) => {
    try {
      const response = await fetchServices(producerId, locationId);
      servicesMap[locationId] = response.response || [];
    } catch (error) {
      console.warn(`Failed to fetch services for location ${locationId}:`, error);
      servicesMap[locationId] = [];
    }
  });
  
  await Promise.all(promises);
  
  return servicesMap;
};
