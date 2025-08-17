import { useQuery } from '@tanstack/react-query';
import { ClassifiedFilters } from '@/types/classifieds';
import { apiClient } from '@/utils/apiClient';
import { fetchClassifieds } from '@/services/classifiedsService';

export const useClassifieds = (filters: ClassifiedFilters, categoryName?: string) => {
  return useQuery({
    queryKey: ['classifieds', filters, categoryName],
    queryFn: () => fetchClassifieds(filters, apiClient, categoryName),
    staleTime: 0, // NO CACHING - always fresh search results
    gcTime: 0, // NO CACHE STORAGE - never store search results
  });
};
