
import { ProfileResponse, ProducerProfileResponse } from '@/types/profile';
import { getApiUrl } from '@/config/api';

export const fetchProfile = async (producerId: string): Promise<ProfileResponse> => {
  const response = await fetch(getApiUrl(`/subscriber/${producerId}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }
  
  return response.json();
};

export const fetchProducerProfile = async (producerLocationId: string): Promise<ProducerProfileResponse> => {
  const response = await fetch(getApiUrl(`/producer/profile/${producerLocationId}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producer profile: ${response.status}`);
  }
  
  return response.json();
};
