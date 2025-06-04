
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchProducerProfile } from '@/services/profileService';

export const useProfile = (producerId: string) => {
  return useQuery({
    queryKey: ['profile', producerId],
    queryFn: () => fetchProfile(producerId),
    enabled: !!producerId,
  });
};

export const useProducerProfile = (producerLocationId: string) => {
  return useQuery({
    queryKey: ['producerProfile', producerLocationId],
    queryFn: () => fetchProducerProfile(producerLocationId),
    enabled: !!producerLocationId,
  });
};
