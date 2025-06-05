
import { useQuery } from '@tanstack/react-query';
import { fetchProducerProfile } from '@/services/profileService';

export const useProducerProfile = (producerLocationId: string) => {
  return useQuery({
    queryKey: ['producerProfile', producerLocationId],
    queryFn: () => fetchProducerProfile(producerLocationId),
    enabled: !!producerLocationId,
  });
};
