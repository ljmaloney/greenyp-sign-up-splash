
import { useQuery } from '@tanstack/react-query';
import { ClassifiedFilters } from '@/types/classifieds';
import { useApiClient } from './useApiClient';
import { fetchClassifieds } from '@/services/classifiedsService';

export const useClassifieds = (filters: ClassifiedFilters) => {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['classifieds', filters],
    queryFn: () => fetchClassifieds(filters, apiClient),
    staleTime: 5 * 60 * 1000,
  });
};
