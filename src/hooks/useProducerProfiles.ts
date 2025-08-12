
import { useQuery } from '@tanstack/react-query';
import { fetchProducerProfiles, fetchProducerProfilesByLobUrl } from '@/services/producerProfileService';

export const useProducerProfiles = (lineOfBusinessId: string) => {
  return useQuery({
    queryKey: ['producerProfiles', lineOfBusinessId],
    queryFn: () => fetchProducerProfiles(lineOfBusinessId),
    enabled: !!lineOfBusinessId,
  });
};

export const useProducerProfilesByLobUrl = (lobUrl: string, mostRecent: boolean = true, number: number = 6) => {
  return useQuery({
    queryKey: ['producerProfilesByLobUrl', lobUrl, mostRecent, number],
    queryFn: () => fetchProducerProfilesByLobUrl(lobUrl, mostRecent, number),
    enabled: !!lobUrl,
  });
};
