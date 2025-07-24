
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/categoryService';
import { CategoryWithIcon } from '../types/category';

export const useCategories = () => {
  return useQuery<CategoryWithIcon[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache time - keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 3, // Retry failed requests 3 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
