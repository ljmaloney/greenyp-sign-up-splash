
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/categoryService';
import { CategoryWithIcon } from '../types/category';

export const useCategories = () => {
  return useQuery<CategoryWithIcon[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};
