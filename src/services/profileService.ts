
import { ProducerProfileResponse } from '@/types/profile';
import { getApiUrl } from '@/config/api';

export const fetchProducerProfile = async (producerLocationId: string): Promise<ProducerProfileResponse> => {
  const response = await fetch(getApiUrl(`/producer/profile/${producerLocationId}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producer profile: ${response.status}`);
  }
  
  return response.json();
};
