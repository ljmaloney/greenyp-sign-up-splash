
import React, { createContext, useContext, useEffect } from 'react';
import { useCategoriesCache } from '@/hooks/useCategoriesCache';
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';

interface CategoriesContextValue {
  categories: CategoryWithIcon[] | undefined;
  isLoading: boolean;
  error: Error | null;
  prefetchCategories: () => Promise<void>;
  getCachedCategories: () => CategoryWithIcon[] | undefined;
  isCategoriesCached: () => boolean;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

interface CategoriesProviderProps {
  children: React.ReactNode;
  prefetchOnMount?: boolean;
}

export const CategoriesProvider = ({ children, prefetchOnMount = true }: CategoriesProviderProps) => {
  const { data: categories, isLoading, error } = useCategories();
  const categoriesCache = useCategoriesCache();

  // Prefetch categories when component mounts
  useEffect(() => {
    if (prefetchOnMount && !categoriesCache.isCategoriesCached()) {
      console.log('🚀 CategoriesProvider: Prefetching categories on mount');
      categoriesCache.prefetchCategories();
    }
  }, [prefetchOnMount, categoriesCache]);

  const contextValue: CategoriesContextValue = {
    categories,
    isLoading,
    error,
    ...categoriesCache,
  };

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
};
