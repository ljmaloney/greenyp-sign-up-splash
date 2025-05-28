
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryServices } from '../services/categoryService';
import { CategoryService } from '../types/category';

export const useCategoryServices = (lineOfBusinessId: string) => {
  return useQuery<CategoryService[], Error>({
    queryKey: ['categoryServices', lineOfBusinessId],
    queryFn: () => fetchCategoryServices(lineOfBusinessId),
    enabled: !!lineOfBusinessId, // Only fetch if lineOfBusinessId is provided
  });
};
