
import { useQuery } from '@tanstack/react-query';
import { fetchProducerProfiles } from '@/services/producerProfileService';

export const useProducerProfiles = (lineOfBusinessId: string) => {
  return useQuery({
    queryKey: ['producerProfiles', lineOfBusinessId],
    queryFn: () => fetchProducerProfiles(lineOfBusinessId),
    enabled: !!lineOfBusinessId,
  });
};
