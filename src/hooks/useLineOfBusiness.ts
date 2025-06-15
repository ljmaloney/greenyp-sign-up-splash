
import { useQuery } from '@tanstack/react-query';
import { fetchLineOfBusiness, LineOfBusiness } from '@/services/lineOfBusinessService';

export const useLineOfBusiness = () => {
  return useQuery<LineOfBusiness[], Error>({
    queryKey: ['lineOfBusiness'],
    queryFn: fetchLineOfBusiness,
    staleTime: 60 * 60 * 1000, // 1 hour - line of business data doesn't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache time
    retry: 3, // Retry failed requests
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
