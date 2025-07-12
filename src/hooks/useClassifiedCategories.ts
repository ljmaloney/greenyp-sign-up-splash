
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { ClassifiedCategoriesResponse } from '@/types/classifiedCategories';

export const useClassifiedCategories = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classified-categories'],
    queryFn: async (): Promise<ClassifiedCategoriesResponse> => {
      console.log('🏷️ Fetching classified categories from API...');
      const response: ClassifiedCategoriesResponse = await apiClient.get(
        '/reference/classified/categories',
        { requireAuth: false }
      );
      
      console.log('🏷️ Classified categories response:', response);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache time
    refetchOnWindowFocus: false,
  });
};
