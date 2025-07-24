
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategories } from '../services/categoryService';
import { CategoryWithIcon } from '../types/category';

export const useCategoriesCache = () => {
  const queryClient = useQueryClient();

  // Prefetch categories data
  const prefetchCategories = async () => {
    console.log('🔄 Prefetching categories data...');
    try {
      await queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
      });
      console.log('✅ Categories data prefetched successfully');
    } catch (error) {
      console.error('❌ Error prefetching categories:', error);
    }
  };

  // Get cached categories data without triggering a network request
  const getCachedCategories = (): CategoryWithIcon[] | undefined => {
    const cachedData = queryClient.getQueryData<CategoryWithIcon[]>(['categories']);
    console.log('📋 Cache check - Categories available:', !!cachedData, 'Count:', cachedData?.length || 0);
    return cachedData;
  };

  // Check if categories are cached and fresh
  const isCategoriesCached = (): boolean => {
    const queryState = queryClient.getQueryState(['categories']);
    const isCached = !!queryState?.data;
    const isStale = queryState?.isStale;
    console.log('🔍 Cache state - Cached:', isCached, 'Stale:', isStale);
    return isCached && !isStale;
  };

  // Invalidate categories cache (useful for forced refresh)
  const invalidateCategories = async () => {
    console.log('🗑️ Invalidating categories cache...');
    await queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  return {
    prefetchCategories,
    getCachedCategories,
    isCategoriesCached,
    invalidateCategories,
  };
};
