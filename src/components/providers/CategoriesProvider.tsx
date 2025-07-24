
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCategoriesCache } from '@/hooks/useCategoriesCache';
import { Category } from '@/types/category';

interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  prefetchCategories: () => Promise<void>;
  isCategoriesCached: () => boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: React.ReactNode;
  prefetchOnMount?: boolean;
}

export const CategoriesProvider = ({ children, prefetchOnMount = false }: CategoriesProviderProps) => {
  const { prefetchCategories, isCategoriesCached } = useCategoriesCache();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (prefetchOnMount) {
      console.log('🚀 CategoriesProvider: Prefetching categories on mount');
      handlePrefetch();
    }
  }, [prefetchOnMount]);

  const handlePrefetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 CategoriesProvider: Starting prefetch');
      
      await prefetchCategories();
      const cachedCategories = isCategoriesCached();
      if (cachedCategories) {
        console.log('✅ CategoriesProvider: Prefetch successful');
      }
    } catch (err) {
      console.error('❌ CategoriesProvider: Prefetch failed:', err);
      setError(err instanceof Error ? err : new Error('Failed to prefetch categories'));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 CategoriesProvider: Manual refetch requested');
    handlePrefetch();
  };

  const value: CategoriesContextType = {
    categories,
    isLoading,
    error,
    refetch,
    prefetchCategories: handlePrefetch,
    isCategoriesCached
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
