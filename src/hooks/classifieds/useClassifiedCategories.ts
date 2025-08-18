
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { ClassifiedCategoriesResponse } from '@/types/classifiedCategories';

export const useClassifiedCategories = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classified-categories'],
    queryFn: async (): Promise<ClassifiedCategoriesResponse> => {
      console.log('🏷️ Fetching classified categories from API...');
      const response = await apiClient.get(
        '/reference/classified/categories',
        { requireAuth: false }
      );
      
      console.log('🏷️ Classified categories response:', response);
      
      // Transform the API response to match our expected structure
      return {
        response: Array.isArray(response.response) ? response.response : [],
        errorMessageApi: response.errorMessageApi
      };
    },
    staleTime: 0, // Force fresh data - no cache
    gcTime: 0, // No cache time - always fetch fresh
  });
};
