
import { useQuery } from '@tanstack/react-query';
import { ClassifiedFilters } from '@/types/classifieds';
import { apiClient } from '@/utils/apiClient';
import { fetchClassifieds } from '@/services/classifiedsService';

export const useClassifieds = (filters: ClassifiedFilters, categoryName?: string) => {
  return useQuery({
    queryKey: ['classifieds', filters, categoryName],
    queryFn: () => fetchClassifieds(filters, apiClient, categoryName),
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
