
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/services/profileService';

export const useProfile = (producerId: string) => {
  return useQuery({
    queryKey: ['profile', producerId],
    queryFn: () => fetchProfile(producerId),
    enabled: !!producerId,
  });
};
