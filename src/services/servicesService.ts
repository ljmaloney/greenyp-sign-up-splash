
import { ServicesResponse } from '@/types/profile';
import { getApiUrl } from '@/config/api';

export const fetchServices = async (producerId: string, locationId: string): Promise<ServicesResponse> => {
  const response = await fetch(getApiUrl(`/producer/${producerId}/location/${locationId}/services`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`);
  }
  
  return response.json();
};
