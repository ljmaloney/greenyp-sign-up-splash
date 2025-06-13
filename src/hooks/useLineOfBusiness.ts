
import { useQuery } from '@tanstack/react-query';
import { fetchLineOfBusiness, LineOfBusiness } from '@/services/lineOfBusinessService';

export const useLineOfBusiness = () => {
  return useQuery<LineOfBusiness[], Error>({
    queryKey: ['lineOfBusiness'],
    queryFn: fetchLineOfBusiness,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
